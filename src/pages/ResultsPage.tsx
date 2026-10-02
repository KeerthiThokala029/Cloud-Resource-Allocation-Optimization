import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  Zap,
  Clock,
  BarChart3,
  Activity,
  Download,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Target,
  Cpu,
  Loader2,
} from 'lucide-react';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { useSimContext } from '@/context/SimulationContext';
import { runSimulation } from '@/lib/simulation';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


/* ============================================================
   MIPS ANALYSIS TYPE
============================================================ */

interface MIPSAnalysisPoint {
  vmMIPS: number;

  traditional: {
    energy: number;
    time: number;
    utilization: number;
    efficiency: number;
    cost: number;
  };

  qiea: {
    energy: number;
    time: number;
    utilization: number;
    efficiency: number;
    cost: number;
  };
}


/* ============================================================
   RESULTS PAGE
============================================================ */

export default function ResultsPage() {
  const nav = useNavigate();

  const {
    results,
    parsedData,
    config,
  } = useSimContext();


  /* ==========================================================
     MIPS ANALYSIS STATE
  ========================================================== */

  const [mipsAnalysis, setMipsAnalysis] =
    useState<MIPSAnalysisPoint[]>([]);

  const [mipsLoading, setMipsLoading] =
    useState(false);

  const [mipsProgress, setMipsProgress] =
    useState(0);

  const [mipsError, setMipsError] =
    useState('');


  /* ==========================================================
     RUN MIPS ANALYSIS
  ========================================================== */

  const runMIPSAnalysis = async () => {
    if (!parsedData || !config || mipsLoading) {
      return;
    }

    const mipsValues = [
      500,
      1000,
      1500,
      2000,
      2500,
    ];

    setMipsLoading(true);
    setMipsError('');
    setMipsAnalysis([]);
    setMipsProgress(0);

    try {
      const analysisResults: MIPSAnalysisPoint[] = [];

      for (let i = 0; i < mipsValues.length; i++) {
        const vmMIPS = mipsValues[i];

        const analysisConfig = {
          ...config,
          vmMIPS,
        };

        const simulationResult = await runSimulation(
          parsedData,
          analysisConfig,
          () => {
            // Internal simulation progress is intentionally hidden.
            // The MIPS section displays its own progress.
          }
        );

        analysisResults.push({
          vmMIPS,

          traditional: {
            energy: simulationResult.traditional.energy,
            time: simulationResult.traditional.time,
            utilization:
              simulationResult.traditional.utilization,
            efficiency:
              simulationResult.traditional.efficiency,
            cost: simulationResult.traditional.cost,
          },

          qiea: {
            energy: simulationResult.qiea.energy,
            time: simulationResult.qiea.time,
            utilization:
              simulationResult.qiea.utilization,
            efficiency:
              simulationResult.qiea.efficiency,
            cost: simulationResult.qiea.cost,
          },
        });

        setMipsProgress(i + 1);
        setMipsAnalysis([...analysisResults]);
      }
    } catch (error) {
      console.error(error);

      setMipsError(
        error instanceof Error
          ? error.message
          : 'MIPS analysis failed.'
      );
    } finally {
      setMipsLoading(false);
    }
  };


  /* ==========================================================
     NO RESULTS PROTECTION
  ========================================================== */

  if (!results) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="gradient-card rounded-2xl border border-border p-8 max-w-md">

            <Activity className="w-10 h-10 text-primary mx-auto mb-4" />

            <h2 className="text-xl font-semibold mb-2">
              No Simulation Results
            </h2>

            <p className="text-muted-foreground mb-6">
              Run a simulation first to view the optimization results.
            </p>

            <Button onClick={() => nav('/upload')}>
              Upload Dataset
            </Button>

          </div>
        </div>
      </div>
    );
  }


  /* ==========================================================
     RESULT DATA
  ========================================================== */

  const {
    traditional: trad,
    qiea,
    improvements: imp,
    fitnessHistory,
  } = results;


  /* ==========================================================
     SUMMARY CARDS
  ========================================================== */

  const savingsCards = [
    {
      icon: Zap,
      label: 'Energy Saved',
      value: `${imp.energy.toFixed(1)}%`,
      description: 'Lower energy consumption',
    },

    {
      icon: Clock,
      label: 'Time Saved',
      value: `${imp.time.toFixed(1)}%`,
      description: 'Lower execution time',
    },

    {
      icon: DollarSign,
      label: 'Cost Saved',
      value: `${imp.cost.toFixed(1)}%`,
      description: 'Lower estimated cost',
    },
  ];


  const performanceCards = [
    {
      icon: BarChart3,
      label: 'Resource Utilization',
      value: `${qiea.utilization.toFixed(1)}%`,
      description: 'QIEA VM utilization',
    },

    {
      icon: Target,
      label: 'Scheduling Efficiency',
      value: `${qiea.efficiency.toFixed(1)}%`,
      description: 'Tasks completed on time',
    },
  ];


  /* ==========================================================
     EXISTING CHART DATA
  ========================================================== */

  const energyData = [
    {
      name: 'Traditional',
      value: Number(trad.energy.toFixed(2)),
    },

    {
      name: 'QIEA',
      value: Number(qiea.energy.toFixed(2)),
    },
  ];


  const timeData = [
    {
      name: 'Traditional',
      value: Number(trad.time.toFixed(2)),
    },

    {
      name: 'QIEA',
      value: Number(qiea.time.toFixed(2)),
    },
  ];


  const utilizationData = [
    {
      name: 'Traditional',
      value: Number(
        trad.utilization.toFixed(1)
      ),
    },

    {
      name: 'QIEA',
      value: Number(
        qiea.utilization.toFixed(1)
      ),
    },
  ];


  const efficiencyData = [
    {
      name: 'Traditional',
      value: Number(
        trad.efficiency.toFixed(1)
      ),
    },

    {
      name: 'QIEA',
      value: Number(
        qiea.efficiency.toFixed(1)
      ),
    },
  ];


  const costData = [
    {
      name: 'Traditional',
      value: Number(trad.cost.toFixed(2)),
    },

    {
      name: 'QIEA',
      value: Number(qiea.cost.toFixed(2)),
    },
  ];


  const fitnessData = fitnessHistory.map(
    (fitness, index) => ({
      generation: index + 1,
      fitness: Number(
        fitness.toFixed(6)
      ),
    })
  );


  /* ==========================================================
     MIPS CHART DATA
  ========================================================== */

  const mipsEnergyData = mipsAnalysis.map(
    (point) => ({
      vmMIPS: point.vmMIPS,
      Traditional: Number(
        point.traditional.energy.toFixed(2)
      ),
      QIEA: Number(
        point.qiea.energy.toFixed(2)
      ),
    })
  );


  const mipsTimeData = mipsAnalysis.map(
    (point) => ({
      vmMIPS: point.vmMIPS,
      Traditional: Number(
        point.traditional.time.toFixed(2)
      ),
      QIEA: Number(
        point.qiea.time.toFixed(2)
      ),
    })
  );


  const mipsUtilizationData = mipsAnalysis.map(
    (point) => ({
      vmMIPS: point.vmMIPS,
      Traditional: Number(
        point.traditional.utilization.toFixed(1)
      ),
      QIEA: Number(
        point.qiea.utilization.toFixed(1)
      ),
    })
  );


  const mipsEfficiencyData = mipsAnalysis.map(
    (point) => ({
      vmMIPS: point.vmMIPS,
      Traditional: Number(
        point.traditional.efficiency.toFixed(1)
      ),
      QIEA: Number(
        point.qiea.efficiency.toFixed(1)
      ),
    })
  );


  const mipsCostData = mipsAnalysis.map(
    (point) => ({
      vmMIPS: point.vmMIPS,
      Traditional: Number(
        point.traditional.cost.toFixed(2)
      ),
      QIEA: Number(
        point.qiea.cost.toFixed(2)
      ),
    })
  );


  /* ==========================================================
     COMPARISON TABLE
  ========================================================== */

  const comparisonRows = [
    {
      metric: 'Energy Consumption',
      unit: 'W',
      trad: trad.energy,
      qiea: qiea.energy,
      change: imp.energy,
      changeType: 'percentage',
    },

    {
      metric: 'Execution Time',
      unit: 's',
      trad: trad.time,
      qiea: qiea.time,
      change: imp.time,
      changeType: 'percentage',
    },

    {
      metric: 'Resource Utilization',
      unit: '%',
      trad: trad.utilization,
      qiea: qiea.utilization,
      change: imp.utilization,
      changeType: 'percentagePoint',
    },

    {
      metric: 'Scheduling Efficiency',
      unit: '%',
      trad: trad.efficiency,
      qiea: qiea.efficiency,
      change: imp.efficiency,
      changeType: 'percentagePoint',
    },

    {
      metric: 'Estimated Cost',
      unit: '$',
      trad: trad.cost,
      qiea: qiea.cost,
      change: imp.cost,
      changeType: 'percentage',
    },
  ];


  /* ==========================================================
     EXPORT REPORT
  ========================================================== */

  const exportPDF = () => {
    const w = window.open('', '_blank');

    if (!w) return;

    const rows = comparisonRows
      .map((row) => {
        const changeText =
          row.changeType === 'percentagePoint'
            ? `${row.change >= 0 ? '+' : ''}${row.change.toFixed(1)} pp`
            : `${row.change >= 0 ? '+' : ''}${row.change.toFixed(1)}%`;

        return `
          <tr>
            <td>${row.metric}</td>
            <td>${row.trad.toFixed(2)} ${row.unit}</td>
            <td>${row.qiea.toFixed(2)} ${row.unit}</td>
            <td>${changeText}</td>
          </tr>
        `;
      })
      .join('');

    w.document.write(`
      <html>
        <head>
          <title>QIEA Cloud Resource Allocation Results</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #222;
            }

            h1 {
              color: #0891b2;
              margin-bottom: 8px;
            }

            h2 {
              margin-top: 32px;
            }

            p {
              color: #555;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th,
            td {
              border: 1px solid #ddd;
              padding: 10px 12px;
              text-align: left;
            }

            th {
              background: #f5f5f5;
            }
          </style>
        </head>

        <body>

          <h1>
            QIEA Cloud Resource Allocation Results
          </h1>

          <p>
            Quantum-Inspired Evolutionary Algorithm
            vs Traditional Round-Robin Scheduling
          </p>

          <p>
            Tasks: ${results.taskCount}
            &nbsp; | &nbsp;
            VMs: ${results.vmCount}
          </p>

          <h2>
            Performance Comparison
          </h2>

          <table>

            <tr>
              <th>Metric</th>
              <th>Traditional</th>
              <th>QIEA</th>
              <th>Change</th>
            </tr>

            ${rows}

          </table>

        </body>
      </html>
    `);

    w.document.close();
    w.print();
  };


  /* ==========================================================
     CHART STYLES
  ========================================================== */

  const chartGrid = {
    strokeDasharray: '3 3',
    stroke: 'hsl(222,30%,18%)',
  };

  const axisStyle = {
    stroke: 'hsl(215,20%,55%)',
    fontSize: 12,
  };

  const tooltipStyle = {
    background: 'hsl(222,44%,9%)',
    border: '1px solid hsl(222,30%,18%)',
    borderRadius: 8,
    color: '#fff',
  };


  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="min-h-screen pt-24 pb-12">

      <div className="container mx-auto px-4 max-w-6xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">

            <div className="flex items-center gap-2 mb-3">

              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>

              <span className="text-sm text-primary font-medium">
                Optimization Complete
              </span>

            </div>


            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Simulation Results
            </h1>


            <p className="text-muted-foreground">
              QIEA vs Traditional Round-Robin Scheduling
            </p>


            <div className="flex flex-wrap gap-3 mt-4">

              <span className="px-3 py-1.5 rounded-full bg-secondary text-xs text-muted-foreground">
                {results.taskCount} Tasks
              </span>

              <span className="px-3 py-1.5 rounded-full bg-secondary text-xs text-muted-foreground">
                {results.vmCount} Virtual Machines
              </span>

              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-xs text-primary">
                Quantum-Inspired Optimization
              </span>

            </div>

          </div>


          {/* =================================================
              SAVINGS SUMMARY
          ================================================= */}

          <section className="mb-10">

            <div className="flex items-center gap-2 mb-4">

              <TrendingUp className="w-4 h-4 text-primary" />

              <h2 className="text-lg font-semibold">
                Optimization Summary
              </h2>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {savingsCards.map(
                (card, index) => {

                  const Icon = card.icon;

                  return (
                    <motion.div
                      key={card.label}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      className="gradient-card rounded-xl p-5 border border-border hover:border-primary/40 transition-colors"
                    >

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-sm text-muted-foreground">
                            {card.label}
                          </p>

                          <p className="text-3xl font-bold mt-2 text-primary">
                            {card.value}
                          </p>

                          <p className="text-xs text-muted-foreground mt-2">
                            {card.description}
                          </p>

                        </div>


                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>

          </section>


          {/* =================================================
              PERFORMANCE SUMMARY
          ================================================= */}

          <section className="mb-10">

            <div className="flex items-center gap-2 mb-4">

              <Activity className="w-4 h-4 text-primary" />

              <h2 className="text-lg font-semibold">
                QIEA Performance
              </h2>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">

              {performanceCards.map(
                (card, index) => {

                  const Icon = card.icon;

                  return (
                    <motion.div
                      key={card.label}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.2 + index * 0.1,
                      }}
                      className="gradient-card rounded-xl p-5 border border-border"
                    >

                      <div className="flex items-start gap-4">

                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>

                        <div>

                          <p className="text-sm text-muted-foreground">
                            {card.label}
                          </p>

                          <p className="text-2xl font-bold mt-1">
                            {card.value}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            {card.description}
                          </p>

                        </div>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>

          </section>


          {/* =================================================
              VM PROCESSING POWER ANALYSIS
          ================================================= */}

          <section className="mb-10">

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="gradient-card rounded-2xl border border-border p-6"
            >

              <div className="flex flex-col gap-5">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <div className="p-2 rounded-lg bg-primary/10">
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>

                      <h2 className="text-xl font-semibold">
                        VM Processing Power Analysis
                      </h2>

                    </div>

                    <p className="text-sm text-muted-foreground max-w-2xl">
                      Analyze how VM processing power affects
                      energy consumption, execution time,
                      resource utilization, scheduling efficiency,
                      and estimated cost.
                    </p>

                    <p className="text-xs text-muted-foreground mt-2">
                      Tested processing powers: 500, 1000,
                      1500, 2000 and 2500 MIPS.
                    </p>

                  </div>


                  <Button
                    onClick={runMIPSAnalysis}
                    disabled={
                      mipsLoading ||
                      !parsedData ||
                      !config
                    }
                    className="shrink-0"
                  >

                    {mipsLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running {mipsProgress}/5
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 mr-2" />
                        Run MIPS Analysis
                      </>
                    )}

                  </Button>

                </div>


                {/* =================================================
                    MIPS PROGRESS
                ================================================= */}

                {mipsLoading && (
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-muted-foreground">
                        Testing VM processing power...
                      </span>

                      <span className="font-medium">
                        {mipsProgress}/5
                      </span>

                    </div>


                    <div className="h-2 rounded-full bg-secondary overflow-hidden">

                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{
                          width: '0%',
                        }}
                        animate={{
                          width: `${(mipsProgress / 5) * 100}%`,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      />

                    </div>

                  </div>
                )}


                {/* =================================================
                    MIPS ERROR
                ================================================= */}

                {mipsError && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    <p className="font-medium mb-1">
                      MIPS analysis failed
                    </p>

                    <p>
                      {mipsError}
                    </p>
                  </div>
                )}


                {/* =================================================
                    COMPLETED MIPS VALUES
                ================================================= */}

                {!mipsLoading &&
                  mipsAnalysis.length > 0 && (
                    <div className="rounded-xl border border-border bg-secondary/20 p-4">

                      <p className="text-sm font-medium mb-3">
                        Analysis completed
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {mipsAnalysis.map(
                          (point) => (
                            <span
                              key={point.vmMIPS}
                              className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium"
                            >
                              {point.vmMIPS} MIPS ✓
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}


                {/* =================================================
                    MIPS CHARTS
                ================================================= */}

                {!mipsLoading &&
                  mipsAnalysis.length > 0 && (

                    <div className="mt-4">

                      <div className="mb-6">

                        <h3 className="text-lg font-semibold">
                          Processing Power Sensitivity
                        </h3>

                        <p className="text-sm text-muted-foreground mt-1">
                          Each graph compares Traditional Round-Robin
                          scheduling with QIEA as VM processing power
                          increases.
                        </p>

                      </div>


                      <div className="grid lg:grid-cols-2 gap-6">


                        {/* =================================================
                            ENERGY VS MIPS
                        ================================================= */}

                        <ChartCard
                          title="Energy vs VM Processing Power"
                          description="Lower energy consumption indicates better energy efficiency."
                        >

                          <ResponsiveContainer
                            width="100%"
                            height={280}
                          >

                            <LineChart
                              data={mipsEnergyData}
                            >

                              <CartesianGrid
                                {...chartGrid}
                              />

                              <XAxis
                                dataKey="vmMIPS"
                                {...axisStyle}
                                label={{
                                  value: 'VM Processing Power (MIPS)',
                                  position: 'insideBottom',
                                  offset: -5,
                                }}
                              />

                              <YAxis
                                {...axisStyle}
                                label={{
                                  value: 'Energy (W)',
                                  angle: -90,
                                  position: 'insideLeft',
                                }}
                              />

                              <Tooltip
                                contentStyle={
                                  tooltipStyle
                                }
                                formatter={(
                                  value: number,
                                  name: string
                                ) => [
                                  `${value.toFixed(2)} W`,
                                  name,
                                ]}
                              />

                              <Legend />

                              <Line
                                type="monotone"
                                dataKey="Traditional"
                                stroke="hsl(188, 100%, 50%)"
                                strokeWidth={2}
                                dot
                              />

                              <Line
                                type="monotone"
                                dataKey="QIEA"
                                stroke="hsl(142, 70%, 45%)"
                                strokeWidth={2}
                                dot
                              />

                            </LineChart>

                          </ResponsiveContainer>

                        </ChartCard>


                        {/* =================================================
                            TIME VS MIPS
                        ================================================= */}

                        <ChartCard
                          title="Execution Time vs VM Processing Power"
                          description="Higher VM processing power can reduce execution time."
                        >

                          <ResponsiveContainer
                            width="100%"
                            height={280}
                          >

                            <LineChart
                              data={mipsTimeData}
                            >

                              <CartesianGrid
                                {...chartGrid}
                              />

                              <XAxis
                                dataKey="vmMIPS"
                                {...axisStyle}
                                label={{
                                  value: 'VM Processing Power (MIPS)',
                                  position: 'insideBottom',
                                  offset: -5,
                                }}
                              />

                              <YAxis
                                {...axisStyle}
                                label={{
                                  value: 'Execution Time (s)',
                                  angle: -90,
                                  position: 'insideLeft',
                                }}
                              />

                              <Tooltip
                                contentStyle={
                                  tooltipStyle
                                }
                                formatter={(
                                  value: number,
                                  name: string
                                ) => [
                                  `${value.toFixed(2)} s`,
                                  name,
                                ]}
                              />

                              <Legend />

                              <Line
                                type="monotone"
                                dataKey="Traditional"
                                stroke="hsl(188, 100%, 50%)"
                                strokeWidth={2}
                                dot
                              />

                              <Line
                                type="monotone"
                                dataKey="QIEA"
                                stroke="hsl(142, 70%, 45%)"
                                strokeWidth={2}
                                dot
                              />

                            </LineChart>

                          </ResponsiveContainer>

                        </ChartCard>


                        {/* =================================================
                            UTILIZATION VS MIPS
                        ================================================= */}

                        <ChartCard
                          title="Resource Utilization vs VM Processing Power"
                          description="Shows how effectively the available VM capacity is utilized."
                        >

                          <ResponsiveContainer
                            width="100%"
                            height={280}
                          >

                            <LineChart
                              data={mipsUtilizationData}
                            >

                              <CartesianGrid
                                {...chartGrid}
                              />

                              <XAxis
                                dataKey="vmMIPS"
                                {...axisStyle}
                                label={{
                                  value: 'VM Processing Power (MIPS)',
                                  position: 'insideBottom',
                                  offset: -5,
                                }}
                              />

                              <YAxis
                                {...axisStyle}
                                domain={[0, 100]}
                                label={{
                                  value: 'Utilization (%)',
                                  angle: -90,
                                  position: 'insideLeft',
                                }}
                              />

                              <Tooltip
                                contentStyle={
                                  tooltipStyle
                                }
                                formatter={(
                                  value: number,
                                  name: string
                                ) => [
                                  `${value.toFixed(1)}%`,
                                  name,
                                ]}
                              />

                              <Legend />

                              <Line
                                type="monotone"
                                dataKey="Traditional"
                                stroke="hsl(188, 100%, 50%)"
                                strokeWidth={2}
                                dot
                              />

                              <Line
                                type="monotone"
                                dataKey="QIEA"
                                stroke="hsl(142, 70%, 45%)"
                                strokeWidth={2}
                                dot
                              />

                            </LineChart>

                          </ResponsiveContainer>

                        </ChartCard>


                        {/* =================================================
                            EFFICIENCY VS MIPS
                        ================================================= */}

                        <ChartCard
                          title="Scheduling Efficiency vs VM Processing Power"
                          description="Shows the percentage of tasks completed within their deadlines."
                        >

                          <ResponsiveContainer
                            width="100%"
                            height={280}
                          >

                            <LineChart
                              data={mipsEfficiencyData}
                            >

                              <CartesianGrid
                                {...chartGrid}
                              />

                              <XAxis
                                dataKey="vmMIPS"
                                {...axisStyle}
                                label={{
                                  value: 'VM Processing Power (MIPS)',
                                  position: 'insideBottom',
                                  offset: -5,
                                }}
                              />

                              <YAxis
                                {...axisStyle}
                                domain={[0, 100]}
                                label={{
                                  value: 'Efficiency (%)',
                                  angle: -90,
                                  position: 'insideLeft',
                                }}
                              />

                              <Tooltip
                                contentStyle={
                                  tooltipStyle
                                }
                                formatter={(
                                  value: number,
                                  name: string
                                ) => [
                                  `${value.toFixed(1)}%`,
                                  name,
                                ]}
                              />

                              <Legend />

                              <Line
                                type="monotone"
                                dataKey="Traditional"
                                stroke="hsl(188, 100%, 50%)"
                                strokeWidth={2}
                                dot
                              />

                              <Line
                                type="monotone"
                                dataKey="QIEA"
                                stroke="hsl(142, 70%, 45%)"
                                strokeWidth={2}
                                dot
                              />

                            </LineChart>

                          </ResponsiveContainer>

                        </ChartCard>


                        {/* =================================================
                            COST VS MIPS
                        ================================================= */}

                        <ChartCard
                          title="Estimated Cost vs VM Processing Power"
                          description="Shows how VM processing power affects estimated scheduling cost."
                        >

                          <ResponsiveContainer
                            width="100%"
                            height={280}
                          >

                            <LineChart
                              data={mipsCostData}
                            >

                              <CartesianGrid
                                {...chartGrid}
                              />

                              <XAxis
                                dataKey="vmMIPS"
                                {...axisStyle}
                                label={{
                                  value: 'VM Processing Power (MIPS)',
                                  position: 'insideBottom',
                                  offset: -5,
                                }}
                              />

                              <YAxis
                                {...axisStyle}
                                label={{
                                  value: 'Estimated Cost ($)',
                                  angle: -90,
                                  position: 'insideLeft',
                                }}
                              />

                              <Tooltip
                                contentStyle={
                                  tooltipStyle
                                }
                                formatter={(
                                  value: number,
                                  name: string
                                ) => [
                                  `$${value.toFixed(2)}`,
                                  name,
                                ]}
                              />

                              <Legend />

                              <Line
                                type="monotone"
                                dataKey="Traditional"
                                stroke="hsl(188, 100%, 50%)"
                                strokeWidth={2}
                                dot
                              />

                              <Line
                                type="monotone"
                                dataKey="QIEA"
                                stroke="hsl(142, 70%, 45%)"
                                strokeWidth={2}
                                dot
                              />

                            </LineChart>

                          </ResponsiveContainer>

                        </ChartCard>

                      </div>

                    </div>
                  )}

              </div>

            </motion.div>

          </section>


          {/* =================================================
              EXISTING CHARTS
          ================================================= */}

          <section className="mb-10">

            <div className="flex items-center gap-2 mb-4">

              <BarChart3 className="w-4 h-4 text-primary" />

              <h2 className="text-lg font-semibold">
                Performance Comparison
              </h2>

            </div>


            <div className="grid lg:grid-cols-2 gap-6">


              {/* ENERGY */}

              <ChartCard
                title="Energy Consumption"
                description="Lower energy consumption indicates better efficiency."
              >

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <BarChart data={energyData}>

                    <CartesianGrid
                      {...chartGrid}
                    />

                    <XAxis
                      dataKey="name"
                      {...axisStyle}
                    />

                    <YAxis
                      {...axisStyle}
                    />

                    <Tooltip
                      contentStyle={
                        tooltipStyle
                      }
                      formatter={(
                        value: number
                      ) => [
                        `${value.toFixed(2)} W`,
                        'Energy',
                      ]}
                    />

                    <Bar
                      dataKey="value"
                      fill="hsl(188, 100%, 50%)"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </ChartCard>


              {/* EXECUTION TIME */}

              <ChartCard
                title="Execution Time"
                description="Lower makespan means faster task completion."
              >

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <BarChart data={timeData}>

                    <CartesianGrid
                      {...chartGrid}
                    />

                    <XAxis
                      dataKey="name"
                      {...axisStyle}
                    />

                    <YAxis
                      {...axisStyle}
                    />

                    <Tooltip
                      contentStyle={
                        tooltipStyle
                      }
                      formatter={(
                        value: number
                      ) => [
                        `${value.toFixed(2)} s`,
                        'Execution Time',
                      ]}
                    />

                    <Bar
                      dataKey="value"
                      fill="hsl(188, 100%, 50%)"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </ChartCard>


              {/* RESOURCE UTILIZATION */}

              <ChartCard
                title="Resource Utilization"
                description="Higher utilization indicates better VM usage."
              >

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <BarChart
                    data={utilizationData}
                  >

                    <CartesianGrid
                      {...chartGrid}
                    />

                    <XAxis
                      dataKey="name"
                      {...axisStyle}
                    />

                    <YAxis
                      {...axisStyle}
                      domain={[0, 100]}
                    />

                    <Tooltip
                      contentStyle={
                        tooltipStyle
                      }
                      formatter={(
                        value: number
                      ) => [
                        `${value.toFixed(1)}%`,
                        'Utilization',
                      ]}
                    />

                    <Bar
                      dataKey="value"
                      fill="hsl(188, 100%, 50%)"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </ChartCard>


              {/* SCHEDULING EFFICIENCY */}

              <ChartCard
                title="Scheduling Efficiency"
                description="Percentage of tasks completed within their deadlines."
              >

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <BarChart
                    data={efficiencyData}
                  >

                    <CartesianGrid
                      {...chartGrid}
                    />

                    <XAxis
                      dataKey="name"
                      {...axisStyle}
                    />

                    <YAxis
                      {...axisStyle}
                      domain={[0, 100]}
                    />

                    <Tooltip
                      contentStyle={
                        tooltipStyle
                      }
                      formatter={(
                        value: number
                      ) => [
                        `${value.toFixed(1)}%`,
                        'Efficiency',
                      ]}
                    />

                    <Bar
                      dataKey="value"
                      fill="hsl(188, 100%, 50%)"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </ChartCard>


              {/* ESTIMATED COST */}

              <ChartCard
                title="Estimated Cost"
                description="Lower estimated scheduling cost is preferred."
              >

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <BarChart data={costData}>

                    <CartesianGrid
                      {...chartGrid}
                    />

                    <XAxis
                      dataKey="name"
                      {...axisStyle}
                    />

                    <YAxis
                      {...axisStyle}
                    />

                    <Tooltip
                      contentStyle={
                        tooltipStyle
                      }
                      formatter={(
                        value: number
                      ) => [
                        `$${value.toFixed(2)}`,
                        'Estimated Cost',
                      ]}
                    />

                    <Bar
                      dataKey="value"
                      fill="hsl(188, 100%, 50%)"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </ChartCard>


              {/* FITNESS */}

              <ChartCard
                title="QIEA Fitness Convergence"
                description="Fitness progression across optimization generations."
              >

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <LineChart data={fitnessData}>

                    <CartesianGrid
                      {...chartGrid}
                    />

                    <XAxis
                      dataKey="generation"
                      {...axisStyle}
                    />

                    <YAxis
                      {...axisStyle}
                    />

                    <Tooltip
                      contentStyle={
                        tooltipStyle
                      }
                      formatter={(
                        value: number
                      ) => [
                        value.toFixed(6),
                        'Fitness',
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="fitness"
                      stroke="hsl(188, 100%, 50%)"
                      strokeWidth={2}
                      dot={false}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </ChartCard>

            </div>

          </section>


          {/* =================================================
              DETAILED COMPARISON
          ================================================= */}

          <section className="mb-8">

            <div className="flex items-center gap-2 mb-4">

              <BarChart3 className="w-4 h-4 text-primary" />

              <h2 className="text-lg font-semibold">
                Detailed Comparison
              </h2>

            </div>


            <div className="rounded-xl border border-border overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>

                    <tr className="bg-secondary/50">

                      <th className="px-4 py-4 text-left font-semibold">
                        Metric
                      </th>

                      <th className="px-4 py-4 text-left font-semibold">
                        Traditional
                      </th>

                      <th className="px-4 py-4 text-left font-semibold">
                        QIEA
                      </th>

                      <th className="px-4 py-4 text-left font-semibold">
                        Change
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {comparisonRows.map(
                      (row) => {

                        const positive =
                          row.change > 0;

                        const changeText =
                          row.changeType ===
                          'percentagePoint'
                            ? `${positive ? '+' : ''}${row.change.toFixed(1)} pp`
                            : `${positive ? '+' : ''}${row.change.toFixed(1)}%`;

                        return (
                          <tr
                            key={row.metric}
                            className="border-t border-border hover:bg-secondary/20 transition-colors"
                          >

                            <td className="px-4 py-4 font-medium">
                              {row.metric}
                            </td>

                            <td className="px-4 py-4 font-mono text-muted-foreground">
                              {row.trad.toFixed(2)}{' '}
                              {row.unit}
                            </td>

                            <td className="px-4 py-4 font-mono text-primary font-semibold">
                              {row.qiea.toFixed(2)}{' '}
                              {row.unit}
                            </td>

                            <td
                              className={`px-4 py-4 font-mono font-semibold ${
                                positive
                                  ? 'text-success'
                                  : 'text-destructive'
                              }`}
                            >
                              {changeText}
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>


              <div className="px-4 py-3 border-t border-border bg-secondary/20">

                <p className="text-xs text-muted-foreground">

                  <span className="font-medium text-foreground">
                    Note:
                  </span>{' '}

                  Energy, execution time and cost changes
                  are shown as percentage differences.
                  Resource utilization and scheduling
                  efficiency are shown as percentage-point
                  differences.

                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="flex flex-col sm:flex-row gap-4">

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => nav('/upload')}
            >

              <RotateCcw className="w-4 h-4 mr-2" />

              Run Again

            </Button>


            <Button
              className="flex-1 glow-primary"
              onClick={exportPDF}
            >

              <Download className="w-4 h-4 mr-2" />

              Export Results

            </Button>

          </div>


        </motion.div>

      </div>

    </div>
  );
}


/* ============================================================
   REUSABLE CHART CARD
============================================================ */

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="gradient-card rounded-xl p-5 border border-border">

      <div className="mb-3">

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>

      </div>

      {children}

    </div>
  );
}