---
title: Introduction
sidebar_position: 1
---

## Abstract

Snort is a well-known, signature-based network intrusion detection system (NIDS). The Snort sensor must be placed within the same physical network, and the defense centers in the typical NIDS architecture offer limited network coverage, especially for remote networks with a restricted bandwidth and network policy. Additionally, the growing number of sensor instances, followed by a quick increase in log data volume, has caused the present system to face big data challenges. This research paper proposes a novel design for a cloud-based Snort NIDS using containers and implementing big data in the defense center to overcome these problems. Our design consists of Docker as the sensor's platform, Apache Kafka as the distributed messaging system, and big data technology orchestrated on lambda architecture. We conducted experiments to measure sensor deployment, optimum message delivery from the sensors to the defense center, aggregation speed, and efficiency in the data-processing performance of the defense center. We successfully developed a cloud-based Snort NIDS and found the optimum method for message delivery from the sensor to the defense center. We also succeeded in developing the dashboard and attack maps to display the attack statistics and visualize the attacks. Our first design is reported to implement the big data architecture, namely, lambda architecture, as the defense center and utilize rapid deployment of Snort NIDS using Docker technology as the network security monitoring platform.

## Project Overview

![MataElang-v2-Architecture](/img/MataElangv2Architecture.png)

Mata Elang is the evolution of the Mata Garuda Internet Monitoring Project for Indonesia. This project was initialized as a private repository in 2018 by LabJarkomC307 - Politeknik Elektronika Negeri Surabaya. Currently, Mata Elang is a collaboration research between PENS, Universitas Indonesia, and BRIN (Badan Riset dan Inovasi Nasional). Mata Elang is supported by JICA.

This project is based on the article: [The Next-Generation NIDS Platform: Cloud-Based Snort NIDS Using Containers and Big Data](https://www.mdpi.com/2504-2289/6/1/19)

```bibtex
@article{saputra2022next,
  title={The Next-Generation NIDS Platform: Cloud-Based Snort NIDS Using Containers and Big Data},
  author={Saputra, F.A. and Salman, M. and Hasim, J.A.N. and Nadhori, I.U. and Ramli, K.},
  journal={Big Data Cogn. Comput.},
  volume={6},
  pages={19},
  year={2022},
  doi={10.3390/bdcc6010019}
}
```

## Mata Elang Platform Architecture

```mermaid
---
config:
  layout: elk
  elk:
    mergeEdges: false
    nodePlacementStrategy: SIMPLE 
---
graph LR
    network_isp(Internet)
    network_router(Router)
    network_tapper(Tapper)

    sensor1_snort(Snort v3)
    sensor1_parser(Sensor Parser)

    dc_sensor_api(Sensor API Server)
    dc_kafka(Apache Kafka)
    dc_opensearch(OpenSearch)
    dc_dashboard(OpenSearch Dashboard)

    subgraph Site A
        network_isp-->network_tapper
        network_tapper-->network_router
        network_tapper-->sensor1_snort
        
        subgraph me_sensor1[Mata Elang Sensor]
            sensor1_snort-->sensor1_parser
        end
    end

    subgraph me_dc[Mata Elang Defense Center]
        sensor1_parser-->dc_sensor_api
        dc_sensor_api-->dc_kafka
        dc_kafka-->dc_opensearch
        dc_opensearch-->dc_dashboard
    end
```

## Installation

Here, as an example, we will show you how to set up the Mata Elang Platform.

If you are interested in deploying the Mata Elang Platform locally, you can follow the quick start guide below.

[Quick Start Guide](/docs/quick-start.md)

<!-- #### All Servers

1. [Time Zone and NTP](/mata-elang-stable/mataelang-platform/wiki/time-zone-and-ntp) -->

### Sensor Installation and Configuration

Sensor is a network security monitoring platform that uses Snort as the network intrusion detection system (NIDS). The sensor is deployed in the network to monitor the traffic and detect any malicious activities. The sensor sends the logs to the defense center for further analysis and visualization.

Go to the [Sensor Installation and Configuration](#sensor-installation-and-configuration) page to set up the sensor.

### Defense Center Installation and Configuration

Defense Center is a big data platform that uses Apache Kafka as the distributed messaging system and big data technology orchestrated on lambda architecture. The defense center receives the logs from the sensors, processes the logs, and visualizes the attack statistics.

Go to the [Defense Center Installation and Configuration](#defense-center-installation-and-configuration) page to set up the defense center.

## Operation and Maintenance

This section provides information on how to operate and maintain the Mata Elang Platform. It includes startup and shutdown procedures, user management, sensor management, and troubleshooting.

- [Abstract](#abstract)
- [Project Overview](#project-overview)
- [Mata Elang Platform Architecture](#mata-elang-platform-architecture)
- [Installation](#installation)
  - [Sensor Installation and Configuration](#sensor-installation-and-configuration)
  - [Defense Center Installation and Configuration](#defense-center-installation-and-configuration)
- [Operation and Maintenance](#operation-and-maintenance)
