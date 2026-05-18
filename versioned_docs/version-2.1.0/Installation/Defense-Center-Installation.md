---
title: Mata Elang Defense Center
sidebar_position: 3
---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Sensor Host (one or more)                                       │
│                                                                  │
│  ┌──────────┐   alerts (JSON)   ┌──────────────┐                 │
│  │  Snort3  │ ───────────────▶  │ snort-parser │                 │
│  │  (NIDS)  │                   │ (gRPC client)│                 │
│  └──────────┘                   └──────┬───────┘                 │
└────────────────────────────────────────│─────────────────────────┘
                                         │ gRPC / mTLS (port 50051)
┌────────────────────────────────────────│───────────────────────────┐
│  Defense Center Host                   ▼                           │
│                                ┌─────────────┐                     │
│                                │ sensor-api  │                     │
│                                │ (gRPC srvr) │                     │
│                                └──────┬──────┘                     │
│                                       │ Kafka topic: sensor_events │
│                                ┌──────▼──────┐                     │
│                                │   broker    │  (Kafka / KRaft)    │
│                                └──────┬──────┘                     │
│                        ┌──────────────┤                            │
│               consume  │              │ consume                    │
│         ┌──────────────▼──┐    ┌──────▼───────────────────┐        │
│         │ event-stream-   │    │  opensearch-logstash     │        │
│         │ aggr            │    │  (GeoIP + enrichment)    │        │
│         └──────┬──────────┘    └─────────────┬────────────┘        │
│                │ topic: snort_alerts         │                     │
│         ┌──────▼──────────┐           ┌──────▼──────────┐          │
│         │ (back to broker)│           │  opensearch     │          │
│         └─────────────────┘           └──────┬──────────┘          │
│                                              │                     │
│                                       ┌──────▼──────────┐          │
│                                       │ opensearch-     │          │
│                                       │ dashboards      │          │
│                                       └─────────────────┘          │
└────────────────────────────────────────────────────────────────────┘
```

### Event Flow

| Stage | From | To | Protocol |
|---|---|---|---|
| Packet capture | Network interface | Snort3 | libpcap |
| Alert forwarding | snort-parser | sensor-api | gRPC over mTLS |
| Raw event ingestion | sensor-api | Kafka `sensor_events` | Kafka / SSL |
| Aggregation | event-stream-aggr | Kafka `snort_alerts` | Kafka / SSL |
| Storage & enrichment | Logstash | OpenSearch | HTTPS |
| Visualization | OpenSearch Dashboards | Browser | HTTP (port 5601) |

## Components

| Service | Image | Port | Description |
|---|---|---|---|
| `sensor-api` | `ghcr.io/mata-elang-stable/sensor-snort-service` | 50051 | gRPC server — receives Snort alerts from sensors |
| `broker` | `confluentinc/cp-kafka:8.2.0` | 9092, 19093 | Kafka broker in KRaft mode with full mTLS |
| `schema-registry` | `confluentinc/cp-schema-registry:8.2.0` | 8081 | Avro schema registry over HTTPS |
| `kafka-ui` | `provectuslabs/kafka-ui` | 9021 | Web UI for Kafka monitoring |
| `event-stream-aggr` | `ghcr.io/mata-elang-stable/event-stream-aggr` | — | Aggregates and transforms sensor events |
| `opensearch-node1` | `opensearchproject/opensearch:3` | 9200 | Single-node OpenSearch with TLS |
| `opensearch-dashboards` | `opensearchproject/opensearch-dashboards:3` | 5601 | Dashboard and visualization UI |
| `opensearch-logstash` | `opensearchproject/logstash-oss-with-opensearch-output-plugin:8.9.0` | — | Kafka → OpenSearch pipeline with GeoIP enrichment |
| `opensearch-init` | `curlimages/curl` | — | One-shot init: loads index templates and dashboards |

## Prerequisites

✅ Ubuntu 24.04 LTS installed and updated:

```bash
sudo apt update && sudo apt -y upgrade
```

✅ Docker Engine **24.x or later** and Docker Compose **v2.x or later** installed.

:key: Follow the [Docker Official Documentation](https://docs.docker.com/engine/install/) for your Linux distribution.

:warning: **NOTE:** Verify your Docker version with:

```bash
docker -v && docker compose version
```

✅ `openssl` and `keytool` (OpenJDK) for TLS certificate generation:

```bash
sudo apt install openssl default-jre-headless
```

✅ TLS certificates already generated. All services communicate over mutual TLS (mTLS). **You must complete the [Certificate Generation](./Certificate-Generation.md) guide before proceeding.**

## Installing the Defense Center

### Download Installation Media

▶️ Clone [Mata Elang v2 Defense Center](https://github.com/mata-elang-stable/example-docker-deployment.git) from GitHub.

```bash
git clone https://github.com/mata-elang-stable/example-docker-deployment.git
cd example-docker-deployment
```

▶️ Navigate to the Defense Center directory and verify the structure.

```bash
cd defense_center && tree --dirsfirst -L 1
```

🔑 Expected directory structure:

```bash
.
├── conf
├── files
├── scripts
├── templates
├── compose.opencti-connector.yml
├── compose.reporting.yml
├── compose.yml
└── readme.md

