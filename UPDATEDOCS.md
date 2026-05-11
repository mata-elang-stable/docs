# Mata Elang v2.1 — Docker Deployment

Mata Elang is an open-source network security monitoring platform that combines a Snort-based intrusion detection sensor with a centralized defense center for real-time alert collection, enrichment, and visualization.

This repository contains Docker Compose configurations to deploy the complete platform, including optional reporting and threat intelligence add-ons.

---

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step 1 — Generate TLS Certificates](#step-1--generate-tls-certificates)
- [Step 2 — Deploy the Defense Center](#step-2--deploy-the-defense-center)
- [Step 3 — Deploy the Sensor](#step-3--deploy-the-sensor)
- [Configuration Reference](#configuration-reference)
  - [config.toml (TLS)](#configtoml-tls)
  - [Defense Center .env](#defense-center-env)
  - [Sensor .env](#sensor-env)
- [Web Interfaces](#web-interfaces)
- [Add-ons](#add-ons)
  - [Reporting](#reporting-add-on)
  - [OpenCTI Integration](#opencti-integration-add-on)
- [Managing Snort Rules](#managing-snort-rules)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Sensor Host (one or more)                                       │
│                                                                  │
│  ┌──────────┐   alerts (JSON)   ┌──────────────┐               │
│  │  Snort3  │ ───────────────▶  │ snort-parser │               │
│  │  (NIDS)  │                   │ (gRPC client)│               │
│  └──────────┘                   └──────┬───────┘               │
└────────────────────────────────────────│────────────────────────┘
                                         │ gRPC / mTLS (port 50051)
┌────────────────────────────────────────│────────────────────────┐
│  Defense Center Host                   ▼                         │
│                                ┌─────────────┐                  │
│                                │ sensor-api  │                  │
│                                │ (gRPC srvr) │                  │
│                                └──────┬──────┘                  │
│                                       │ Kafka topic: sensor_events│
│                                ┌──────▼──────┐                  │
│                                │   broker    │  (Kafka / KRaft) │
│                                └──────┬──────┘                  │
│                        ┌─────────────┤                          │
│               consume  │             │ consume                   │
│         ┌──────────────▼──┐    ┌─────▼───────────────────┐     │
│         │ event-stream-   │    │  opensearch-logstash     │     │
│         │ aggr            │    │  (GeoIP + enrichment)    │     │
│         └──────┬──────────┘    └─────────────┬────────────┘     │
│                │ topic: snort_alerts          │                  │
│         ┌──────▼──────────┐           ┌──────▼──────────┐       │
│         │ (back to broker)│           │  opensearch     │       │
│         └─────────────────┘           └──────┬──────────┘       │
│                                              │                   │
│                                       ┌──────▼──────────┐       │
│                                       │ opensearch-     │       │
│                                       │ dashboards      │       │
│                                       └─────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
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

---

## Components

### Defense Center (`defense_center/`)

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
| `opensearch-init` | `curlimages/curl` | — | One-shot init container: loads index templates and dashboards |

### Sensor (`sensor_snort/`)

| Service | Image | Description |
|---|---|---|
| `snort` | `ghcr.io/mata-elang-stable/snort3-docker-image` | Snort3 NIDS — captures and inspects network traffic |
| `snort-parser` | `ghcr.io/mata-elang-stable/sensor-snort-service` | Reads Snort JSON alerts and forwards them to the defense center via gRPC |

---

## Prerequisites

| Tool | Version | Required for |
|---|---|---|
| Docker Engine | 24.x+ | Running all services |
| Docker Compose | v2.x+ | Orchestrating multi-container stacks |
| `openssl` | any | TLS certificate generation |
| `keytool` (OpenJDK) | any | Java keystore generation (Kafka) |

Install certificate tools on Debian/Ubuntu:

```bash
sudo apt install openssl default-jre-headless
```

> **Note:** The sensor requires the network interface to be in promiscuous mode for full packet capture. This is optional — Snort will still function without it, but may miss some traffic.

---

## Quick Start

The deployment order is: **generate certificates → start defense center → start sensor**.

---

## Step 1 — Generate TLS Certificates

All services communicate over mutual TLS (mTLS). The `generate.sh` script creates a full certificate hierarchy from a single configuration file.

### 1.1 Configure

```bash
cp config.example.toml config.toml
```

Edit `config.toml` and set at minimum:

```toml
[ca]
common_name = "mataelang-ca"
organization = "YourOrg"
country = "ID"

[ssl]
password = "YourStrongPassword@123"   # used for ALL keystores

[output]
directory = "./ssl_certs"
```

> **Important:** The `ssl.password` value must match `SSL_PASSWORD` in `defense_center/.env`. Keep it consistent.

### 1.2 Generate

```bash
./generate.sh                         # use config.toml
./generate.sh --config custom.toml   # use a different config file
./generate.sh --output /path/to/dir  # override output directory
./generate.sh --force                 # regenerate all certs (ignores validity check)
```

The script is idempotent — it skips any certificate with more than 60 days remaining validity. Use `--force` to regenerate everything.

### 1.3 Verify

```bash
./validate.sh ssl_certs/ca/ca.crt    # validate the CA certificate
./validate.sh --all                   # validate all .crt and .pem files
./validate.sh --full ssl_certs/ca/ca.crt  # show full certificate details
./validate.sh --quiet ssl_certs/ca/ca.crt # machine-readable PASS/FAIL
```

### Generated Output Structure

```
ssl_certs/
├── ca/
│   ├── ca.key                        # CA private key
│   └── ca.crt                        # CA certificate (PEM)
├── truststore/
│   ├── truststore.jks                # Java truststore (contains CA cert)
│   └── truststore_creds              # Truststore password file
├── broker/
│   ├── kafka.broker.keystore.pkcs12  # Broker keystore (PKCS12)
│   ├── broker_keystore_creds         # Keystore password
│   └── broker_sslkey_creds           # Key password
├── schema-registry/
│   └── schema-registry-keystore.jks
├── kafka-ui/
│   └── kafka-ui.p12
├── logstash/
│   └── logstash-keystore.jks
├── sensor-api/
│   ├── sensor-api.p12                # PKCS12 keystore (Go service)
│   ├── sensor-api.crt                # Server certificate (for gRPC TLS)
│   └── sensor-api.key                # Server private key
├── event-stream-aggr/
│   └── event-stream-aggr.p12
└── opensearch/
    ├── opensearch-node1.pem          # Node certificate (PEM)
    └── opensearch-node1-key.pem      # Node private key (PEM)
```

---

## Step 2 — Deploy the Defense Center

```bash
cd defense_center
cp .env.example .env
```

Edit `.env` with your values (see [Defense Center .env](#defense-center-env)), then start all services:

```bash
docker compose up -d
```

Wait approximately 60–90 seconds for OpenSearch and Kafka to be ready. The `opensearch-init` container will automatically load index templates and import the pre-built dashboard.

**Check service health:**

```bash
docker compose ps
docker compose logs -f opensearch-init   # watch init progress
docker compose logs -f opensearch-logstash  # watch ingestion pipeline
```

---

## Step 3 — Deploy the Sensor

The sensor can run on the same host as the defense center, or on a separate machine.

```bash
cd sensor_snort
cp .env.example .env
```

Edit `.env` — at minimum set:

```bash
NETWORK_INTERFACE=eth0               # interface to capture packets on
MES_CLIENT_SERVER=172.17.0.1        # IP of the defense center host
MES_CLIENT_SENSOR_ID=sensor-1       # unique name for this sensor
```

If deploying on a separate machine, copy the CA certificate from the defense center:

```bash
# on the defense center host
scp ssl_certs/ca/ca.crt user@sensor-host:/path/to/example-docker-deployment/ssl_certs/ca/ca.crt
```

Then start the sensor:

```bash
docker compose up -d
```

---

## Configuration Reference

### `config.toml` (TLS)

This file controls the TLS certificate generation. All fields reference the TOML structure.

```toml
# ─── Certificate Authority ────────────────────────────────────────────
[ca]
common_name = "mataelang-ca"   # CN for the CA certificate
organization = "MATAELANG"     # O field
country = "ID"                 # C field (2-letter ISO code)
state = "EastJava"             # ST field
locality = "Surabaya"          # L field
days_valid = 3650              # CA validity in days (~10 years)
key_size = 4096                # RSA key size (bits)

# ─── TLS Password ─────────────────────────────────────────────────────
[ssl]
# Single password used for ALL keystores (JKS and PKCS12).
# Must match SSL_PASSWORD in defense_center/.env
password = "SecurePassword@123"

# ─── Output Directory ─────────────────────────────────────────────────
[output]
directory = "./ssl_certs"

# ─── Kafka Client Certificates ────────────────────────────────────────
# Each [[clients]] block creates one certificate + keystore.
#   name:              Common Name (CN); also used as the directory name
#   dns:               Subject Alternative Name DNS entries
#   ip:                Subject Alternative Name IP entries (optional)
#   keystore_type:     "pkcs12" or "jks"
#   keystore_filename: optional override for the keystore filename

[[clients]]
name = "broker"
dns = ["broker", "localhost"]
ip = ["127.0.0.1"]
keystore_type = "pkcs12"
keystore_filename = "kafka.broker.keystore.pkcs12"  # Kafka expects this name

[[clients]]
name = "schema-registry"
dns = ["schema-registry", "localhost"]
keystore_type = "jks"

[[clients]]
name = "kafka-ui"
dns = ["kafka-ui", "localhost"]
keystore_type = "jks"

[[clients]]
name = "logstash"
dns = ["logstash", "localhost"]
keystore_type = "jks"

[[clients]]
name = "event-stream-aggr"
dns = ["event-stream-aggr", "localhost"]
keystore_type = "pkcs12"

[[clients]]
name = "sensor-api"
dns = ["sensor-api", "localhost"]
keystore_type = "pkcs12"

# ─── OpenSearch Node Certificate ──────────────────────────────────────
# OpenSearch uses raw PEM files rather than JKS/PKCS12.
[opensearch]
node_name = "opensearch-node1"
dns = ["opensearch-node1", "localhost"]
ip = ["127.0.0.1"]
```

---

### Defense Center `.env`

Copy `defense_center/.env.example` to `defense_center/.env` and edit the values below.

```bash
# ─── Sensor API (gRPC Server) ─────────────────────────────────────────
MES_SERVER_HOST=0.0.0.0              # Listen address
MES_SERVER_PORT=50051                # gRPC port
MES_SERVER_KAFKA_BROKERS=broker:19094
MES_SERVER_KAFKA_TOPIC=sensor_events
MES_SERVER_SCHEMA_REGISTRY_URL=https://schema-registry:8081
MES_SERVER_SECURITY_PROTOCOL=SSL
MES_SERVER_MAX_MESSAGE_SIZE=1024     # Max gRPC message size (MB)

# gRPC server TLS
MES_SERVER_SECURE=true
MES_SERVER_CERTIFICATE=/app/server.crt
MES_SERVER_KEY=/app/server.key

# Kafka mTLS (client certificate)
MES_SERVER_PATH_TO_CA=/app/ca.pem
MES_SERVER_PATH_TO_CLIENT_KEYSTORE=/app/sensor-client.p12
MES_SERVER_CLIENT_KEYSTORE_PASSWORD=SecurePassword@123  # must match ssl.password

# ─── OpenSearch ────────────────────────────────────────────────────────
# Initial admin password — must be complex (uppercase, number, symbol)
OPENSEARCH_INITIAL_ADMIN_PASSWORD=SecurePassword@123

# ─── SSL / Kafka Keystores ────────────────────────────────────────────
# Must match ssl.password in config.toml
SSL_PASSWORD=SecurePassword@123

# ─── File Ownership ───────────────────────────────────────────────────
# Set to your host user's UID/GID to avoid permission issues on volumes
HOST_UID=1000
HOST_GID=1000

# ─── Add-on: OpenCTI ─────────────────────────────────────────────────
# OPENCTI_URL=http://opencti:8080
# OPENCTI_API_KEY=your-opencti-api-key
```

> **Password consistency:** `SSL_PASSWORD`, `MES_SERVER_CLIENT_KEYSTORE_PASSWORD`, and `ssl.password` in `config.toml` must all be the same value.

---

### Sensor `.env`

Copy `sensor_snort/.env.example` to `sensor_snort/.env`.

```bash
# ─── Snort Configuration ──────────────────────────────────────────────
# Network interface for packet capture
NETWORK_INTERFACE=eth0

# Snort rule options (all optional)
# SNORT_OINKCODE=                   # Snort.org registered user code
# RULESET=community                 # community | registered | lightspd
# SNORT_COMPRESSED_RULES_FILE_PATH= # path inside container (e.g. /tmp/rules/community-rules.tar.gz)
# IPS_POLICY=balanced               # connectivity | balanced | security | max-detect | none
# SNORT_BLOCKLIST=false
# ET_BLOCKLIST=false

# ─── Snort Parser (gRPC Client) ───────────────────────────────────────
# IP or hostname of the defense center running sensor-api
MES_CLIENT_SERVER=172.17.0.1        # use 172.17.0.1 if same host, else remote IP
MES_CLIENT_PORT=50051

# Unique identifier for this sensor (appears in dashboards)
MES_CLIENT_SENSOR_ID=sensor-1

# Path to Snort alert file (default; shared volume with snort container)
MES_CLIENT_FILE=/var/log/snort/alert_json.txt
# Alternative: use Unix socket instead of file
# MES_CLIENT_SOCKET=/var/log/snort/alert.sock

# Batch interval between gRPC sends
MES_CLIENT_INTERVAL=1s

# Maximum concurrent gRPC stream clients
MES_CLIENT_MAX_CLIENTS=10

# gRPC TLS (client verifies server certificate)
MES_CLIENT_SECURE=true
MES_CLIENT_CERTIFICATE=/secrets/ca.crt     # mounted CA certificate
MES_CLIENT_SERVER_NAME=sensor-api          # must match CN/SAN in server cert
```

---

## Web Interfaces

After starting the defense center, the following UIs are available:

| Interface | URL | Default Credentials |
|---|---|---|
| OpenSearch Dashboards | http://localhost:5601 | `admin` / value of `OPENSEARCH_INITIAL_ADMIN_PASSWORD` |
| Kafka UI | http://localhost:9021 | None (unauthenticated) |
| Reporting (add-on) | http://localhost:8085 | See Reporting add-on section |

> OpenSearch Dashboards ships with a pre-imported dashboard for Mata Elang sensor events. Navigate to **Dashboards** in the left sidebar to find it.

---

## Add-ons

Add-ons connect to the main `mataelang_default` Docker network and extend the core platform.

### Reporting Add-on

Generates Daily, Monthly, Quarterly, and Yearly PDF reports from sensor event data. Includes an IP geolocation lookup service powered by MaxMind GeoLite2 databases.

#### Prerequisites

Download the free GeoLite2 databases from [MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/) (requires free account registration):

```bash
cp /path/to/GeoLite2-City.mmdb defense_center/files/GeoLite2-City.mmdb
cp /path/to/GeoLite2-ASN.mmdb  defense_center/files/GeoLite2-ASN.mmdb
```

#### Deploy

The defense center must already be running before starting the reporting add-on.

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
| `chromium` | Headless Chromium — renders PDF reports (remote debugging port 9222) |

---

### OpenCTI Integration Add-on

Correlates Mata Elang sensor events with threat intelligence data from an [OpenCTI](https://www.opencti.io/) instance.

#### Prerequisites

Deploy an OpenCTI instance separately. Refer to the [OpenCTI Installation Guide](https://docs.opencti.io/latest/deployment/installation/).

Then configure the connection in `defense_center/.env`:

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

---

## Managing Snort Rules

### Custom Rules

Add your own Snort rules to `sensor_snort/custom.rules`:

```
alert tcp any any -> $HTTP_SERVERS 80 (msg:"HTTP traffic detected"; sid:10000002; rev:1;)
alert icmp any any -> any any (msg:"ICMP ping detected"; sid:10000001; rev:1;)
```

Apply by restarting Snort:

```bash
cd sensor_snort
docker compose restart snort
```

### Community / Registered Rulesets

To use the Snort community or registered rulesets, set in `sensor_snort/.env`:

```bash
# Community rules (no account required)
RULESET=community

# Registered rules (free Snort.org account required)
RULESET=registered
SNORT_OINKCODE=your-oinkcode-here
```

### Compressed Rule Archives

Download a rules archive and place it in `sensor_snort/rules/`:

```bash
wget https://www.snort.org/downloads/community/community-rules.tar.gz \
     -O sensor_snort/rules/community-rules.tar.gz
```

Then set in `sensor_snort/.env`:

```bash
SNORT_COMPRESSED_RULES_FILE_PATH=/tmp/rules/community-rules.tar.gz
```

Restart Snort to load the new rules:

```bash
cd sensor_snort
docker compose restart snort
```

---

## Project Structure

```
.
├── config.example.toml          # TLS certificate configuration template
├── generate.sh                  # Certificate generation script
├── validate.sh                  # Certificate validation script
│
├── ssl_certs/                   # Generated certificates (gitignored)
│   ├── ca/                      # CA key and certificate
│   ├── truststore/              # JKS truststore for Java services
│   ├── broker/                  # Kafka broker keystore
│   ├── schema-registry/         # Schema Registry keystore
│   ├── kafka-ui/                # Kafka UI keystore
│   ├── logstash/                # Logstash keystore
│   ├── sensor-api/              # sensor-api PKCS12 keystore + PEM cert/key
│   ├── event-stream-aggr/       # event-stream-aggr PKCS12 keystore
│   └── opensearch/              # OpenSearch PEM cert/key pair
│
├── defense_center/
│   ├── compose.yml              # Core defense center stack
│   ├── compose.reporting.yml    # Reporting add-on stack
│   ├── compose.opencti-connector.yml  # OpenCTI add-on stack
│   ├── .env.example             # Environment configuration template
│   ├── conf/
│   │   ├── pipeline.conf        # Logstash pipeline (Kafka → OpenSearch)
│   │   ├── default.conf         # Nginx config for report-api-web
│   │   └── report-api.env       # Laravel environment for report-api
│   ├── scripts/
│   │   └── opensearch-init.sh   # Loads OpenSearch templates and dashboards
│   ├── templates/
│   │   ├── component-templates/ # OpenSearch component templates (field mappings)
│   │   ├── index-templates/     # OpenSearch index templates
│   │   ├── data-streams/        # OpenSearch data stream definitions
│   │   └── saved-objects/       # Pre-built OpenSearch Dashboards (NDJSON)
│   └── files/                   # GeoLite2 databases for reporting (gitignored)
│
└── sensor_snort/
    ├── compose.yml              # Snort sensor stack
    ├── .env.example             # Sensor configuration template
    ├── custom.rules             # Custom Snort rules
    └── rules/                   # Compressed rule archives (gitignored)
```

---

## Troubleshooting

### Certificates not found at startup

Ensure `./generate.sh` completed successfully and `ssl_certs/` is populated before running `docker compose up -d`. The defense center mounts certificates from `../ssl_certs/` relative to its directory.

### OpenSearch fails to start

OpenSearch requires a strong initial admin password (at least one uppercase letter, lowercase letter, digit, and special character):

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

### Sensor not sending events

1. Confirm the defense center's `sensor-api` is reachable on port 50051 from the sensor host.
2. Verify `MES_CLIENT_SERVER` in `sensor_snort/.env` points to the correct IP.
3. Check that the CA certificate exists at `ssl_certs/ca/ca.crt` on the sensor host.
4. View sensor logs:

```bash
cd sensor_snort
docker compose logs -f snort-parser
```

### Regenerate expired or incorrect certificates

```bash
./generate.sh --force
cd defense_center && docker compose restart
cd ../sensor_snort && docker compose restart
```

### View real-time logs for any service

```bash
cd defense_center
docker compose logs -f <service-name>
# e.g.:
docker compose logs -f opensearch-logstash
docker compose logs -f event-stream-aggr
docker compose logs -f sensor-api
```