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

| Component | Minimum | Recommended |
| --- | --- | --- |
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Storage | 100 GB | 200 GB |
| Network | 1 Gbps | 1 Gbps |

### Sensor - Hardware Requirements

Mata Elang Sensor use Snort as the network intrusion detection system (NIDS). The sensor is deployed in the network to monitor the traffic and detect any malicious activities.

:::tip[Note]

The host machine must have at least **2 network interfaces**. One interface is used for management, and the other interface is used for monitoring.
The monitoring interface must be in [**promiscuous mode**](https://www.blumira.com/glossary/promiscuous-mode).

:::

| Component | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| Storage | 50 GB | 120 GB |
| Network | 1 Gbps | 1 Gbps |

## Software Requirements

Mata Elang Platform requires the following software to be installed on your system:

- [Docker](https://docs.docker.com/get-docker/)

## Installation

### Prerequisite

✅ Ubuntu 20.04 LTS installed and updated with the following command.

```bash
sudo apt update && sudo apt -y dist-upgrade
```

✅ Docker 20.10 or later installed with the following command.

```bash
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
    {label: 'Manual', value: 'manual'},
  ]}>
  <TabItem value="docker-compose">

#### Create a `compose.yml` file with the following content


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

#### Create a `.env` file with the following content

:::note
Change the `NETWORK_INTERFACE` and `MES_CLIENT_SERVER` values according to your environment. `NETWORK_INTERFACE` is the network interface to listen on, and `MES_CLIENT_SERVER` is the IP address of the Mata Elang Defense System (MES) server. If you are running the sensor and the defense center on the same machine, you can use `172.17.0.1` in Linux or `host.docker.internal` in Windows/Mac.
:::

    ```bash title=".env"
    ###############################
    # Mata Elang: Sensor Snort
    ###############################

    # Snort OINKCODE is required to download rules from snort.org
    # If you don't have an OINKCODE, you can register at https://www.snort.org/users/sign_up
    # and get a free OINKCODE for registered users.
    # OINKCODE is not required for community rules
    # default:
    #SNORT_OINKCODE=

    # Network interface to listen on
    # default: eth0
    NETWORK_INTERFACE=eth0

    # Uncomment this if you need to install or update rules from files
    # this should be absolute path inside the container.
    #   ex: /tmp/rules/filename.tar.gz
    # default:
    #SNORT_COMPRESSED_RULES_FILE_PATH=

    # Uncomment this if you need to install or update rules from snort.org
    # Possible values: community, registered, lightspd
    # registered and lightspd require SNORT_OINKCODE to be set
    # default: community
    #RULESET=community

    # Uncomment this if you need to use blocklist
    #SNORT_BLOCKLIST=false
    #ET_BLOCKLIST=false
    #BLOCKLIST_URLS=

    # IPS policy to use
    # Possible values: connectivity, balanced, security, max-detect, none
    # default: balanced
    #IPS_POLICY=balanced

    ###############################
    # Mata Elang: Sensor Parser
    ###############################

    # Path to the snort alert file
    # default: /var/log/snort/alert_json.txt
    #MES_CLIENT_FILE=/var/log/snort/alert_json.txt

    # IP address of the Mata Elang Defense System (MES) server
    # default: localhost
    MES_CLIENT_SERVER=172.17.0.1

    # Port of the MES server
    # default: 50051
    MES_CLIENT_PORT=50051

    # Unique ID of the sensor in the MES server
    # default: sensor1
    MES_CLIENT_SENSOR_ID=sensor1
    ```

    Then, run the following command to start the sensor.

    ```bash
    docker compose up -d
    ```

  </TabItem>
  <TabItem value="manual">

#### Clone the `docs` repository

  ```bash
  git clone https://
  ```

#### Change directory to the `docs` repository

  ```bash
  cd docs
  ```

#### Copy the `.env` file from `.env.example`

  ```bash
  cp .env.example .env
  ```

#### Edit the `.env` file

  ```bash
  nano .env
  ```

:::note
Change the `NETWORK_INTERFACE` and `MES_CLIENT_SERVER` values according to your environment. `NETWORK_INTERFACE` is the network interface to listen on, and `MES_CLIENT_SERVER` is the IP address of the Mata Elang Defense System (MES) server. If you are running the sensor and the defense center on the same machine, you can use `172.17.0.1` in Linux or `host.docker.internal` in Windows/Mac.
:::

#### Run the following command to start the sensor

  ```bash
  docker-compose up -d
  ```

  </TabItem>
</Tabs>

## Configuration

## Accessing the Dashboard