5 directories, 4 files
```

### Environment Configuration

▶️ Create a **.env** file by copying the provided example:

```bash
cp .env.example .env
```

▶️ Edit **.env** with your values:

```bash
nano .env
```

🔑 The **.env** file reference:

```bash
# ─── Sensor API (gRPC Server) ─────────────────────────────────────────
MES_SERVER_HOST=0.0.0.0
MES_SERVER_PORT=50051
MES_SERVER_KAFKA_BROKERS=broker:19094
MES_SERVER_KAFKA_TOPIC=sensor_events
MES_SERVER_SCHEMA_REGISTRY_URL=https://schema-registry:8081
MES_SERVER_SECURITY_PROTOCOL=SSL
MES_SERVER_MAX_MESSAGE_SIZE=1024

# gRPC server TLS
MES_SERVER_SECURE=true
MES_SERVER_CERTIFICATE=/app/server.crt
MES_SERVER_KEY=/app/server.key

# Kafka mTLS (client certificate)
MES_SERVER_PATH_TO_CA=/app/ca.pem
MES_SERVER_PATH_TO_CLIENT_KEYSTORE=/app/sensor-client.p12
MES_SERVER_CLIENT_KEYSTORE_PASSWORD=SecurePassword@123  # must match ssl.password in config.toml

# ─── OpenSearch ────────────────────────────────────────────────────────
# Minimum 8 characters: uppercase, lowercase, digit, and special character
OPENSEARCH_INITIAL_ADMIN_PASSWORD=SecurePassword@123

# ─── SSL / Kafka Keystores ────────────────────────────────────────────
# Must match ssl.password in config.toml
SSL_PASSWORD=SecurePassword@123

# ─── File Ownership ───────────────────────────────────────────────────
# Set to your host user's UID/GID to avoid permission issues on volumes
HOST_UID=1000
HOST_GID=1000

