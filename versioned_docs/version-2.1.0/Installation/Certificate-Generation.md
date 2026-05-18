---
title: Certificate Generation
sidebar_position: 1
---

## Overview

The Mata Elang v2.1 platform uses **mutual TLS (mTLS)** for all inter-service communication. This includes Kafka, Schema Registry, sensor-api, Logstash, OpenSearch, and the sensor's gRPC client. All certificates are generated from a single script (`generate.sh`) and a single configuration file (`config.toml`).

This guide covers how to configure, generate, and validate the TLS/mTLS certificates required by the platform.

## Prerequisites

✅ **openssl** and **keytool** (from OpenJDK/JRE) must be installed on the machine where you will generate certificates.

```bash
sudo apt update && sudo apt install openssl default-jre-headless
```

✅ You must already have **Git** and **Docker** installed and should have cloned the repository:

```bash
git clone https://github.com/mata-elang-stable/example-docker-deployment.git
cd example-docker-deployment
```

## Step 1: Configure `config.toml`

The certificate generator reads a TOML configuration file. Start by copying the provided example:

```bash
cp config.example.toml config.toml
```

🔑 The default `config.toml` looks like this:

```toml
# Certificate Authority settings
[ca]
common_name = "mataelang-ca"
organization = "MATAELANG"
country = "ID"
state = "EastJava"
locality = "Surabaya"
days_valid = 3650        # ~10 years
key_size = 4096

# Shared password for all keystores/keys
[ssl]
password = "SecurePassword@123"

# Output directory
[output]
directory = "./ssl_certs"

# Client certificates (one [[clients]] block per service)
[[clients]]
name = "broker"
dns = ["broker", "localhost"]
ip = ["127.0.0.1"]
keystore_type = "pkcs12"
keystore_filename = "kafka.broker.keystore.pkcs12"

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

# OpenSearch node certificate
[opensearch]
node_name = "opensearch-node1"
dns = ["opensearch-node1", "localhost"]
ip = ["127.0.0.1"]
```

### Configuration Sections Explained

| Section | Purpose |
| --- | --- |
| `[ca]` | Root Certificate Authority — signs all other certificates. RSA 4096-bit, 10-year validity. |
| `[ssl]` | **Single password** used for every keystore, private key, and truststore. |
| `[output]` | Directory where all generated certificates and keystores are written. |
| `[[clients]]` | One block per service. Defines the Common Name (CN), DNS Subject Alternative Names (SANs), IP SANs, and keystore format (PKCS12 or JKS). |
| `[opensearch]` | OpenSearch node certificate settings. Uses raw PEM files (not JKS/PKCS12). |

### Important Notes

- ✅ For a quick start, **you only need to change the password**. Everything else works with the defaults.
- ⚠️ **Critical:** The `ssl.password` value must match `SSL_PASSWORD` in `defense_center/.env`. If they differ, services will fail to decrypt their keystores at startup.

## Step 2: Generate Certificates

Run the generator from the repository root:

```bash
./generate.sh
```

🔑 The script will display a progress log and a summary table:

```text
╔══════════════════════════════════════════════════════════════╗
║                      Generation Summary                      ║
╚══════════════════════════════════════════════════════════════╝

  Generated: 8
  Skipped (valid): 0
```

- **Generated:** The number of new certificates created.
- **Skipped (valid):** Certificates that already exist and have more than 60 days of remaining validity.

### Options

| Option | Description |
| --- | --- |
| `-h, --help` | Show help message |
| `-c, --config FILE` | Specify a custom config file (default: `config.toml`) |
| `-o, --output DIR` | Override output directory (overrides `[output]` in config) |
| `--force` | Regenerate all certificates, ignoring idempotency checks |

**Examples:**

```bash
# Use a custom config file
./generate.sh --config my-cluster.toml

# Regenerate everything from scratch
./generate.sh --force

# Output certificates to a specific directory
./generate.sh --output /opt/mataelang/certs
```

The script is **idempotent** — it skips certificates that are still valid (>60 days remaining). Use `--force` to regenerate everything.

## Step 3: Verify Certificates

Use the `validate.sh` script to verify the generated certificates:

```bash
# Validate the CA certificate
./validate.sh ssl_certs/ca/ca.crt
```

```bash
# Validate all certificates in the output directory
./validate.sh --all --dir ./ssl_certs
```

### Validation Options

| Option | Description |
| --- | --- |
| `-h, --help` | Show help message |
| `-f, --full` | Show full certificate details |
| `-q, --quiet` | Machine-readable output (PASS/FAIL only) |
| `-a, --all` | Validate all certificates in the specified directory |
| `-d, --dir DIR` | Directory to search for certificates (used with `--all`) |

**Examples:**

```bash
# Quick summary validation
./validate.sh ssl_certs/ca/ca.crt

# Full certificate details
./validate.sh --full ssl_certs/ca/ca.crt

# Machine-readable pass/fail
./validate.sh --quiet ssl_certs/ca/ca.crt

# Validate every certificate in the output tree
./validate.sh --all
```

