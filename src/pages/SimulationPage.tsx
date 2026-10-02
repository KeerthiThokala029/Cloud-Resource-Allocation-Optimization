import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Check,
  Cpu,
  Database,
  FileText,
  Loader2,
  Network,
  Play,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';

import { useSimContext } from '@/context/SimulationContext';
import { runSimulation } from '@/lib/simulation';

const stepLabels = [
  'Reading uploaded file data...',
  'Running Traditional Scheduling (Round-Robin)...',
  'Initializing QIEA population...',
  'Running QIEA Generations...',
  'Comparing results...',
];

const stepIcons = [
  FileText,
  Network,
  Cpu,
  Sparkles,
  Activity,
];

export default function SimulationPage() {
  const nav = useNavigate();

  const {
    parsedData,
    config,
    setResults,
  } = useSimContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [detail, setDetail] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!parsedData || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const startSimulation = async () => {
      try {
        setCurrentStep(1);
        setDetail('Preparing dataset for optimization...');

        const results = await runSimulation(
          parsedData,
          config,
          (step: number, progressDetail?: string) => {
            setCurrentStep(step);

            if (progressDetail) {
              setDetail(progressDetail);
            } else {
              setDetail(stepLabels[step - 1] ?? '');
            }
          }
        );

        setCompleted(true);
        setCurrentStep(5);
        setDetail('Optimization completed successfully.');

        setResults(results);

        setTimeout(() => {
          nav('/results');
        }, 900);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred during the simulation.'
        );
      }
    };

    startSimulation();
  }, [parsedData, config, nav, setResults]);

  if (!parsedData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-2xl border border-border p-8 max-w-md text-center"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Database className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-xl font-bold mb-2">
            No Dataset Available
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Upload a dataset and configure the simulation before
            starting the optimization process.
          </p>

          <button
            onClick={() => nav('/upload')}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Upload Dataset
          </button>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-2xl border border-destructive/30 p-8 max-w-lg text-center"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Activity className="w-7 h-7 text-destructive" />
          </div>

          <h2 className="text-xl font-bold mb-2">
            Simulation Failed
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            {error}
          </p>

          <button
            onClick={() => nav('/configure')}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Configuration
          </button>
        </motion.div>
      </div>
    );
  }

  const progressPercent = completed
    ? 100
    : Math.round((currentStep / stepLabels.length) * 100);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Play className="w-4 h-4" />
            Step 3 · Optimization
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Running Optimization
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto">
            The system is evaluating task allocations and comparing
            traditional scheduling with quantum-inspired optimization.
          </p>
        </motion.div>

        {/* MAIN STATUS CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="gradient-card rounded-2xl border border-border overflow-hidden mb-6"
        >
          {/* TOP STATUS */}
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center gap-5">

              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {completed ? (
                    <Check className="w-8 h-8 text-primary" />
                  ) : (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  )}
                </div>

                {!completed && (
                  <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-primary border-2 border-background animate-pulse" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                  {completed
                    ? 'Optimization Complete'
                    : `Stage ${currentStep} of ${stepLabels.length}`}
                </p>

                <h2 className="text-lg font-semibold mb-1">
                  {completed
                    ? 'Simulation completed successfully'
                    : stepLabels[currentStep - 1] ?? 'Processing...'}
                </h2>

                <p className="text-xs text-muted-foreground">
                  {detail || 'Processing optimization data...'}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-2xl font-bold">
                  {progressPercent}%
                </p>

                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Progress
                </p>
              </div>

            </div>

            {/* PROGRESS BAR */}
            <div className="mt-7">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${progressPercent}%`,
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* PROCESS STEPS */}
          <div className="p-6 md:p-8">
            <div className="space-y-3">

              {stepLabels.map((label, index) => {
                const stepNumber = index + 1;
                const Icon = stepIcons[index];

                const isCompleted =
                  completed || stepNumber < currentStep;

                const isCurrent =
                  !completed && stepNumber === currentStep;

                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      isCurrent
                        ? 'border-primary/30 bg-primary/5'
                        : isCompleted
                          ? 'border-border bg-secondary/20'
                          : 'border-border/60 bg-background/20'
                    }`}
                  >

                    {/* STEP INDICATOR */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-primary/10 text-primary'
                          : isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : isCurrent ? (
                        <Icon className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-semibold">
                          {stepNumber}
                        </span>
                      )}
                    </div>

                    {/* STEP TEXT */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent
                            ? 'text-foreground'
                            : isCompleted
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {label.replace('...', '')}
                      </p>

                      {isCurrent && detail && (
                        <p className="text-[11px] text-muted-foreground mt-1 truncate">
                          {detail}
                        </p>
                      )}
                    </div>

                    {/* STATUS */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <span className="text-[10px] font-medium text-primary">
                          Complete
                        </span>
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Pending
                        </span>
                      )}
                    </div>

                  </motion.div>
                );
              })}

            </div>
          </div>
        </motion.div>

        {/* DATASET + CONFIGURATION SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DATASET CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="gradient-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Dataset
                </h3>

                <p className="text-xs text-muted-foreground">
                  Input workload
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <InfoItem
                label="Tasks"
                value={String(parsedData.rows.length)}
              />

              <InfoItem
                label="Parameters"
                value={String(parsedData.headers.length)}
              />

              <InfoItem
                label="File"
                value={parsedData.filename}
              />

              <InfoItem
                label="Status"
                value="Loaded"
              />

            </div>
          </motion.div>

          {/* CONFIGURATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="gradient-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Configuration
                </h3>

                <p className="text-xs text-muted-foreground">
                  Optimization parameters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <InfoItem
                label="Population"
                value={String(config.populationSize)}
              />

              <InfoItem
                label="Generations"
                value={String(config.generations)}
              />

              <InfoItem
                label="VMs"
                value={String(config.numVMs)}
              />

              <InfoItem
                label="VM MIPS"
                value={String(config.vmMIPS)}
              />

              <InfoItem
                label="Mutation"
                value={config.mutationRate.toFixed(2)}
              />

              <InfoItem
                label="Crossover"
                value={config.crossoverProb.toFixed(2)}
              />

            </div>
          </motion.div>

        </div>

        {/* OPTIMIZATION INFORMATION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-5"
        >
          <div className="flex gap-3">

            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1">
                What is happening?
              </h3>

              <p className="text-xs leading-5 text-muted-foreground">
                The system first creates a traditional Round-Robin
                schedule. It then uses the Quantum-Inspired Evolutionary
                Algorithm (QIEA) to search for improved task-to-VM
                allocations while considering energy, execution time,
                resource utilization, scheduling efficiency, and cost.
              </p>
            </div>

          </div>
        </motion.div>

        {/* FOOTER STATUS */}
        {!completed && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Please wait while the optimization process completes.
            </p>
          </div>
        )}

        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <Check className="w-4 h-4" />
              Results are ready. Opening results dashboard...
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-secondary/30 border border-border/60 p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold truncate">
        {value}
      </p>
    </div>
  );
}