# ─── Add-on: OpenCTI (optional) ──────────────────────────────────────
# OPENCTI_URL=http://opencti:8080
# OPENCTI_API_KEY=your-opencti-api-key
```

:warning: **NOTE:** `SSL_PASSWORD`, `MES_SERVER_CLIENT_KEYSTORE_PASSWORD`, and `ssl.password` in `config.toml` **must all be the same value**.

### Installing Defense Center

▶️ Pull the container images:

```bash
docker compose pull
```

▶️ Start all services:

```bash
docker compose up -d
```

Wait approximately **60–90 seconds** for OpenSearch and Kafka to be ready. The `opensearch-init` container will automatically load index templates and import the pre-built dashboard.

▶️ Check that all containers are running:

```bash
docker compose ps
```

🔑 You should see output similar to:

```bash
NAME                              IMAGE                                                                SERVICE                  STATUS
mataelang-broker-1                confluentinc/cp-kafka:8.2.0                                          broker                   Up
mataelang-event-stream-aggr-1     ghcr.io/mata-elang-stable/event-stream-aggr                          event-stream-aggr        Up
mataelang-kafka-ui-1              provectuslabs/kafka-ui                                               kafka-ui                 Up
mataelang-opensearch-dashboards-1 opensearchproject/opensearch-dashboards:3                            opensearch-dashboards    Up
mataelang-opensearch-init-1       curlimages/curl                                                      opensearch-init          Up
mataelang-opensearch-logstash-1   opensearchproject/logstash-oss-with-opensearch-output-plugin:8.9.0   opensearch-logstash      Up
mataelang-opensearch-node1-1      opensearchproject/opensearch:3                                       opensearch-node1         Up
mataelang-schema-registry-1       confluentinc/cp-schema-registry:8.2.0                               schema-registry          Up
mataelang-sensor-api-1            ghcr.io/mata-elang-stable/sensor-snort-service                       sensor-api               Up
```

▶️ Watch the init progress and confirm dashboards are imported:

```bash
docker compose logs -f opensearch-init
docker compose logs -f opensearch-logstash
```

## Web Interfaces

After the Defense Center is running, the following UIs are available:

| Interface | URL | Default Credentials |
|---|---|---|
| OpenSearch Dashboards | http://localhost:5601 | `admin` / value of `OPENSEARCH_INITIAL_ADMIN_PASSWORD` |
| Kafka UI | http://localhost:9021 | None (unauthenticated) |
| Reporting (add-on) | http://localhost:8085 | See [Reporting Add-on](#reporting-add-on) |

🔑 OpenSearch Dashboards ships with a pre-imported dashboard for Mata Elang sensor events. Navigate to **Dashboards** in the left sidebar to find it.

![image](../uploads/d143583d02f5f501f135a9c935f97f6e/image.png)

## Add-ons

Add-ons connect to the main `mataelang_default` Docker network and extend the core platform. The Defense Center must be running before starting any add-on.

### Reporting Add-on

Generates Daily, Monthly, Quarterly, and Yearly PDF reports from sensor event data. Includes an IP geolocation lookup service powered by MaxMind GeoLite2 databases.

#### Prerequisites

Download the free GeoLite2 databases from [MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/) (free account required) and place them in `defense_center/files/`:

```bash
cp /path/to/GeoLite2-City.mmdb defense_center/files/GeoLite2-City.mmdb
cp /path/to/GeoLite2-ASN.mmdb  defense_center/files/GeoLite2-ASN.mmdb
```

#### Deploy

```bash
cd defense_center
docker compose -f compose.reporting.yml up -d
```

Access the reporting dashboard at **http://localhost:8085**.

#### Reporting Stack Services

| Service | Description |
|---|---|
| `report-command-service` | Consumes Kafka `sensor_events` and posts to the report API |
| `report-api` | Laravel PHP application — report generation engine |
| `report-api-web` | Nginx — serves the report web UI on port 8085 |
| `iplookup-api` | REST API for GeoLite2 IP lookups (city + ASN) |
| `postgresql` | PostgreSQL 17 — stores report data and sessions |
| `redis` | Valkey (Redis-compatible) — session and queue backend |
| `chromium` | Headless Chromium — renders PDF reports |

---

### OpenCTI Integration Add-on

Correlates Mata Elang sensor events with threat intelligence data from an [OpenCTI](https://www.opencti.io/) instance.

#### Prerequisites

Deploy an OpenCTI instance separately, then configure the connection in `defense_center/.env`:

```bash
OPENCTI_URL=http://your-opencti-host:8080
OPENCTI_API_KEY=your-opencti-api-token
```

#### Deploy

```bash
cd defense_center
docker compose -f compose.opencti-connector.yml up -d
```

#### OpenCTI Stack Services

| Service | Description |
|---|---|
| `opencti-connector-aggregator` | Consumes `sensor_events` from Kafka and publishes to `opencti_events` |
| `opencti-connector-parser` | Reads `opencti_events` and pushes indicators to OpenCTI |

## Troubleshooting

### Certificates not found at startup

Ensure `./generate.sh` completed successfully and `ssl_certs/` is populated **before** running `docker compose up -d`. The Defense Center mounts certificates from `../ssl_certs/` relative to its directory.

### OpenSearch fails to start

OpenSearch requires a strong initial admin password (uppercase, lowercase, digit, and special character):

```bash
OPENSEARCH_INITIAL_ADMIN_PASSWORD=MyStr0ng!Pass
```

Check logs:

```bash
docker compose logs opensearch-node1
```

### Logstash cannot connect to Kafka

Kafka uses mTLS — verify that the JKS truststore and keystore files exist and that `SSL_PASSWORD` in `.env` matches the password used during certificate generation:

```bash
ls -la ssl_certs/truststore/
ls -la ssl_certs/logstash/
docker compose logs opensearch-logstash
```

### Regenerate expired or incorrect certificates

```bash
./generate.sh --force
cd defense_center && docker compose restart
```

### View real-time logs for any service

```bash
docker compose logs -f <service-name>
# e.g.:
docker compose logs -f opensearch-logstash
docker compose logs -f event-stream-aggr
docker compose logs -f sensor-api
```
