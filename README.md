# ☁️⚛️ Quantum-Inspired Cloud Resource Allocation Optimization

### 🧠 Quantum-Inspired Optimization for Efficient Cloud Resource Scheduling

A web-based cloud resource allocation and scheduling optimization system that compares a traditional **Round-Robin scheduling approach** with a **Quantum-Inspired Evolutionary Algorithm (QIEA)** using multiple performance metrics.

The system provides an interactive workflow for uploading workload data, configuring simulation parameters, running scheduling simulations, comparing results, and analyzing the effect of VM processing power through **MIPS sensitivity analysis**.

> **Important:** QIEA in this project is implemented as a **quantum-inspired classical simulation**. It does not require physical quantum hardware.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Motivation](#-motivation)
- [Objectives](#-objectives)
- [Core Features](#-core-features)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#️-system-architecture)
- [Architecture Explanation](#-architecture-explanation)
- [Dataset](#-dataset)
- [Dataset Schema](#-dataset-schema)
- [Data Processing](#-data-processing)
- [Simulation and Optimization Logic](#-simulation-and-optimization-logic)
- [Traditional Scheduling](#-traditional-scheduling)
- [Quantum-Inspired Evolutionary Algorithm](#-quantum-inspired-evolutionary-algorithm)
- [Scheduling Factors](#-scheduling-factors)
- [Optimization Objectives](#-optimization-objectives)
- [Performance Metrics](#-performance-metrics)
- [Reproducible Benchmarking](#-reproducible-benchmarking)
- [MIPS Sensitivity Analysis](#-mips-sensitivity-analysis)
- [System Workflow](#-system-workflow)
- [Application Modules](#-application-modules)
- [Results and Visualization](#-results-and-visualization)
- [Application Screenshots](#-application-screenshots)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Development Server](#-running-the-development-server)
- [Production Build](#-production-build)
- [Preview](#-preview)
- [Testing](#-testing)
- [Linting](#-linting)
- [How the Application Works](#-how-the-application-works)
- [Key Capabilities](#-key-capabilities)
- [Project Goals](#-project-goals)
- [Future Enhancements](#-future-enhancements)
- [Important Technical Notes](#-important-technical-notes)
- [Limitations](#-limitations)
- [Disclaimer](#-disclaimer)
- [Author and Connect](#-author-and-connect)
- [License](#-license)

---

## 🔭 Overview

**Quantum-Inspired Cloud Resource Allocation Optimization** is a browser-based cloud task scheduling and resource optimization application developed using **React, TypeScript, and Vite**.

The system provides an interactive environment for loading cloud workload datasets, configuring simulation parameters, executing scheduling simulations, comparing a traditional **Round-Robin scheduling** approach with a **Quantum-Inspired Evolutionary Algorithm (QIEA)**, and analyzing the resulting performance metrics.

The application focuses on optimization-oriented cloud scheduling rather than direct physical cloud orchestration.

The system combines:

- Cloud task scheduling
- Workload dataset processing
- Virtual machine allocation
- Traditional Round-Robin scheduling
- Quantum-Inspired Evolutionary Algorithm
- Multi-objective optimization
- Energy-aware simulation
- Execution-time analysis
- Resource utilization analysis
- Scheduling efficiency analysis
- Estimated cost analysis
- Fitness-history visualization
- MIPS sensitivity analysis
- Interactive result visualization

> **Important:** QIEA is implemented as a **classical quantum-inspired computational simulation running in the browser**. The current application does not execute the algorithm on physical quantum hardware.

---

## 🎯 Problem Statement

Cloud computing environments execute multiple workloads across available Virtual Machines (VMs).

Efficient allocation of tasks to VMs is important because poor scheduling decisions can result in:

- Increased execution time
- Inefficient resource utilization
- Higher energy consumption
- Increased estimated computational cost
- Inefficient task-to-VM allocation

Traditional scheduling approaches such as Round-Robin provide a simple baseline for distributing workloads, but they do not explicitly search for optimized task-to-VM assignments across multiple performance objectives.

This project addresses the problem by modeling cloud task scheduling as an optimization problem and comparing a traditional scheduling approach with a **Quantum-Inspired Evolutionary Algorithm**.

The system provides an interactive simulation environment for analyzing how different scheduling strategies behave under the same workload and resource configuration.

---

## 💡 Motivation

Cloud resource allocation is a multi-objective optimization problem because several performance characteristics need to be considered simultaneously.

A scheduling solution may need to balance:

- Energy consumption
- Execution time
- Resource utilization
- Scheduling efficiency
- Estimated cost

Traditional scheduling methods can distribute tasks in a simple and predictable manner, while optimization-based methods can explore a larger set of possible task-to-VM assignments.

This project explores a **Quantum-Inspired Evolutionary Algorithm (QIEA)** as an optimization-oriented approach to cloud scheduling.

The objective is not to claim physical quantum advantage, but to demonstrate how quantum-inspired representations and evolutionary operations can be used in a classical cloud scheduling simulation.

---

## 🎯 Objectives

The major objectives of the project are:

1. Process structured cloud workload datasets.
2. Model task-to-VM allocation as an optimization problem.
3. Implement Traditional Round-Robin scheduling as a baseline.
4. Implement a Quantum-Inspired Evolutionary Algorithm.
5. Evaluate scheduling solutions using multiple performance metrics.
6. Provide configurable VM and optimization parameters.
7. Support reproducible simulation results.
8. Analyze the effect of VM processing capacity on scheduling performance.
9. Visualize QIEA fitness progression across generations.
10. Compare Traditional and QIEA scheduling results through an interactive dashboard.
11. Provide an experimental environment for studying cloud resource allocation optimization.

---

## ✨ Core Features

### 📂 Dataset Processing

- Upload structured workload datasets.
- Parse uploaded workload data.
- Detect dataset structure and delimiters.
- Validate workload information.
- Prepare task data for simulation.

### ⚙️ Configurable Simulation

Users can configure:

- Population size
- Number of generations
- Mutation rate
- Crossover probability
- Rotation angle
- Number of virtual machines
- VM processing capacity
- Energy model

### 🔄 Scheduling Comparison

The system compares:

- Traditional Round-Robin scheduling
- Quantum-Inspired Evolutionary Algorithm scheduling

Both approaches are evaluated under the same workload and simulation configuration.

### ⚛️ QIEA Optimization

The optimization process includes:

- Population initialization
- Quantum-inspired representation
- Observation and VM assignment
- Fitness evaluation
- Selection
- Crossover
- Guided rotation
- Mutation
- Best-solution tracking
- Fitness-history generation

### 📊 Performance Metrics

The dashboard evaluates:

- Energy consumption
- Execution time
- Resource utilization
- Scheduling efficiency
- Estimated cost

### 🔬 MIPS Sensitivity Analysis

The application analyzes the effect of different VM processing capacities:

- 500 MIPS
- 1000 MIPS
- 1500 MIPS
- 2000 MIPS
- 2500 MIPS

### 📈 Interactive Results Dashboard

The results interface provides:

- Traditional vs QIEA comparison
- Performance metric cards
- Fitness-history visualization
- MIPS sensitivity charts
- Scheduling results
- Comparative visualizations

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | CSS / Tailwind-based styling |
| Package Manager | npm |
| Dataset | Structured workload data |
| Testing | Vitest |
| Linting | ESLint |
| Development Server | Vite |
| Runtime | Modern Web Browser |

The application is implemented as a client-side web application. The scheduling and optimization simulation runs within the browser.

---

## 🏗️ System Architecture

The system follows an end-to-end workflow from workload input and preprocessing through scheduling, optimization, performance evaluation, MIPS analysis, and visualization.

![System Architecture](./docs/architecture/system-architecture.png)

### 🔎 Architecture Explanation

- **Input Layer** – Provides the cloud workload dataset.
- **Dataset Upload** – Allows users to upload workload data through the application.
- **Parsing & Validation** – Detects the dataset structure and validates the uploaded workload data.
- **Configuration Layer** – Defines VM count, MIPS, mutation rate, crossover probability, rotation angle, and energy model.
- **Scheduling Layer** – Executes the traditional Round-Robin scheduling baseline.
- **Optimization Layer** – Executes the Quantum-Inspired Evolutionary Algorithm.
- **Fitness Evaluation** – Evaluates candidate solutions using multiple scheduling objectives.
- **Evolution Layer** – Applies selection, crossover, rotation, mutation, and best-solution tracking.
- **Performance Layer** – Calculates energy, execution time, resource utilization, scheduling efficiency, and estimated cost.
- **Sensitivity Analysis** – Evaluates the effect of different VM processing capacities.
- **Visualization Layer** – Displays comparisons, fitness history, sensitivity-analysis charts, and final results.

---

## 📚 Dataset

The application accepts structured workload data containing information required to model cloud tasks.

The uploaded dataset is parsed by the application and converted into an internal task representation before scheduling simulation.

The system is designed to work with workload datasets that contain:

- Task identifiers
- Task/workload size information
- Processing requirements
- Additional scheduling-related attributes when available

The exact fields depend on the uploaded workload dataset.

---

## 🧾 Dataset Schema

The application does not depend on one fixed external dataset schema.

During upload, the dataset parser identifies the available structure and converts valid records into the internal workload representation required by the simulator.

A typical workload record can conceptually contain:

| Field | Description |
|---|---|
| Task ID | Unique identifier for a task |
| Workload / Length | Computational workload associated with the task |
| Additional Attributes | Dataset-specific scheduling information |

> The exact column names and available attributes depend on the dataset supplied by the user.

---

## 🔄 Data Processing

The dataset processing pipeline consists of the following stages:

```text
Dataset Upload
      ↓
File Parsing
      ↓
Delimiter / Structure Detection
      ↓
Header Validation
      ↓
Data Validation
      ↓
Task Representation
      ↓
Simulation Input
