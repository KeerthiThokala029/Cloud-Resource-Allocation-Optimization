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
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
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

Traditional scheduling methods can distribute tasks efficiently in a simple manner, but optimization-based methods can explore a larger set of possible task-to-VM assignments.

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

The application provides an optimization-focused cloud scheduling dashboard with the following capabilities.

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

| **Category** | **Technology** |
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

```text
                    ☁️ CLOUD WORKLOAD DATASET
                              │
                              ▼
                    📂 DATASET UPLOAD
                              │
                              ▼
                    🔍 PARSING & VALIDATION
                              │
                              ▼
                    ⚙️ SIMULATION CONFIGURATION
                              │
                              ▼
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
        🔄 ROUND-ROBIN              ⚛️ QIEA OPTIMIZATION
          SCHEDULING                       │
                 │                         │
                 │                ┌────────┴────────┐
                 │                │                 │
                 │                ▼                 ▼
                 │          Fitness Evaluation   Evolution
                 │                │                 │
                 │                └────────┬────────┘
                 │                         │
                 └────────────┬────────────┘
                              ▼
                    📊 PERFORMANCE METRICS
                              │
                              ▼
                    📈 RESULT COMPARISON
                              │
                              ▼
                    🔬 MIPS SENSITIVITY
                              │
                              ▼
                    📊 RESULTS DASHBOARD


## 🔎 Architecture Explanation

The system is organized into a sequence of modules that transform the uploaded cloud workload into optimized scheduling results.

### 1. ☁️ Workload Input

The process begins with a cloud workload dataset containing task-related information required for the scheduling simulation.

### 2. 📂 Dataset Upload

Users upload the workload dataset through the application. The uploaded file becomes the input for the scheduling and optimization process.

### 3. 🔍 Parsing and Validation

The application reads the uploaded dataset, identifies its structure, validates the available records, and converts the workload into an internal format that can be processed by the simulator.

### 4. ⚙️ Simulation Configuration

Users configure the simulation parameters, including:

- Number of VMs
- VM processing capacity (MIPS)
- Population size
- Number of generations
- Mutation rate
- Crossover probability
- Rotation angle
- Energy model
- Random seed

The available energy models are **Linear, Square, and Cubic**.

### 5. 🔄 Traditional Scheduling

The system first generates a baseline scheduling solution using the **Round-Robin scheduling algorithm**.

This provides a reference solution for evaluating the optimized scheduling approach.

### 6. ⚛️ Quantum-Inspired Optimization

The **Quantum-Inspired Evolutionary Algorithm (QIEA)** generates and improves candidate task-to-VM assignments.

The optimization process uses:

- Population initialization
- Fitness evaluation
- Selection
- Crossover
- Quantum-inspired rotation
- Mutation
- Best-solution tracking

### 7. 🎯 Fitness Evaluation

Each candidate scheduling solution is evaluated using a weighted multi-objective fitness function.

| Objective | Weight |
|---|---:|
| Energy | 30% |
| Execution Time | 30% |
| Resource Utilization | 15% |
| Scheduling Efficiency | 15% |
| Estimated Cost | 10% |

This allows the optimizer to consider multiple aspects of cloud resource allocation simultaneously.

### 8. 📊 Performance Evaluation

The generated scheduling solutions are evaluated using:

- Energy consumption
- Execution time
- Resource utilization
- Scheduling efficiency
- Estimated cost

The results of Round-Robin and QIEA are presented for comparison.

### 9. 📈 MIPS Sensitivity Analysis

The system evaluates different VM processing capacities to study how changes in MIPS affect scheduling performance.

The analysis uses:

- 500 MIPS
- 1000 MIPS
- 1500 MIPS
- 2000 MIPS
- 2500 MIPS

For each configuration, the system compares the Traditional Round-Robin and QIEA approaches across the supported performance metrics.

### 10. 📊 Results Visualization

The final results are presented through interactive charts, tables, metric cards, and fitness-history visualizations.

The Results page provides a consolidated view of the scheduling comparison and MIPS sensitivity analysis.

> **Architecture Note:** QIEA is implemented as a classical software simulation inspired by quantum computing concepts. The project does not require physical quantum hardware.

---

## 📚 Dataset

The application uses cloud workload data as the input for its resource allocation simulation.

The dataset represents a collection of computational tasks that can be assigned to available virtual machines.

The application processes the uploaded workload and converts it into an internal representation before applying the scheduling algorithms.

The workload information is used by both **Round-Robin** and **QIEA** so that the two approaches can be evaluated under the same simulation configuration.

The system can process workload files containing task-related information such as:

- Task identifiers
- Workload or task length
- Processing requirements
- Other dataset-specific attributes

The exact columns depend on the workload dataset supplied to the application.

---

## 🧾 Dataset Schema

The application is not restricted to a single fixed external dataset schema.

During the upload process, the dataset is parsed and the available workload information is converted into the internal representation required by the simulation engine.

A typical workload dataset can conceptually contain:

| Field | Description |
|---|---|
| Task ID | Identifier used to distinguish individual tasks |
| Workload / Length | Represents the computational workload of a task |
| Processing Information | Information required for scheduling or execution-time calculation |
| Additional Attributes | Dataset-specific information that may be available |

> **Note:** The exact field names depend on the workload dataset used for the simulation.

---

## 🔄 Data Processing

The workload processing pipeline converts the uploaded dataset into simulation-ready task data.

The main stages are:

**1. Dataset Upload**  
The user provides the workload file through the Upload module.

**2. File Parsing**  
The application reads the uploaded file and identifies its available structure.

**3. Structure Detection**  
The parser identifies headers and determines the delimiter used by the dataset.

**4. Data Validation**  
The application checks whether the uploaded data contains valid workload records required for simulation.

**5. Task Conversion**  
Valid records are converted into the internal task representation used by the scheduling engine.

**6. Simulation Input**  
The processed workload is passed to the simulation engine.

**7. Scheduling and Optimization**  
The same workload is evaluated using Round-Robin and QIEA scheduling.

This process ensures that both scheduling approaches operate on the same workload input, allowing their simulated performance to be compared consistently.