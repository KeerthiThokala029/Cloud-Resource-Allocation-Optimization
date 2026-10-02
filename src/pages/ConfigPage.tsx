import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings2,
  FileText,
  Cpu,
  Database,
  Play,
  Info,
  SlidersHorizontal,
  Server,
  Zap,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useSimContext } from '@/context/SimulationContext';

export default function ConfigPage() {
  const nav = useNavigate();
  const { parsedData, config, setConfig } = useSimContext();

  if (!parsedData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            No dataset uploaded
          </h2>

          <p className="text-muted-foreground text-sm mb-6">
            Upload a task dataset before configuring the optimization
            simulation.
          </p>

          <Button onClick={() => nav('/upload')}>
            Upload Dataset
          </Button>
        </motion.div>
      </div>
    );
  }

  const update = (key: string, value: number | string) => {
    setConfig({
      ...config,
      [key]: value,
    } as any);
  };

  const sliders: {
    key: string;
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    group: string;
  }[] = [
    {
      key: 'populationSize',
      label: 'Population Size',
      description:
        'Number of candidate solutions evaluated in each generation.',
      min: 10,
      max: 200,
      step: 1,
      group: 'qiea',
    },
    {
      key: 'generations',
      label: 'Number of Generations',
      description:
        'Number of optimization iterations performed by QIEA.',
      min: 10,
      max: 500,
      step: 1,
      group: 'qiea',
    },
    {
      key: 'mutationRate',
      label: 'Mutation Rate',
      description:
        'Probability of introducing random variation into candidate solutions.',
      min: 0.01,
      max: 0.5,
      step: 0.01,
      group: 'qiea',
    },
    {
      key: 'crossoverProb',
      label: 'Crossover Probability',
      description:
        'Probability of combining information from candidate solutions.',
      min: 0.1,
      max: 1.0,
      step: 0.05,
      group: 'qiea',
    },
    {
      key: 'rotationAngle',
      label: 'Rotation Angle',
      description:
        'Controls the quantum-inspired state update during optimization.',
      min: 0.01,
      max: 0.1,
      step: 0.005,
      group: 'qiea',
    },
    {
      key: 'numVMs',
      label: 'Number of VMs',
      description:
        'Number of virtual machines available for task allocation.',
      min: 1,
      max: 50,
      step: 1,
      group: 'dc',
    },
    {
      key: 'vmMIPS',
      label: 'VM Processing Power',
      description:
        'Processing capacity of each virtual machine in MIPS.',
      min: 100,
      max: 5000,
      step: 50,
      group: 'dc',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Settings2 className="w-4 h-4" />
            Step 2 · Configuration
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Simulation Configuration
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Configure the quantum-inspired optimization parameters and
            virtual machine environment before running the simulation.
          </p>
        </motion.div>

        {/* =========================================================
            DATASET SUMMARY
        ========================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="gradient-card rounded-2xl border border-border p-5 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5">

            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold truncate">
                  {parsedData.filename}
                </h2>

                <Badge
                  variant="secondary"
                  className="text-[10px] shrink-0"
                >
                  Ready
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Dataset loaded successfully and ready for optimization.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-center">
                <p className="text-lg font-bold">
                  {parsedData.rows.length}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Tasks
                </p>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-center">
                <p className="text-lg font-bold">
                  {parsedData.headers.length}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Parameters
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            CONFIGURATION SUMMARY
        ========================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          <SummaryCard
            icon={Cpu}
            label="Population"
            value={String(config.populationSize)}
            description="Candidates"
          />

          <SummaryCard
            icon={Sparkles}
            label="Generations"
            value={String(config.generations)}
            description="Iterations"
          />

          <SummaryCard
            icon={Server}
            label="Virtual Machines"
            value={String(config.numVMs)}
            description="Available VMs"
          />

          <SummaryCard
            icon={Zap}
            label="Energy Model"
            value={config.energyModel}
            description="Power calculation"
          />
        </motion.div>

        {/* =========================================================
            QIEA PARAMETERS
        ========================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8"
        >
          <SectionHeader
            icon={Cpu}
            title="QIEA Optimization"
            description="Control how the quantum-inspired optimization process searches for better task allocations."
          />

          <div className="gradient-card rounded-2xl border border-border p-5 md:p-7">
            <div className="space-y-8">
              {sliders
                .filter((slider) => slider.group === 'qiea')
                .map((slider) => (
                  <SliderField
                    key={slider.key}
                    {...slider}
                    value={(config as any)[slider.key]}
                    onChange={(value) => update(slider.key, value)}
                  />
                ))}
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            DATA CENTER PARAMETERS
        ========================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <SectionHeader
            icon={Database}
            title="Data Center Environment"
            description="Define the virtual machine resources used during task scheduling."
          />

          <div className="gradient-card rounded-2xl border border-border p-5 md:p-7">
            <div className="space-y-8">

              {sliders
                .filter((slider) => slider.group === 'dc')
                .map((slider) => (
                  <SliderField
                    key={slider.key}
                    {...slider}
                    value={(config as any)[slider.key]}
                    onChange={(value) => update(slider.key, value)}
                  />
                ))}

              {/* ENERGY MODEL */}

              <div className="pt-3 border-t border-border">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-semibold">
                      Energy Model
                    </Label>

                    <p className="text-xs text-muted-foreground mt-1">
                      Select how energy consumption is calculated.
                    </p>
                  </div>

                  <Zap className="w-4 h-4 text-primary mt-1" />
                </div>

                <Select
                  value={config.energyModel}
                  onValueChange={(value) =>
                    update('energyModel', value)
                  }
                >
                  <SelectTrigger className="h-11 bg-secondary/30 border-border">
                    <SelectValue placeholder="Select energy model" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Linear">
                      Linear
                    </SelectItem>

                    <SelectItem value="Square">
                      Square
                    </SelectItem>

                    <SelectItem value="Cubic">
                      Cubic
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                  <EnergyModelCard
                    active={config.energyModel === 'Linear'}
                    title="Linear"
                    description="Balanced power scaling"
                  />

                  <EnergyModelCard
                    active={config.energyModel === 'Square'}
                    title="Square"
                    description="Non-linear power scaling"
                  />

                  <EnergyModelCard
                    active={config.energyModel === 'Cubic'}
                    title="Cubic"
                    description="Higher load sensitivity"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================================================
            INFORMATION NOTE
        ========================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 mb-6"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">
              Configuration guidance
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Higher population sizes and more generations increase the
              optimization search effort. VM settings affect task
              distribution, execution time, resource utilization, energy,
              and cost calculations.
            </p>
          </div>
        </motion.div>

        {/* =========================================================
            RUN SIMULATION
        ========================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button
            className="w-full h-12 glow-primary text-sm font-semibold"
            size="lg"
            onClick={() => nav('/simulation')}
          >
            <Play className="w-5 h-5 mr-2" />
            Run Simulation
          </Button>

          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Your selected configuration will be used for the QIEA
            optimization run.
          </p>
        </motion.div>

      </div>
    </div>
  );
}


/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="gradient-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-1">
        {label}
      </p>

      <p className="text-xl font-bold truncate">
        {value}
      </p>

      <p className="text-[10px] text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
}


/* ================================================================
   SECTION HEADER
================================================================ */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
}


/* ================================================================
   ENERGY MODEL CARD
================================================================ */

function EnergyModelCard({
  active,
  title,
  description,
}: {
  active: boolean;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        active
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-secondary/20'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`w-2 h-2 rounded-full ${
            active ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
        />

        <span className="text-xs font-semibold">
          {title}
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}


/* ================================================================
   SLIDER FIELD
================================================================ */

function SliderField({
  label,
  description,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const formattedValue =
    step < 0.01
      ? value.toFixed(3)
      : step < 1
        ? value.toFixed(2)
        : value;

  const percentage =
    ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <Label className="text-sm font-medium">
            {label}
          </Label>

          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        </div>

        <div className="shrink-0 min-w-[68px] text-center px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-mono font-semibold">
          {formattedValue}
        </div>
      </div>

      <div className="relative">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          className="w-full"
        />
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
        <span>{min}</span>

        <span>
          {percentage.toFixed(0)}% of range
        </span>

        <span>{max}</span>
      </div>
    </div>
  );
}