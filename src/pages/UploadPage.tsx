import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Database,
  FileCheck2,
  Rows3,
  Columns3,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimContext } from '@/context/SimulationContext';
import { parseFile, ParsedData } from '@/lib/fileParser';

export default function UploadPage() {
  const nav = useNavigate();
  const { setParsedData } = useSimContext();

  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setData(null);

      if (!file.name.toLowerCase().endsWith('.txt')) {
        setError('Only .txt files are accepted.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsed = parseFile(
            e.target?.result as string,
            file.name
          );

          setData(parsed);
          setParsedData(parsed);
        } catch (err: any) {
          setError(err.message || 'Failed to parse file.');
        }
      };

      reader.onerror = () => {
        setError('Unable to read the selected file.');
      };

      reader.readAsText(file);
    },
    [setParsedData]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);

      const file = e.dataTransfer.files[0];

      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const onBrowse = () => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = '.txt';

    input.onchange = (e: any) => {
      const file = e.target.files?.[0];

      if (file) {
        handleFile(file);
      }
    };

    input.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-16">

      <div className="container mx-auto px-4 max-w-5xl">

        {/* ==================== HEADER ==================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            <Database className="w-4 h-4" />
            Step 1 · Dataset
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Upload Task Data
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Upload a{' '}
            <span className="font-mono text-foreground">
              .txt
            </span>{' '}
            dataset containing your cloud task scheduling parameters.
          </p>
        </motion.div>


        {/* ==================== UPLOAD AREA ==================== */}

        {!data && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={onBrowse}
              className={`
                relative overflow-hidden rounded-2xl border-2 border-dashed
                p-10 md:p-16 text-center cursor-pointer
                transition-all duration-300
                ${
                  dragging
                    ? 'border-primary bg-primary/10 scale-[1.01] shadow-lg'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/20'
                }
              `}
            >

              {/* Background glow */}

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-primary/5 blur-[80px]" />
              </div>


              <div className="relative z-10">

                {/* Upload icon */}

                <motion.div
                  animate={{
                    y: dragging ? -5 : 0,
                    scale: dragging ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    w-20 h-20 mx-auto mb-6 rounded-2xl
                    flex items-center justify-center
                    border transition-colors
                    ${
                      dragging
                        ? 'bg-primary/20 border-primary/30'
                        : 'bg-primary/10 border-primary/10'
                    }
                  `}
                >
                  <Upload className="w-9 h-9 text-primary" />
                </motion.div>


                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                  {dragging
                    ? 'Drop your dataset here'
                    : 'Drag & drop your dataset'}
                </h2>

                <p className="text-sm text-muted-foreground mb-7">
                  or select a file from your computer
                </p>


                <Button
                  variant="outline"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBrowse();
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Browse Dataset
                </Button>


                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">

                  <Badge
                    variant="secondary"
                    className="font-mono text-xs"
                  >
                    .TXT
                  </Badge>

                  <span className="text-xs text-muted-foreground">
                    Plain-text task dataset
                  </span>

                </div>

              </div>

            </div>


            {/* Dataset requirements */}

            <div className="grid md:grid-cols-3 gap-4 mt-5">

              <div className="gradient-card rounded-xl border border-border p-5">

                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileCheck2 className="w-4 h-4 text-primary" />
                </div>

                <p className="text-sm font-semibold mb-1">
                  File Format
                </p>

                <p className="text-xs text-muted-foreground">
                  Plain text (.txt)
                </p>

              </div>


              <div className="gradient-card rounded-xl border border-border p-5">

                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Columns3 className="w-4 h-4 text-primary" />
                </div>

                <p className="text-sm font-semibold mb-1">
                  Task Parameters
                </p>

                <p className="text-xs text-muted-foreground">
                  Scheduling and resource attributes
                </p>

              </div>


              <div className="gradient-card rounded-xl border border-border p-5">

                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Rows3 className="w-4 h-4 text-primary" />
                </div>

                <p className="text-sm font-semibold mb-1">
                  Minimum Rows
                </p>

                <p className="text-xs text-muted-foreground">
                  At least 5 valid task rows
                </p>

              </div>

            </div>

          </motion.div>
        )}


        {/* ==================== ERROR ==================== */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3"
          >

            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>

            <div>

              <p className="font-semibold text-sm text-destructive">
                Upload failed
              </p>

              <p className="text-sm text-destructive/90 mt-1">
                {error}
              </p>

            </div>

          </motion.div>
        )}


        {/* ==================== SUCCESS / DATA PREVIEW ==================== */}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-7"
          >

            {/* Success header */}

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>

                  <div>

                    <p className="font-semibold">
                      Dataset uploaded successfully
                    </p>

                    <div className="flex items-center gap-2 mt-1">

                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />

                      <span className="text-xs text-muted-foreground font-mono">
                        {data.filename}
                      </span>

                    </div>

                  </div>

                </div>


                <Badge
                  variant="secondary"
                  className="text-primary border-primary/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Valid Dataset
                </Badge>

              </div>

            </div>


            {/* ==================== SUMMARY ==================== */}

            <div>

              <div className="flex items-end justify-between mb-4">

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">
                    Dataset Overview
                  </p>

                  <h2 className="font-semibold text-lg mt-1">
                    Dataset Summary
                  </h2>

                </div>

                <span className="text-xs text-muted-foreground">
                  Parsed successfully
                </span>

              </div>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Tasks */}

                <div className="gradient-card rounded-xl p-5 border border-border">

                  <div className="flex items-center justify-between mb-4">

                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Rows3 className="w-4 h-4 text-primary" />
                    </div>

                  </div>

                  <p className="text-2xl font-bold">
                    {data.rows.length}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Tasks detected
                  </p>

                </div>


                {/* Parameters */}

                <div className="gradient-card rounded-xl p-5 border border-border">

                  <div className="flex items-center justify-between mb-4">

                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Columns3 className="w-4 h-4 text-primary" />
                    </div>

                  </div>

                  <p className="text-2xl font-bold">
                    {data.headers.length}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Parameters detected
                  </p>

                </div>


                {/* Preview rows */}

                <div className="gradient-card rounded-xl p-5 border border-border">

                  <div className="flex items-center justify-between mb-4">

                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="w-4 h-4 text-primary" />
                    </div>

                  </div>

                  <p className="text-2xl font-bold">
                    {Math.min(data.rows.length, 10)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Preview rows
                  </p>

                </div>


                {/* Status */}

                <div className="gradient-card rounded-xl p-5 border border-border">

                  <div className="flex items-center justify-between mb-4">

                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>

                  </div>

                  <p className="text-lg font-bold">
                    Ready
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Ready for configuration
                  </p>

                </div>

              </div>

            </div>


            {/* ==================== PARAMETERS ==================== */}

            <div>

              <div className="flex items-end justify-between mb-4">

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">
                    Dataset Schema
                  </p>

                  <h2 className="font-semibold text-lg mt-1">
                    Detected Parameters
                  </h2>

                </div>

                <span className="text-xs text-muted-foreground">
                  {data.headers.length} columns
                </span>

              </div>


              <div className="gradient-card rounded-xl border border-border p-5">

                <div className="flex flex-wrap gap-2">

                  {data.headers.map((header) => (
                    <Badge
                      key={header}
                      variant="secondary"
                      className="font-mono text-xs px-3 py-1.5"
                    >
                      {header}
                    </Badge>
                  ))}

                </div>

              </div>

            </div>


            {/* ==================== DATA PREVIEW ==================== */}

            <div>

              <div className="flex items-end justify-between mb-4">

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">
                    Sample Records
                  </p>

                  <h2 className="font-semibold text-lg mt-1">
                    Data Preview
                  </h2>

                </div>

                <span className="text-xs text-muted-foreground">
                  First 10 rows
                </span>

              </div>


              <div className="rounded-xl border border-border overflow-hidden bg-background">

                <div className="overflow-auto">

                  <table className="w-full text-sm">

                    <thead>

                      <tr className="bg-secondary/50 border-b border-border">

                        {data.headers.map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}

                      </tr>

                    </thead>


                    <tbody>

                      {data.rows.slice(0, 10).map((row, index) => (

                        <tr
                          key={index}
                          className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                        >

                          {data.headers.map((header) => (

                            <td
                              key={header}
                              className="px-4 py-3 font-mono text-xs whitespace-nowrap"
                            >
                              {row[header]}
                            </td>

                          ))}

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>


                {data.rows.length > 10 && (
                  <div className="px-4 py-3 border-t border-border bg-secondary/20 text-xs text-muted-foreground">
                    Showing 10 of {data.rows.length} rows
                  </div>
                )}

              </div>

            </div>


            {/* ==================== CONTINUE ==================== */}

            <div className="pt-1">

              <Button
                className="w-full glow-primary h-12"
                size="lg"
                onClick={() => nav('/configure')}
              >
                Continue to Configuration
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-3">
                Your dataset is ready for optimization configuration.
              </p>

            </div>

          </motion.div>
        )}

      </div>

    </div>
  );
}