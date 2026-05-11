---
title: Defense Center Configuration Reference
sidebar_position: 2
---
 
This page documents all available environment variables for the Mata Elang Defense Center.
 
## Sensor API Configuration
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `MES_SERVER_HOST` | Bind address for the gRPC server | IP address or `0.0.0.0` | `0.0.0.0` |
| `MES_SERVER_PORT` | gRPC server listening port | Port number | `50051` |
| `MES_SERVER_KAFKA_BROKERS` | Kafka broker address (internal Docker network) | `host:port` | `broker:19094` |
| `MES_SERVER_KAFKA_TOPIC` | Kafka topic to publish incoming sensor events | Topic name string | `sensor_events` |
| `MES_SERVER_SCHEMA_REGISTRY_URL` | URL of the Confluent Schema Registry | HTTPS URL | `https://schema-registry:8081` |
| `MES_SERVER_SECURITY_PROTOCOL` | Kafka security protocol | `SSL`, `PLAINTEXT` | `SSL` |
| `MES_SERVER_MAX_MESSAGE_SIZE` | Maximum accepted gRPC message size in MB | Integer (MB) | `1024` |
 
## gRPC / TLS Configuration
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `MES_SERVER_SECURE` | Enable TLS on the gRPC server | `true`, `false` | `true` |
| `MES_SERVER_CERTIFICATE` | Path to server TLS certificate (inside container) | Absolute path | `/app/server.crt` |
| `MES_SERVER_KEY` | Path to server TLS private key (inside container) | Absolute path | `/app/server.key` |
 
## Kafka mTLS Configuration
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `MES_SERVER_PATH_TO_CA` | Path to CA certificate for Kafka broker verification | Absolute path | `/app/ca.pem` |
| `MES_SERVER_PATH_TO_CLIENT_KEYSTORE` | Path to PKCS12 client keystore for Kafka mTLS | Absolute path | `/app/sensor-client.p12` |
| `MES_SERVER_CLIENT_KEYSTORE_PASSWORD` | Password for the PKCS12 client keystore | String | (none — required) |
 
:::warning[Important]
`MES_SERVER_CLIENT_KEYSTORE_PASSWORD` must match `SSL_PASSWORD` and the `ssl.password` value in `config.toml` on each sensor. A mismatch will cause the sensor-api to fail connecting to the Kafka broker.
:::
 
## OpenSearch Configuration
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `OPENSEARCH_INITIAL_ADMIN_PASSWORD` | Initial admin password for the OpenSearch cluster | String (min. 8 chars: uppercase, lowercase, digit, special char) | (none — required) |
 
:::tip[Note]
OpenSearch enforces password complexity at startup. A weak password will prevent the `opensearch-node1` container from starting. Use a pattern such as `MyStr0ng!Pass`.
:::
 
## SSL / Keystore Configuration
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `SSL_PASSWORD` | Shared password for all Kafka JKS/PKCS12 keystores and truststores | String | (none — required) |
 
:::warning[Important]
`SSL_PASSWORD` must be identical to `MES_SERVER_CLIENT_KEYSTORE_PASSWORD` and the `ssl.password` field in each sensor's `config.toml`. All three values are set during the Certificate Generation step and must remain in sync.
:::
 
## File Ownership Configuration
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `HOST_UID` | Host user UID mapped into containers for volume permission management | Integer | `1000` |
| `HOST_GID` | Host user GID mapped into containers for volume permission management | Integer | `1000` |
 
:::tip[Note]
Run `id -u && id -g` on the Defense Center host to get the correct values for your user. Mismatched UID/GID can cause permission errors on mounted volumes (certificates, OpenSearch data, etc.).
:::
 
## OpenCTI Integration (Optional Add-on)
 
| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `OPENCTI_URL` | Base URL of the OpenCTI instance | HTTP/HTTPS URL | (none — optional) |
| `OPENCTI_API_KEY` | API token for authenticating to OpenCTI | UUID string | (none — optional) |
 
:::tip[Note]
These variables are only required when deploying the OpenCTI Integration Add-on via `compose.opencti-connector.yml`. Leave them commented out if you are not using OpenCTI.
:::
 
## Complete Example
 
```bash
# ─── Sensor API (gRPC Server) ─────────────────────────────────────────
MES_SERVER_HOST=0.0.0.0
MES_SERVER_PORT=50051
MES_SERVER_KAFKA_BROKERS=broker:19094
MES_SERVER_KAFKA_TOPIC=sensor_events
MES_SERVER_SCHEMA_REGISTRY_URL=https://schema-registry:8081
MES_SERVER_SECURITY_PROTOCOL=SSL
MES_SERVER_MAX_MESSAGE_SIZE=1024
 
# ─── gRPC Server TLS ──────────────────────────────────────────────────
MES_SERVER_SECURE=true
MES_SERVER_CERTIFICATE=/app/server.crt
MES_SERVER_KEY=/app/server.key
 
# ─── Kafka mTLS (client certificate) ─────────────────────────────────
MES_SERVER_PATH_TO_CA=/app/ca.pem
MES_SERVER_PATH_TO_CLIENT_KEYSTORE=/app/sensor-client.p12
MES_SERVER_CLIENT_KEYSTORE_PASSWORD=SecurePassword@123
 
# ─── OpenSearch ────────────────────────────────────────────────────────
# Minimum 8 characters: uppercase, lowercase, digit, and special character
OPENSEARCH_INITIAL_ADMIN_PASSWORD=SecurePassword@123
 
# ─── SSL / Kafka Keystores ────────────────────────────────────────────
# Must match MES_SERVER_CLIENT_KEYSTORE_PASSWORD and ssl.password in config.toml
SSL_PASSWORD=SecurePassword@123
 
# ─── File Ownership ───────────────────────────────────────────────────
# Run: id -u && id -g  to get your host user values
HOST_UID=1000
HOST_GID=1000
 
# ─── Add-on: OpenCTI (optional) ──────────────────────────────────────
# OPENCTI_URL=http://your-opencti-host:8080
# OPENCTI_API_KEY=your-opencti-api-token
```