# Cloud Resource Allocation Optimization

A web-based cloud resource allocation and scheduling optimization system that compares a traditional Round-Robin scheduling approach with a Quantum-Inspired Evolutionary Algorithm (QIEA) using multiple performance metrics.

The system provides an interactive workflow for uploading workload data, configuring simulation parameters, running scheduling simulations, comparing results, and analyzing the effect of VM processing power through MIPS sensitivity analysis.

> **Note:** QIEA in this project is implemented as a quantum-inspired classical simulation. It does not require quantum hardware.

---

## Overview

Efficient cloud resource allocation is important for improving resource utilization, reducing execution time and energy consumption, and controlling infrastructure cost.

This project provides an interactive simulation environment for studying cloud resource allocation using:

- **Round-Robin scheduling** as the traditional baseline
- **Quantum-Inspired Evolutionary Algorithm (QIEA)** for optimization
- **Multi-objective fitness evaluation**
- **Performance metric comparison**
- **MIPS sensitivity analysis**

The application allows users to configure simulation parameters and observe how different scheduling strategies perform under the same workload.

---

## Problem Statement

Traditional cloud scheduling approaches may not efficiently balance multiple objectives such as:

- Energy consumption
- Execution time
- Resource utilization
- Scheduling efficiency
- Estimated cost

The goal of this project is to provide an optimization-oriented simulation environment that evaluates cloud resource allocation strategies across multiple performance dimensions.

---

## Proposed Solution

The system follows an end-to-end workflow:

```text
Workload Dataset
       ↓
Dataset Upload & Parsing
       ↓
Simulation Configuration
       ↓
Traditional Scheduling
   (Round-Robin)
       ↓
QIEA Optimization
       ↓
Performance Evaluation
       ↓
Traditional vs QIEA Comparison
       ↓
MIPS Sensitivity Analysis
       ↓
Interactive Results Dashboard