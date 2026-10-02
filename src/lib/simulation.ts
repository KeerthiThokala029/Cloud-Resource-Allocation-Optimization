export interface ParsedData {
  headers: string[];
  rows: Record<string, number>[];
  filename: string;
}

export interface SimConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverProb: number;
  rotationAngle: number;
  numVMs: number;
  vmMIPS: number;
  energyModel: 'Linear' | 'Cubic' | 'Square';
}

export interface MetricsResult {
  energy: number;
  time: number;
  utilization: number;
  efficiency: number;
  cost: number;
}

export interface SimResults {
  traditional: MetricsResult;
  qiea: MetricsResult;
  fitnessHistory: number[];
  improvements: {
    energy: number;
    time: number;
    utilization: number;
    efficiency: number;
    cost: number;
  };
  taskCount: number;
  vmCount: number;
}

/* =========================================================
   POWER / ENERGY MODEL
   ========================================================= */

function getPowerFactor(model: string): number {
  if (model === 'Cubic') return 0.15;
  if (model === 'Square') return 0.12;
  return 0.1;
}

/* =========================================================
   COLUMN DETECTION
   ========================================================= */

function detectColumns(data: ParsedData) {
  const headers = data.headers;
  const rows = data.rows;

  const lower = headers.map(h => h.toLowerCase());

  const matchColumn = (
    candidates: string[]
  ): string | null => {
    // Exact match
    for (const candidate of candidates) {
      const index = lower.indexOf(candidate);

      if (index !== -1) {
        return headers[index];
      }
    }

    // Partial match
    for (const candidate of candidates) {
      const index = lower.findIndex(
        h => h.includes(candidate)
      );

      if (index !== -1) {
        return headers[index];
      }
    }

    return null;
  };

  const taskId = matchColumn([
    'task_id',
    'id',
    'taskid',
    'cloudlet_id',
    'job_id'
  ]);

  let workload = matchColumn([
    'length',
    'mi',
    'workload',
    'size',
    'cloudlet_length',
    'task_length'
  ]);

  const deadline = matchColumn([
    'deadline',
    'due',
    'max_time'
  ]);

  /*
   * If no workload column is found,
   * select the numeric column with the
   * highest average value.
   */
  if (!workload) {
    let maxAverage = -1;

    for (const header of headers) {
      if (header === taskId) continue;

      const average =
        rows.reduce(
          (sum, row) =>
            sum + (row[header] || 0),
          0
        ) / rows.length;

      if (average > maxAverage) {
        maxAverage = average;
        workload = header;
      }
    }
  }

  if (!workload) {
    workload =
      headers[1] ||
      headers[0];
  }

  return {
    workload,
    deadline,
    taskId
  };
}

/* =========================================================
   SMALL DELAY FOR PROGRESS UI
   ========================================================= */

