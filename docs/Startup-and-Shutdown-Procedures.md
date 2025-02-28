---
title: Startup and Shutdown Procedures
---

# Startup and Shutdown Procedures

Use this command to start the Mata Elang system.

## Starting The Docker Engine

▶️ Open your terminal.
▶️ Turn on the **Docker Engine**.

```bash
sudo systemctl start docker
```

▶️ Check if **Docker Engine** already started using this command:

```bash
systemctl status docker
```

▶️ If you already see **docker.service** marked as enabled, that means the **Docker Engine** already running. You can continue to turn on the defense center.


## Starting The Defense Center

▶️ Make sure **Docker Engine** has already running in background process.
▶️ Open your terminal on your **defense center's** directory and run this command:

```bash
cd docs/defense_center
docker compose -f compose.yml -f compose-dashboard.yml up -d
```

▶️ Check whether defense center services already running or not.

```bash
docker compose -f compose.yml -f compose-dashboard.yml ps -a
```

## Starting The Sensors

▶️ Make sure **docker.service** and **docker.socket** has already running in background process.
▶️ Open your terminal on your **sensor's** directory and run this command:

```bash
cd docs/sensor_snort
docker compose -f compose.yml up -d
```
▶️ Check if sensor services already running.

```bash
docker compose -f compose.yml ps -a
```


## Sensor Shutdown

▶️ Open your terminal on your **sensor's** directory and run this command:

```bash
docker compose -f compose.yml down
```

▶️ Check if sensor's services already stopped. You should see there are no more sensor's service listed.

```bash
docker compose -f compose.yml ps -a
```

## Defense Center Shutdown

▶️ Open your terminal on your **defense_center's** directory and run this command:

```bash
docker compose -f compose.yml -f compose-dashboard.yml down
```

▶️ Check if defense sensor's services already stopped. You should see there are no more defense center's service listed.

```bash
docker compose -f compose.yml -f compose-dashboard.yml ps -a
```