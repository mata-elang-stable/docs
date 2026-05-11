---
title: System Requirements
sidebar_position: 6
---

## Introduction

This document describes the hardware and software requirements of the Mata Elang Platform.

## Software Requirements

Mata Elang Platform requires the following software to be installed on your system:

- [Docker](https://docs.docker.com/get-docker/)

:::tip[Docker Installation Best Practice]
For the best practice, please refer to the [Docker Official Documentation](https://docs.docker.com/engine/install/).
Using the official Docker repository is recommended to get the latest version and security updates.
:::

## Hardware Requirements

### Defense Center

| Component | Minimum | Recommended |
| --------- | ------- | ----------- |
| CPU       | 4 cores | 8 cores     |
| RAM       | 8 GB    | 16 GB       |
| Storage   | 100 GB  | 200 GB      |
| Network   | 1 Gbps  | 1 Gbps      |

### Sensor

:::tip[Note]
The host machine must have at least **2 network interfaces**. One interface is used for management, and the other interface is used for monitoring.
The monitoring interface must be in [**promiscuous mode**](https://www.blumira.com/glossary/promiscuous-mode).
:::

| Component | Minimum | Recommended |
| --------- | ------- | ----------- |
| CPU       | 2 cores | 4 cores     |
| RAM       | 2 GB    | 4 GB        |
| Storage   | 50 GB   | 120 GB      |
| Network   | 1 Gbps  | 1 Gbps      |

## Resource Limit for Each Service

### Defense Center's Services

Rules:

- CPU limit total can overvalue the host CPU cores as much as 2x the host CPU cores.
- Memory limit cannot exceed the host memory.

| Service Name          | Replicas | CPU Limit | Memory Limit (GB) |
| --------------------- | -------- | --------- | ----------------- |
| sensor-api            | 1        | 2         | 0.5               |
| broker                | 1        | 1         | 1                 |
| schema-registry       | 1        | 1         | 1                 |
| kafka-ui              | 1        | 1         | 1                 |
| event-stream-aggr     | 1        | 2         | 0.5               |
| opensearch-node1      | 1        | 1         | 1                 |
| opensearch-dashboards | 1        | 1         | 1                 |
| opensearch-logstash   | 1        | 1         | 1                 |
| opensearch-init       | 1        | 1         | 1                 |

### Sensor's Services

| Service Name  | Replicas | CPU Limit | Memory Limit (GB) |
| ------------- | -------- | --------- | ----------------- |
| snort         | 1        | 1         | 0.5               |
| snort-parser  | 1        | 1         | 0.5               |
