---
title: Sensor Configuration Reference
sidebar_position: 1
---

This page documents all available environment variables for the Mata Elang Sensor.

## Snort Configuration

| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `NETWORK_INTERFACE` | Network interface to listen on for packet capture | Interface name (e.g., `eth0`) | `eth0` |
| `SNORT_OINKCODE` | OINKCODE required to download rules from snort.org | Alphanumeric string | (none — required for registered/lightspd rulesets) |
| `SNORT_COMPRESSED_RULES_FILE_PATH` | Path to compressed rules file (`.tar.gz`) inside the container | Absolute path (e.g., `/tmp/rules/filename.tar.gz`) | (none) |
| `RULESET` | Ruleset source to use | `community`, `registered`, `lightspd` | `community` |
| `SNORT_BLOCKLIST` | Enable blocklist | `true`, `false` | `false` |
| `ET_BLOCKLIST` | Enable Emerging Threats blocklist | `true`, `false` | `false` |
| `BLOCKLIST_URLS` | URLs to download blocklists from (comma-separated) | URL string | (none) |
| `IPS_POLICY` | IPS policy/rule set to use | `connectivity`, `balanced`, `security`, `max-detect`, `none` | `balanced` |

:::tip[Note]
`SNORT_OINKCODE` is only required if using `registered` or `lightspd` rulesets. Register at https://www.snort.org/users/sign_up to get a free OINKCODE.
:::

## Parser Configuration

| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `MES_CLIENT_SERVER` | IP address of the Mata Elang Defense Center (sensor-api) | IP address | `172.17.0.1` |
| `MES_CLIENT_PORT` | gRPC port of the Defense Center | Port number | `50051` |
| `MES_CLIENT_SENSOR_ID` | Unique identifier for this sensor | String | `sensor1` |
| `MES_CLIENT_FILE` | Path to the Snort alert JSON file | Absolute path | `/var/log/snort/alert_json.txt` |
| `MES_CLIENT_INTERVAL` | Interval between batch sends to gRPC server | Duration string | `1s` |
| `MES_CLIENT_MAX_CLIENTS` | Maximum concurrent gRPC stream clients | Integer | `10` |
| `MES_CLIENT_MAX_MESSAGE_SIZE` | Maximum gRPC message size in MB | Integer (MB) | `100` |

:::tip[Note]
Set `MES_CLIENT_SENSOR_ID` to a unique name for each sensor (e.g., `sensor-office-1`, `sensor-dc-1`). This ID appears in OpenSearch Dashboards to identify which sensor generated each alert.
:::

## gRPC / TLS Configuration

| Variable | Description | Possible Values | Default |
|----------|-------------|-----------------|---------|
| `MES_CLIENT_SECURE` | Enable TLS for gRPC client connection | `true`, `false` | `true` |
| `MES_CLIENT_CERTIFICATE` | Path to CA certificate for server verification | Absolute path | `/secrets/ca.crt` |
| `MES_CLIENT_SERVER_NAME` | Server name for TLS hostname verification (must match CN/SAN in server cert) | String | `sensor-api` |
| `MES_CLIENT_VERBOSE` | Log verbosity level | `0` (off), `1` (debug), `2+` (trace) | `0` |

## Complete Example

```bash
###############################
# Mata Elang: Sensor Snort
###############################

NETWORK_INTERFACE=eth0

# Uncomment to download rules from snort.org
#SNORT_OINKCODE=your-oinkcode-here
#RULESET=registered

# Uncomment to use blocklist
#SNORT_BLOCKLIST=true
#BLOCKLIST_URLS=https://some-blocklist-url.com/blocklist.txt

IPS_POLICY=balanced

###############################
# Mata Elang: Sensor Parser
###############################

MES_CLIENT_SERVER=172.17.0.1
MES_CLIENT_PORT=50051
MES_CLIENT_SENSOR_ID=sensor-office-1
MES_CLIENT_FILE=/var/log/snort/alert_json.txt
MES_CLIENT_INTERVAL=1s
MES_CLIENT_MAX_CLIENTS=10
MES_CLIENT_MAX_MESSAGE_SIZE=100

# -- gRPC TLS --
MES_CLIENT_SECURE=true
MES_CLIENT_CERTIFICATE=/secrets/ca.crt
MES_CLIENT_SERVER_NAME=sensor-api
```
