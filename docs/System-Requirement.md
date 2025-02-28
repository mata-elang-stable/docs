---
title: System Requirements
sidebar_position: 6
---

## Introduction

This document describes the hardware requirements of the Mata Elang Platform.

## Minimum Hardware Requirements (headroom ~10%)

- Configuration : Defense center has 1-5 sensors. Each sensor can handle >100 k events/second.

| Host Name      | CPU Cores | Memory (GB) | Disk (GB) |
| -------------- | --------- | ----------- | --------- |
| Sensor         | 2         | 4           | 100       |
| Defense Center | 8         | 16          | 250       |

## Recommended Hardware Requirement (headroom ~20%)

- Configuration : Defense center has => 10 sensors. Each sensor can handle >100 k events/second.

| Host Name      | CPU Cores | Memory (GB) | Disk (GB) |
| -------------- | --------- | ----------- | --------- |
| Sensor         | 2         | 4           | 100       |
| Defense Center | 16        | 24          | 250       |

## Resource Limit for Each Service of the Mata Elang Platform.

### Sensor's Services

| Service Name  | Replicas | CPU Limit | Memory Limit (GB) |
| ------------- | -------- | --------- | ----------------- |
| Sensor API    | 1        | 1         | 1                 |
| Event Handler | 1        | 1         | 1                 |

### Defense Center's Services

Rules:

- CPU limit total can overvalue the host CPU cores as much as 2x the host CPU cores.
- Memory limit cannot exceed the host memory.

| Service Name         | Replicas | CPU Limit | Memory Limit (GB) |
| -------------------- | -------- | --------- | ----------------- |
| Sensor-API           | 1        | 1         | 1                 |
| Event-Handler        | 1        | 1         | 1                 |
| Broker               | 1        | 1         | 1                 |
| Schema-Registry      | 1        | 1         | 1                 |
| Kafka-UI             | 1        | 1         | 1                 |
| OpenSearch-Node 1    | 1        | 1         | 1                 |
| OpenSearch-Dashboard | 2        | 2         | 2                 |
| OpenSearch-Logstash  | 1        | 1         | 1                 |
| OpenSearch-Init      | 1        | 1         | 1                 |