## Output Structure

After a successful run, the `ssl_certs/` directory contains the following:

```text
ssl_certs/
├── ca/
│   ├── ca.key                   # CA private key (RSA 4096-bit)
│   └── ca.crt                   # CA certificate (PEM, 10-year validity)
├── truststore/
│   ├── truststore.jks           # Java truststore containing the CA cert
│   └── truststore_creds         # Truststore password
├── broker/
│   ├── broker.p12               # PKCS12 keystore
│   ├── kafka.broker.keystore.pkcs12  # Custom filename for Kafka broker
│   ├── broker_keystore_creds    # Keystore password
│   └── broker_sslkey_creds      # SSL key password
├── schema-registry/
│   ├── schema-registry.p12      # PKCS12 keystore
│   ├── schema-registry-keystore.jks  # JKS keystore
│   ├── schema-registry_keystore_creds
│   └── schema-registry_sslkey_creds
├── kafka-ui/
│   ├── kafka-ui.p12
│   ├── kafka-ui-keystore.jks    # JKS keystore
│   ├── kafka-ui_keystore_creds
│   └── kafka-ui_sslkey_creds
├── logstash/
│   ├── logstash.p12
│   ├── logstash-keystore.jks    # JKS keystore
│   ├── logstash_keystore_creds
│   └── logstash_sslkey_creds
├── event-stream-aggr/
│   ├── event-stream-aggr.p12
│   ├── event-stream-aggr_keystore_creds
│   └── event-stream-aggr_sslkey_creds
├── sensor-api/
│   ├── sensor-api.p12           # PKCS12 for gRPC server
│   ├── sensor-api.crt           # PEM certificate for gRPC TLS
│   ├── sensor-api.key           # PEM private key
│   ├── sensor-api_keystore_creds
│   └── sensor-api_sslkey_creds
└── opensearch/
    ├── opensearch-node1.pem     # Node certificate (PEM)
    └── opensearch-node1-key.pem # Node private key (PEM)
```

| Directory | Format | Used By |
| --- | --- | --- |
| `ca/` | PEM | Signing all certificates; mounted as trusted CA in every service |
| `truststore/` | JKS | Java-based services validating peer certificates |
| `broker/` | PKCS12 + JKS | Kafka broker SSL configuration |
| `schema-registry/` | JKS | Confluent Schema Registry |
| `kafka-ui/` | JKS | Kafka UI management interface |
| `logstash/` | JKS | Logstash pipeline (reads from Kafka, writes to OpenSearch) |
| `event-stream-aggr/` | PKCS12 | Event stream aggregation service |
| `sensor-api/` | PKCS12 + PEM | gRPC server (sensor-api), serves TLS endpoint |
| `opensearch/` | PEM | OpenSearch node-to-node and HTTP encryption |

## How Certificates Are Used

### Defense Center

The Defense Center's `compose.yml` (in `defense_center/`) mounts certificates from `../ssl_certs/` for every service:

- **sensor-api**: mounts `sensor-api.p12`, `sensor-api.crt`, `sensor-api.key` for gRPC TLS
- **broker**: mounts the entire `broker/` directory for Kafka SSL configuration
- **schema-registry**: mounts `schema-registry-keystore.jks` and `truststore.jks`
- **kafka-ui**: mounts `kafka-ui.p12` and `truststore.jks`
- **event-stream-aggr**: mounts `event-stream-aggr.p12` and `ca.pem`
- **opensearch-node1**: mounts `opensearch-node1.pem`, `opensearch-node1-key.pem`, and `ca.crt` as `root-ca.pem`
- **logstash**: mounts `logstash-keystore.jks`, `truststore.jks`, and `ca.crt`

### Sensor

The sensor's `compose.yml` (in `sensor_snort/`) only needs the CA certificate to verify the gRPC server:

```yaml
volumes:
  - ../ssl_certs/ca/ca.crt:/secrets/ca.crt:ro
```

This is automatically configured — no manual certificate setup is required on the sensor.

### Password Consistency

⚠️ **The `ssl.password` in `config.toml` MUST match `SSL_PASSWORD` in `defense_center/.env`.** If these values differ, the services will fail to open their keystores at startup.

## Troubleshooting

### `keytool: command not found`

Install the missing package:

```bash
sudo apt install default-jre-headless
```

### Certificate expired

Certificates are checked for validity. If any certificate has 60 or fewer days remaining, it is automatically regenerated. To force regeneration of all certificates:

```bash
./generate.sh --force
```

### Password mismatch

If services fail to start with keystore-related errors, verify that the password is consistent:

1. Check `ssl.password` in `config.toml`
2. Check `SSL_PASSWORD` in `defense_center/.env`
3. Ensure they are **identical**

If they differ, update one to match the other, then regenerate certificates with `./generate.sh --force`.

### Permission denied on `ssl_certs/`

The generated files are readable by the owner by default. If needed, adjust permissions so Docker can read them:

```bash
chmod -R 755 ssl_certs/
```
