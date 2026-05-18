---
title: Mata Elang Sensor
sidebar_position: 2
---

## Prerequisite

✅ Ubuntu 24.04 LTS installed and updated with the following command.

```bash
sudo apt update && sudo apt -y upgrade
```

✅ Docker 27.3 or later installed with the following command.

:key: You can follow this guideline for installing Docker on your PC, with comprehensive instruction for each Linux's Distribution
[Docker Official Documentation](https://docs.docker.com/engine/install/).

:warning: **NOTE:** You can check Docker version on your host using this command:

```bash
docker -v
```

## Generating TLS Certificates

The sensor communicates with the Defense Center over **mutual TLS (mTLS)**. Before installing the sensor, you must generate the CA certificate that the sensor uses to verify the gRPC server.

🔑 **If you are deploying the Defense Center on the same machine**, follow the complete guide at [Certificate Generation](./Certificate-Generation.md) to generate all required certificates.

🔑 **If the sensor is on a separate machine**, generate certificates on the Defense Center host first, then copy the CA certificate to the sensor host:

```bash
# On the Defense Center host
cd example-docker-deployment
cp config.example.toml config.toml
# Edit config.toml: change ssl.password to a secure password
nano config.toml
./generate.sh

# Copy CA cert to sensor host
scp ssl_certs/ca/ca.crt user@sensor-host:/path/to/example-docker-deployment/ssl_certs/ca/ca.crt
```

> ⚠️ **Important:** The `ca.crt` file must exist at `ssl_certs/ca/ca.crt` relative to the repository root before starting the sensor.

## Configurating and Installing Sensor

### Downloading Installation Media

▶️ Clone [Mata Elang v2.1 Sensor](https://github.com/mata-elang-stable/example-docker-deployment.git) from GitHub to your defense center machine.

⚠️ You can skip this step if you already set your defense center.

```bash
git clone https://github.com/mata-elang-stable/example-docker-deployment.git
```

▶️ Find **sensor_snort** folder, and check for its contained files.

```bash
cd example-docker-deployment/sensor_snort/ && tree --dirsfirst -L 1 -a
```

🔑 You shall expect this result

```bash
$ tree --dirsfirst -L 1 -a
.
├── rules/
├── compose.yml
├── custom.rules
├── .env.example
├── .gitignore
└── readme.md
```

### Configuring Enviroment

▶️ Create an **.env** file by copying **.env.example**

```bash
cp .env.example .env
```

You will have a new file titled **.env**.

▶️ Edit the **.env** using `nano` to connect it to your defense center. You have to set `NETWORK_INTERFACE` and **Mata Elang : Sensor Parser** section.

```bash
nano .env
```

#### 🔑 .env's default variable values

```bash
###############################
# Mata Elang: Sensor Snort
###############################

# Network interface to listen on
NETWORK_INTERFACE=eth0

###############################
# Mata Elang: Sensor Parser
###############################

# IP address of the Mata Elang Defense System (MES) server
MES_CLIENT_SERVER=172.17.0.1

# Port of the MES server
MES_CLIENT_PORT=50051

# Unique ID of the sensor in the MES server
MES_CLIENT_SENSOR_ID=sensor1

# Path to Snort alert JSON file
MES_CLIENT_FILE=/var/log/snort/alert_json.txt

# Interval between batch sends to gRPC server
MES_CLIENT_INTERVAL=1s

# -- gRPC TLS --
MES_CLIENT_SECURE=true
MES_CLIENT_CERTIFICATE=/secrets/ca.crt
MES_CLIENT_SERVER_NAME=sensor-api
```

🔑 Set `MES_CLIENT_SENSOR_ID` to a unique name for this sensor (e.g., `sensor-office-1`, `sensor-dc-1`). This ID appears in the OpenSearch Dashboards to identify which sensor generated each alert.

> 📖 For the complete list of configuration options, see [Sensor Configuration](../Configurations/Sensor-Configuration.md).

:warning: **NOTE:** You may change the values to meet your needs. :warning:

### Installing Sensor

▶️ After your **.env** file is set, you can pull **compose.yml** image using this command.

```bash
docker compose pull
```

▶️ After pulling process is done, you can start the services by following this command.

```bash
docker compose up -d
```

▶️ Check the container whether its already running or not.

```bash
docker compose ps -a
```

🔑 You shall expect this kind of result.

```bash
NAME                          IMAGE                                                       COMMAND                  SERVICE        CREATED         STATUS                                  PORTS
sensor_snort-snort-1          ghcr.io/mata-elang-stable/snort3-docker-image:v2.1-debian   "/usr/local/bin/star…"   snort          3 seconds ago   Up 2 seconds
sensor_snort-snort-parser-1   ghcr.io/mata-elang-stable/sensor-snort-service:latest       "/go/bin/app client …"   snort-parser   3 seconds ago   Up 2 seconds
```
