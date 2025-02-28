---
title: Mata Elang Sensor
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

▶️ Clone [Mata Elang v2 Sensor](https://gitlab.com/mata-elang/v2/docs.git) from GitHub to your defense center machine.

⚠️ You can skip this step if you already set your defense center.

```
git clone https://gitlab.com/mata-elang/v2/docs.git
```

▶️ Find **sensor_snort** folder, and check for its contained files.

```bash
cd docs/sensor_snort/
la
```

🔑 You shall expect this result

```bash
compose.yml  .env.example  .gitignore  local.rules  rules
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

##### 🔑 .env's default variable values:

```
NETWORK_INTERFACE=eth0
...
MES_CLIENT_FILE=/var/log/snort/alert_json.txt
MES_CLIENT_SERVER=172.17.0.1
MES_CLIENT_PORT=50051
MES_CLIENT_INSECURE="true"
MES_CLIENT_SENSOR_ID=sensor-1
```
:warning: **NOTE:** You may change the values to meet your needs. :warning:

### Installing Sensor

▶️ After your **.env** file is set, you can pull **compose.yml** image using this command.

```bash
docker compose -f compose.yml pull
```

▶️ After pulling process is done, you can start the services by following this command.

```bash
docker compose -f compose.yml up -d
```

▶️ Check the container whether its already running or not.

```bash
docker compose -f compose.yml ps -a
```

🔑 You shall expect this kind of result.

```
NAME                          IMAGE                                                       COMMAND                  SERVICE        CREATED         STATUS                                  PORTS
sensor_snort-snort-1          ghcr.io/mata-elang-stable/snort3-docker-image:v2.0-debian   "/usr/local/bin/star…"   snort          3 seconds ago   Up 2 seconds
sensor_snort-snort-parser-1   ghcr.io/mata-elang-stable/sensor-snort-service:latest       "/go/bin/app client …"   snort-parser   3 seconds ago   Up 2 seconds
```
