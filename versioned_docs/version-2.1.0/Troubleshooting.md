---
title: Troubleshooting
sidebar_position: 7
---

## Sensor

### "Cannot parse event log" in snort-parser

```log
sensor-snort-parser-1  | 2023/01/27 06:05:16 ERROR - Cannot parse event log
```

This means the snort-parser cannot read the Snort alert JSON file. Verify the volume mount and that `MES_CLIENT_FILE` in `.env` matches the path where Snort writes alerts.

### Sensor not sending events to Defense Center

1. Confirm the Defense Center's `sensor-api` is reachable on port 50051 from the sensor host.
2. Verify `MES_CLIENT_SERVER` in `sensor_snort/.env` points to the correct IP.
3. Check that the CA certificate exists at `ssl_certs/ca/ca.crt` on the sensor host.
4. View sensor logs:

```bash
cd sensor_snort
docker compose logs -f snort-parser
```

## Defense Center

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

Kafka uses mTLS — verify the JKS truststore and keystore files exist and that `SSL_PASSWORD` in `.env` matches the password used during certificate generation:

```bash
ls -la ssl_certs/truststore/
ls -la ssl_certs/logstash/
docker compose logs opensearch-logstash
```

### Certificates not found at startup

Ensure `./generate.sh` completed successfully and `ssl_certs/` is fully populated before running `docker compose up -d`.

### Regenerate expired or incorrect certificates

```bash
./generate.sh --force
cd defense_center && docker compose restart
cd ../sensor_snort && docker compose restart
```
