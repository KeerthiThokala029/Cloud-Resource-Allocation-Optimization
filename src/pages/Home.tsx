import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  BarChart3,
  Clock,
  ArrowRight,
  Upload,
  Settings2,
  Play,
  GitCompare,
  Cpu,
  Activity,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: Zap,
    title: 'Reduce Energy',
    desc: 'Optimize task-to-VM allocation to reduce overall energy consumption.',
  },
  {
    icon: BarChart3,
    title: 'Improve Utilization',
    desc: 'Distribute workloads efficiently across available virtual machines.',
  },
  {
    icon: Clock,
    title: 'Reduce Execution Time',
    desc: 'Find efficient workload distributions to reduce overall makespan.',
  },
];

const workflow = [
  {
    icon: Upload,
    title: 'Upload Dataset',
    desc: 'Provide your cloud task dataset for analysis.',
  },
  {
    icon: Settings2,
    title: 'Configure',
    desc: 'Set population, VM, mutation and optimization parameters.',
  },
  {
    icon: Play,
    title: 'Run Optimization',
    desc: 'Execute the quantum-inspired evolutionary optimization.',
  },
  {
    icon: GitCompare,
    title: 'Analyze Results',
    desc: 'Compare optimized scheduling with Round-Robin.',
  },
];

export default function HomePage() {
  const nav = useNavigate();

  const scrollToWorkflow = () => {
    document
      .getElementById('workflow')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-16">

      {/* ==================== HERO ==================== */}
      <section className="gradient-hero relative overflow-hidden">

        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-10 right-[10%] w-80 h-80 rounded-full bg-accent/10 blur-[110px]" />

          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-7"
            >
              <Zap className="w-3.5 h-3.5" />
              Quantum-Inspired Optimization
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Cloud Resource
              <br />
              <span className="text-primary glow-text">
                Allocation Optimization
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed mb-9">
              Optimize cloud task scheduling using a quantum-inspired
              evolutionary approach and compare the resulting allocation
              against traditional Round-Robin scheduling.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">

              <Button
                size="lg"
                className="glow-primary px-7 h-12"
                onClick={() => nav('/upload')}
              >
                Start Simulation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-7 h-12"
                onClick={scrollToWorkflow}
              >
                Explore Workflow
              </Button>

            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-12">

              <div className="gradient-card rounded-xl border border-border/70 p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">
                    VM Allocation
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Intelligent task-to-VM mapping
                </p>
              </div>

              <div className="gradient-card rounded-xl border border-border/70 p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">
                    Multi-Metric
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Energy, time, utilization and cost
                </p>
              </div>

              <div className="gradient-card rounded-xl border border-border/70 p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <GitCompare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">
                    Performance Comparison
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  QIEA vs Round-Robin
                </p>
              </div>

            </div>

          </motion.div>

        </div>
      </section>


      {/* ==================== OBJECTIVES ==================== */}
      <section className="container mx-auto px-4 py-20">

        <div className="text-center mb-12">

          <span className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
            Optimization Objectives
          </span>

          <h2 className="text-2xl md:text-3xl font-bold mt-3">
            What the system optimizes
          </h2>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">
            The optimization process evaluates multiple aspects of cloud
            resource allocation instead of focusing on a single metric.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.45,
                }}
                whileHover={{ y: -5 }}
                className="gradient-card rounded-2xl p-6 border border-border hover:border-primary/40 transition-all duration-300"
              >

                <div className="flex items-center justify-between mb-5">

                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    0{index + 1}
                  </span>

                </div>

                <h3 className="text-lg font-bold mb-2">
                  {benefit.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.desc}
                </p>

              </motion.div>
            );
          })}

        </div>

      </section>


      {/* ==================== COMPARISON ==================== */}
      <section className="container mx-auto px-4 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-card max-w-5xl mx-auto rounded-2xl border border-border p-6 md:p-8"
        >

          <div className="text-center mb-8">

            <span className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
              Optimization Approach
            </span>

            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              From baseline scheduling to optimization
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Traditional */}
            <div className="rounded-xl border border-border bg-background/40 p-5">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>

                <div>
                  <h3 className="font-bold">
                    Round-Robin
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Baseline scheduling
                  </p>
                </div>

              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Tasks are distributed sequentially across the available
                virtual machines to establish a baseline for comparison.
              </p>

            </div>

            {/* QIEA */}
            <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-bold">
                    Quantum-Inspired Optimization
                  </h3>
                  <p className="text-xs text-primary">
                    Optimization approach
                  </p>
                </div>

              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                A quantum-inspired evolutionary search explores task-to-VM
                assignments and evaluates their performance across multiple
                resource metrics.
              </p>

            </div>

          </div>

        </motion.div>

      </section>


      {/* ==================== WORKFLOW ==================== */}
      <section
        id="workflow"
        className="border-y border-border bg-secondary/10"
      >

        <div className="container mx-auto px-4 py-20">

          <div className="text-center mb-12">

            <span className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
              Workflow
            </span>

            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              How the simulation works
            </h2>

            <p className="text-sm text-muted-foreground mt-3">
              Follow the complete process from dataset upload to performance
              comparison.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">

            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.45,
                  }}
                  whileHover={{ y: -4 }}
                  className="relative gradient-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all duration-300"
                >

                  <div className="flex items-center justify-between mb-5">

                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <span className="text-xs font-mono text-muted-foreground">
                      0{index + 1}
                    </span>

                  </div>

                  <h3 className="font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>

                  {index < workflow.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-3 z-10">
                      <ArrowRight className="w-5 h-5 text-primary/50" />
                    </div>
                  )}

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* ==================== FINAL CTA ==================== */}
      <section className="container mx-auto px-4 py-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-card max-w-5xl mx-auto rounded-2xl border border-primary/20 p-8 md:p-12 text-center relative overflow-hidden"
        >

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-[80px]" />
          </div>

          <div className="relative z-10">

            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-5 h-5 text-primary" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to optimize your cloud workload?
            </h2>

            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-7 leading-relaxed">
              Upload your dataset, configure the simulation parameters and
              evaluate the resulting allocation against Round-Robin scheduling.
            </p>

            <Button
              size="lg"
              className="glow-primary px-7 h-12"
              onClick={() => nav('/upload')}
            >
              Start Simulation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

          </div>

        </motion.div>

      </section>

    </div>
  );
}