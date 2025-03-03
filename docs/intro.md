---
title: Introduction
sidebar_position: 1
---
![GitHub stars](https://img.shields.io/github/stars/mata-elang-stable/MataElang-Platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/mata-elang-stable/MataElang-Platform?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/mata-elang-stable/MataElang-Platform?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/mata-elang-stable/MataElang-Platform)
[![Discord](https://img.shields.io/badge/Discord-Mata_Elang-blue?logo=discord&logoColor=white)](https://discord.gg/gRVMNZMP)

Mata Elang is the evolution of the Mata Garuda Internet Monitoring Project for Indonesia. This project was initialized as a private repository in 2018 by Cyber Security Research Group (CSRG) - Politeknik Elektronika Negeri Surabaya (PENS). Currently, Mata Elang is a collaboration research between PENS, Universitas Indonesia (UI), and Badan Riset dan Inovasi Nasional (BRIN)with supports from Japan International Cooperation Agency (JICA).

This project is based on the article: Saputra, F.A.; Salman, M.; Hasim, J.A.N.; Nadhori, I.U.; Ramli, K. The Next-Generation NIDS Platform: Cloud-Based Snort NIDS Using Containers and Big Data. Big Data Cogn. Comput. 2022, 6, 19.
[Read the article here](https://www.mdpi.com/2504-2289/6/1/19)

## Key Features

- 🚀 **Effortless Setup**: Mata Elang provides a seamless deployment experience using Docker Compose, making it easy to install and manage across different environments. Whether you're deploying on a single machine or a cloud-based infrastructure, the setup process is streamlined to reduce complexity and ensure a quick start.
- 🔍 **Advanced Intrusion Detection with Snort**: At its core, Mata Elang integrates Snort, a leading Network Intrusion Detection System (NIDS), to monitor and analyze network traffic for potential threats. It leverages real-time packet inspection and rule-based detection to identify malicious activities and security breaches.
- 📊 **Big Data Analytics for Threat Intelligence**: Unlike traditional NIDS solutions, Mata Elang is built on a Big Data platform, allowing it to process and store massive amounts of network traffic data efficiently. This ensures better detection accuracy, supports long-term trend analysis, and enables real-time correlation of security events.
- 🏗 **Scalable & Distributed Architecture**: Mata Elang is designed for scalability, enabling security teams to deploy sensors across multiple network nodes. Its distributed architecture ensures that even high-traffic networks can be monitored efficiently without performance bottlenecks.
- 🛡 **Real-Time Threat Detection & Response**: By leveraging machine learning and behavioral analysis, Mata Elang can detect anomalies in network traffic and provide real-time alerts. The system is capable of adapting to new and evolving cyber threats, offering a proactive approach to network security.

## Project Architecture

![MataElang-V2-Architecture](../static/uploads/895f8b2042c298e66625e99e20c8a409/MataElangv2Architecture.drawio__2_.png)

## Component Functionality

### Network Traffic Monitoring

- **Network Tap**: This component passively captures incoming and outgoing network traffic from the Protected LAN (internal network) and sends it to the Snort Intrusion Detection Sensor for analysis.
- The goal is to monitor all data packets without interfering with normal network operations.

### Intrusion Detection & Data Parsing

- **Snort (Intrusion Detection Sensor)**: This is the core detection engine responsible for analyzing network packets and identifying potential security threats based on predefined rules.
- If Snort detects a suspicious packet, it forwards the information to the Parser.
- **Parser**: Extracts relevant metadata from Snort alerts and converts it into a structured format for further processing.

### Data Transmission & Processing

- The parsed data is sent to the Defense Center, which is responsible for storing, processing, and analyzing threats using scalable big data technologies.
- **Sensor API**: Acts as an intermediary that receives data from the sensor (Snort) and ensures secure data transmission to the backend processing components.

### Event Streaming & Threat Intelligence

- **Kafka (Event Streaming Platform):** Kafka acts as a message broker, ensuring that Snort-generated alerts are processed in real time.
- It allows high-throughput data streaming, making the system scalable and responsive to large volumes of traffic data.
