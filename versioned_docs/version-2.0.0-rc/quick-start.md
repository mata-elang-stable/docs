---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start Guide

This guide will help you to get started with Mata Elang. Mata Elang is a network security platform that provides network intrusion detection system (NIDS) capabilities. It is designed to help you monitor and protect your network from malicious activities.

See the [Introduction](/docs/intro.md) for more information.

## Defense Center - Hardware Requirements

In the latest version of Mata Elang, there are huge improvements in terms of performance and scalability. The hardware requirements for the new version change significantly. The following table shows the minimum and recommended hardware requirements for the new version of Mata Elang.

### Defense Center - Minimum

| Component | Minimum Requirement |
| --- | --- |
| CPU | 4 cores |
| RAM | 8 GB |
| Storage | 100 GB |
| Network | 1 Gbps |

### Defense Center - Recommended

| Component | Recommended Requirement |
| --- | --- |
| CPU | 8 cores |
| RAM | 16 GB |
| Storage | 200 GB |
| Network | 1 Gbps |

### Sensor - Hardware Requirements

Mata Elang Sensor use Snort as the network intrusion detection system (NIDS). The sensor is deployed in the network to monitor the traffic and detect any malicious activities.

:::tip[Note]

The host machine must have at least **2 network interfaces**. One interface is used for management, and the other interface is used for monitoring.
The monitoring interface must be in [**promiscuous mode**](https://www.blumira.com/glossary/promiscuous-mode).

:::

### Sensor Minimum

| Component | Minimum Requirement |
| --- | --- |
| CPU | 2 cores |
| RAM | 2 GB |
| Storage | 50 GB |
| Network | 1 Gbps |

### Sensor Recommended

| Component | Recommended Requirement |
| --- | --- |
| CPU | 4 cores |
| RAM | 4 GB |
| Storage | 120 GB |
| Network | 1 Gbps |

## Software Requirements

Mata Elang Platform requires the following software to be installed on your system:

- [Docker](https://docs.docker.com/get-docker/)

## Installation

### Prerequisite

✅ Ubuntu 20.04 LTS installed and updated with the following command.

```
sudo apt update && sudo apt -y dist-upgrade
```

✅ Docker 20.10 or later installed with the following command.

```
sudo apt -y install docker.io
```

:::tip[Docker Installation Best Practice]
For the best practice, please refer to the [Docker Official Documentation](https://docs.docker.com/engine/install/).
Using the official Docker repository is recommended to get the latest version and security updates.
:::

### Installing Mata Elang Sensor

<Tabs
  className="unique-tabs"
  defaultValue="docker-compose"
  values={[
    {label: 'Docker Compose', value: 'docker-compose'},
    {label: 'Docker CLI', value: 'docker-cli'},
  ]}>
  <TabItem value="docker-compose">

    Create a `compose.yml` file with the following content.

    ```yaml title="compose.yml" showLineNumbers
    volumes:
      snort_log:
        driver: local
        driver_opts:
          type: tmpfs
          device: tmpfs
          o: size=1g,uid=1000
      snort_data:

    services:
      snort:
        image: ghcr.io/mata-elang-stable/snort3-docker-image:v2.0-debian
        restart: unless-stopped
        network_mode: host
        env_file:
          - .env
        volumes:
          - snort_log:/var/log/snort:rw
          - snort_data:/usr/local/etc/snort3:rw
          - ./custom.rules:/usr/local/etc/snort3/rules/local.rules:ro
          - ./rules:/tmp/rules:ro
        deploy:
          mode: replicated
          replicas: 1
          restart_policy:
            condition: unless-stopped
            delay: 10s
          resources:
            limits:
              cpus: "1"
              memory: 512M

        snort-parser:
          image: ghcr.io/mata-elang-stable/sensor-snort-service:latest
          restart: unless-stopped
          command: "client -v"
          depends_on:
            - snort
          env_file:
            - .env
          volumes:
            - snort_log:/var/log/snort:rw
          deploy:
            mode: replicated
            replicas: 1
            restart_policy:
              condition: unless-stopped
              delay: 10s
            resources:
              limits:
              cpus: "1"
              memory: 512M
    ```

    Then, run the following command to start the sensor.

    ```bash
    docker compose up -d
    ```

  </TabItem>
  <TabItem value="docker-cli">

  ```bash
  docker run -d --name mataelang-sensor-snort \

  ```

  </TabItem>
</Tabs>

## Configuration

## Accessing the Dashboard
