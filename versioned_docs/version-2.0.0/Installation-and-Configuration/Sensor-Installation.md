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

## Configurating and Installing Sensor

### Downloading Installation Media

▶️ Clone [Mata Elang v2 Sensor](https://github.com/mata-elang-stable/example-docker-deployment.git) from GitHub to your defense center machine.

⚠️ You can skip this step if you already set your defense center.

```
git clone https://github.com/mata-elang-stable/example-docker-deployment.git
```

▶️ Find **sensor_snort** folder, and check for its contained files.

```bash
cd example-docker-deployment/sensor_snort/ && tree --dirsfirst -L 1
```

🔑 You shall expect this result

```bash
.
├── rules
├── compose.yml
├── custom.rules
└── readme.md

2 directories, 3 files
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

#### 🔑 .env's default variable values:

```bash
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
# Possible values: true, false
# default: false
#SNORT_BLOCKLIST=false
#ET_BLOCKLIST=false

# Uncomment this if you need to use blocklist
# URLs to download blocklist from (comma separated)
# default:
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
sensor_snort-snort-1          ghcr.io/mata-elang-stable/snort3-docker-image:v2.0-debian   "/usr/local/bin/star…"   snort          3 seconds ago   Up 2 seconds
sensor_snort-snort-parser-1   ghcr.io/mata-elang-stable/sensor-snort-service:latest       "/go/bin/app client …"   snort-parser   3 seconds ago   Up 2 seconds
```