function sleep(ms: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

/* =========================================================
   SEEDED RANDOM NUMBER GENERATOR
   =========================================================
   Keeps identical simulations reproducible.
   ========================================================= */

const SIMULATION_SEED = 42;

function createSeededRandom(
  seed: number
): () => number {
  let state = seed >>> 0;

  return () => {
    state =
      (state * 1664525 + 1013904223) >>> 0;

    return state / 4294967296;
  };
}

/* =========================================================
   EVALUATION FUNCTION
   ========================================================= */

function evaluate(
  tasks: Record<string, number>[],
  assignment: number[],
  numVMs: number,
  vmMIPS: number,
  pf: number,
  getWorkload: (
    task: Record<string, number>
  ) => number,
  getDeadline: (
    task: Record<string, number>
  ) => number
): MetricsResult {

  const vmLoads: number[] =
    new Array(numVMs).fill(0);

  /* -------------------------------------------------------
     Calculate workload on every VM
     ------------------------------------------------------- */

  for (
    let i = 0;
    i < tasks.length;
    i++
  ) {
    const vm =
      assignment[i] % numVMs;

    vmLoads[vm] +=
      getWorkload(tasks[i]);
  }

  /* -------------------------------------------------------
     Total workload
     ------------------------------------------------------- */

  const totalWork =
    vmLoads.reduce(
      (sum, load) => sum + load,
      0
    );

  const avgLoad =
    totalWork / numVMs;

  /* -------------------------------------------------------
     Energy calculation
     ------------------------------------------------------- */

  let totalEnergy = 0;

  vmLoads.forEach(load => {

    const baseEnergy =
      (load / vmMIPS) * pf;

    const deviation =
      Math.abs(
        load - avgLoad
      ) / (avgLoad || 1);

    if (pf === 0.15) {

      // Cubic model
      totalEnergy +=
        baseEnergy *
        (1 + deviation * deviation);

    } else if (pf === 0.12) {

      // Square model
      totalEnergy +=
        baseEnergy *
        (1 + deviation * 0.8);

    } else {

      // Linear model
      totalEnergy +=
        baseEnergy *
        (1 + deviation * 0.5);
    }
  });

  /* -------------------------------------------------------
     VM execution times
     ------------------------------------------------------- */

  const vmTimes =
    vmLoads.map(
      load => load / vmMIPS
    );

  const makespan =
    Math.max(...vmTimes);

  /* -------------------------------------------------------
     Resource utilization
     ------------------------------------------------------- */

  const utilization =
    makespan > 0
      ? (
          vmTimes.reduce(
            (sum, time) =>
              sum + time / makespan,
            0
          ) / numVMs
        ) * 100
      : 0;

  /* -------------------------------------------------------
     Deadline / scheduling efficiency
     ------------------------------------------------------- */

  let onTime = 0;

  const vmCurrent: number[] =
    new Array(numVMs).fill(0);

  for (
    let i = 0;
    i < tasks.length;
    i++
  ) {

    const vm =
      assignment[i] % numVMs;

    vmCurrent[vm] +=
      getWorkload(tasks[i]) /
      vmMIPS;

    const deadline =
      getDeadline(tasks[i]);

    if (
      vmCurrent[vm] <= deadline ||
      deadline === Infinity
    ) {
      onTime++;
    }
  }

  const efficiency =
    tasks.length > 0
      ? (onTime / tasks.length) * 100
      : 0;

  /* -------------------------------------------------------
     Estimated cost
     ------------------------------------------------------- */

  const cost =
    totalEnergy * 0.12 +
    numVMs * makespan * 0.065;

  return {
    energy: totalEnergy,
    time: makespan,
    utilization,
    efficiency,
    cost
  };
}

/* =========================================================
   MAIN SIMULATION
   ========================================================= */

export async function runSimulation(
  data: ParsedData,
  config: SimConfig,
  onProgress: (
    step: number,
    detail?: string
  ) => void
): Promise<SimResults> {

  /* -------------------------------------------------------
     Detect input columns
     ------------------------------------------------------- */

  const cols =
    detectColumns(data);

  const tasks =
    data.rows;

  const numTasks =
    tasks.length;

  const numVMs =
    config.numVMs;

  const vmMIPS =
    config.vmMIPS;

  const pf =
    getPowerFactor(
      config.energyModel
    );

  /* -------------------------------------------------------
     Workload accessor
     ------------------------------------------------------- */

  const getWorkload = (
    task: Record<string, number>
  ) => {

    const value =
      task[cols.workload];

    return value > 0
      ? value
      : 1;
  };

  /* -------------------------------------------------------
     Deadline accessor
     ------------------------------------------------------- */

  const getDeadline = (
    task: Record<string, number>
  ) => {

    if (!cols.deadline) {
      return Infinity;
    }

    const value =
      task[cols.deadline];

    return value > 0
      ? value
      : Infinity;
  };

  /* -------------------------------------------------------
     Seeded random generator
     ------------------------------------------------------- */

  const random =
    createSeededRandom(
      SIMULATION_SEED
    );

  /* =======================================================
     STEP 1 — READ DATA
     ======================================================= */

  onProgress(1);

  await sleep(400);

  /* =======================================================
     STEP 2 — TRADITIONAL SCHEDULING
     ======================================================= */

  onProgress(2);

  await sleep(300);

  /*
   * Traditional scheduling baseline:
   * Round-Robin allocation.
   */

  const traditionalAssignment =
    tasks.map(
      (_, index) =>
        index % numVMs
    );

  const traditionalMetrics =
    evaluate(
      tasks,
      traditionalAssignment,
      numVMs,
      vmMIPS,
      pf,
      getWorkload,
      getDeadline
    );

  /* =======================================================
     STEP 3 — INITIALIZE QIEA
     ======================================================= */

  onProgress(3);

  await sleep(300);

  const populationSize =
    config.populationSize;

  const generations =
    config.generations;

  /*
   * QIEA population.
   *
   * Structure:
   *
   * population
   *   └── individual
   *        └── task
   *             ├── alpha
   *             └── beta
   */

  const qubits: number[][][] = [];

  for (
    let i = 0;
    i < populationSize;
    i++
  ) {

    const individual: number[][] =
      [];

    for (
      let j = 0;
      j < numTasks;
      j++
    ) {

      const angle =
        random() *
        Math.PI /
        2;

      individual.push([
        Math.cos(angle),
        Math.sin(angle)
      ]);
    }

    qubits.push(
      individual
    );
  }

  let bestFitness =
    -Infinity;

  let bestAssignment: number[] =
    [];

  const fitnessHistory: number[] =
    [];

  /* =======================================================
     STEP 4 — QIEA GENERATIONS
     ======================================================= */

  for (
    let generation = 0;
    generation < generations;
    generation++
  ) {

    /*
     * Update progress approximately
     * every 1% of generations.
     */

    const progressInterval =
      Math.max(
        1,
        Math.floor(
          generations / 100
        )
      );

    if (
      generation %
        progressInterval ===
      0
    ) {

      onProgress(
        4,
        `Generation ${
          generation + 1
        } of ${generations} | Best Fitness: ${
          bestFitness > 0
            ? bestFitness.toFixed(6)
            : '—'
        }`
      );

      await sleep(5);
    }

    /* -----------------------------------------------------
       Evaluate every individual
       ----------------------------------------------------- */

    for (
      let individualIndex = 0;
      individualIndex <
      populationSize;
      individualIndex++
    ) {

      /* ---------------------------------------------------
         OBSERVATION
         Convert qubits into VM assignments.
         --------------------------------------------------- */

      const assignment: number[] =
        [];

      for (
        let taskIndex = 0;
        taskIndex < numTasks;
        taskIndex++
      ) {

        const alpha =
          qubits[
            individualIndex
          ][taskIndex][0];

        const beta =
          qubits[
            individualIndex
          ][taskIndex][1];

        const angle =
          Math.atan2(
            beta,
            alpha
          );

        const normalized =
          angle /
          (Math.PI / 2);

        let vmIndex =
          Math.floor(
            normalized *
            numVMs
          );

        if (
          vmIndex >= numVMs
        ) {
          vmIndex =
            numVMs - 1;
        }

        if (
          vmIndex < 0
        ) {
          vmIndex = 0;
        }

        assignment.push(
          vmIndex
        );
      }

      /* ---------------------------------------------------
         Evaluate individual
         --------------------------------------------------- */

      const metrics =
        evaluate(
          tasks,
          assignment,
          numVMs,
          vmMIPS,
          pf,
          getWorkload,
          getDeadline
        );

      /* ===================================================
         STEP 5.4 — IMPROVED FITNESS FUNCTION
         ===================================================

         The fitness now considers ALL five metrics:

         1. Energy
         2. Execution time
         3. Resource utilization
         4. Scheduling efficiency
         5. Estimated cost

         Lower energy, time and cost are preferred.

         Higher utilization and efficiency are preferred.

         Metrics are normalized against the traditional
         scheduling baseline so that one metric does not
         dominate simply because it has a different scale.
         =================================================== */

      const energyRatio =
        traditionalMetrics.energy > 0
          ? metrics.energy /
            traditionalMetrics.energy
          : metrics.energy;

      const timeRatio =
        traditionalMetrics.time > 0
          ? metrics.time /
            traditionalMetrics.time
          : metrics.time;

      const costRatio =
        traditionalMetrics.cost > 0
          ? metrics.cost /
            traditionalMetrics.cost
          : metrics.cost;

      /*
       * Convert percentage metrics into
       * normalized scores between approximately
       * 0 and 1.
       */

      const utilizationPenalty =
        1 -
        Math.min(
          metrics.utilization,
          100
        ) / 100;

      const efficiencyPenalty =
        1 -
        Math.min(
          metrics.efficiency,
          100
        ) / 100;

      /*
       * Weighted objective.
       *
       * Energy       = 30%
       * Time         = 30%
       * Utilization  = 15%
       * Efficiency   = 15%
       * Cost         = 10%
       */

      const objective =
        0.30 * energyRatio +
        0.30 * timeRatio +
        0.15 * utilizationPenalty +
        0.15 * efficiencyPenalty +
        0.10 * costRatio;

      /*
       * Smaller objective = better solution.
       *
       * Therefore reciprocal converts it into
       * a maximization-style fitness score.
       */

      const fitness =
        1 /
        (objective + 0.0001);

      const theta =
        config.rotationAngle;

      /* ---------------------------------------------------
         UPDATE BEST SOLUTION
         --------------------------------------------------- */

      if (
        fitness >
        bestFitness
      ) {

        bestFitness =
          fitness;

        bestAssignment =
          [
            ...assignment
          ];

        /*
         * Rotate qubits toward the
         * newly discovered better solution.
         */

        for (
          let taskIndex = 0;
          taskIndex < numTasks;
          taskIndex++
        ) {

          const [
            alpha,
            beta
          ] =
            qubits[
              individualIndex
            ][taskIndex];

          const cosTheta =
            Math.cos(theta);

          const sinTheta =
            Math.sin(theta);

          const newAlpha =
            alpha *
              cosTheta -
            beta *
              sinTheta;

          const newBeta =
            alpha *
              sinTheta +
            beta *
              cosTheta;

          const magnitude =
            Math.sqrt(
              newAlpha *
                newAlpha +
              newBeta *
                newBeta
            );

          qubits[
            individualIndex
          ][taskIndex] = [
            newAlpha /
              magnitude,
            newBeta /
              magnitude
          ];
        }

      } else {

        /*
         * Reverse rotation when the
         * current solution is not better.
         */

        for (
          let taskIndex = 0;
          taskIndex < numTasks;
          taskIndex++
        ) {

          const [
            alpha,
            beta
          ] =
            qubits[
              individualIndex
            ][taskIndex];

          const cosTheta =
            Math.cos(theta);

          const sinTheta =
            Math.sin(theta);

          const newAlpha =
            alpha *
              cosTheta +
            beta *
              sinTheta;

          const newBeta =
            -alpha *
              sinTheta +
            beta *
              cosTheta;

          const magnitude =
            Math.sqrt(
              newAlpha *
                newAlpha +
              newBeta *
                newBeta
            );

          qubits[
            individualIndex
          ][taskIndex] = [
            newAlpha /
              magnitude,
            newBeta /
              magnitude
          ];
        }
      }

      /* ---------------------------------------------------
         MUTATION
         --------------------------------------------------- */

      if (
        random() <
        config.mutationRate
      ) {

        const randomTask =
          Math.floor(
            random() *
            numTasks
          );

        const randomAngle =
          random() *
          Math.PI /
          2;

        qubits[
          individualIndex
        ][randomTask] = [
          Math.cos(
            randomAngle
          ),
          Math.sin(
            randomAngle
          )
        ];
      }

      /* ---------------------------------------------------
         CROSSOVER
         ---------------------------------------------------

         An individual can copy a section of an earlier
         individual.

         Controlled by crossoverProb.
         --------------------------------------------------- */

      if (
        individualIndex > 0 &&
        random() <
          config.crossoverProb
      ) {

        const parentIndex =
          Math.floor(
            random() *
            individualIndex
          );

        const crossoverPoint =
          Math.floor(
            random() *
            numTasks
          );

        for (
          let taskIndex =
            crossoverPoint;
          taskIndex < numTasks;
          taskIndex++
        ) {

          qubits[
            individualIndex
          ][taskIndex] = [
            ...qubits[
              parentIndex
            ][taskIndex]
          ];
        }
      }
    }

    /* -----------------------------------------------------
       Store best fitness for this generation
       ----------------------------------------------------- */

    fitnessHistory.push(
      bestFitness > 0
        ? bestFitness
        : 0
    );
  }

  /* =======================================================
     STEP 5 — COMPARE RESULTS
     ======================================================= */

  onProgress(5);

  await sleep(300);

  /* =======================================================
     FALLBACK GREEDY LOAD BALANCING
     ======================================================= */

  if (
    bestAssignment.length === 0 ||
    bestFitness <= 0
  ) {

    const vmLoads =
      new Array(numVMs).fill(0);

    bestAssignment =
      new Array(
        numTasks
      ).fill(0);

    /*
     * Sort tasks from largest workload
     * to smallest workload.
     */

    const sortedTasks =
      tasks
        .map(
          (task, index) => ({
            index,
            workload:
              getWorkload(task)
          })
        )
        .sort(
          (a, b) =>
            b.workload -
            a.workload
        );

    /*
     * Assign each task to the
     * currently least-loaded VM.
     */

    for (
      const item of sortedTasks
    ) {

      const leastLoadedVM =
        vmLoads.indexOf(
          Math.min(
            ...vmLoads
          )
        );

      bestAssignment[
        item.index
      ] =
        leastLoadedVM;

      vmLoads[
        leastLoadedVM
      ] +=
        item.workload;
    }
  }

  /* =======================================================
     FINAL QIEA METRICS
     ======================================================= */

  const qieaMetrics =
    evaluate(
      tasks,
      bestAssignment,
      numVMs,
      vmMIPS,
      pf,
      getWorkload,
      getDeadline
    );

  /* =======================================================
     IMPROVEMENT CALCULATIONS
     ======================================================= */

  const energyImprovement =
    traditionalMetrics.energy >
    0
      ? (
          (
            traditionalMetrics.energy -
            qieaMetrics.energy
          ) /
          traditionalMetrics.energy
        ) * 100
      : 0;

  const timeImprovement =
    traditionalMetrics.time >
    0
      ? (
          (
            traditionalMetrics.time -
            qieaMetrics.time
          ) /
          traditionalMetrics.time
        ) * 100
      : 0;

  const utilizationImprovement =
    qieaMetrics.utilization -
    traditionalMetrics.utilization;

  const efficiencyImprovement =
    qieaMetrics.efficiency -
    traditionalMetrics.efficiency;

  const costImprovement =
    traditionalMetrics.cost >
    0
      ? (
          (
            traditionalMetrics.cost -
            qieaMetrics.cost
          ) /
          traditionalMetrics.cost
        ) * 100
      : 0;

  /* =======================================================
     RETURN FINAL RESULTS
     ======================================================= */

  return {
    traditional:
      traditionalMetrics,

    qiea:
      qieaMetrics,

    fitnessHistory,

    improvements: {
      energy:
        energyImprovement,

      time:
        timeImprovement,

      utilization:
        utilizationImprovement,

      efficiency:
        efficiencyImprovement,

      cost:
        costImprovement
    },

    taskCount:
      numTasks,

    vmCount:
      numVMs
  };
}