---
title: OpenCTI Connector
sidebar_position: 2
---

You can install OpenCTI to integrate with Mata Elang by following this official documentation from [OpenCTI Integrations Official Documentation](https://github.com/mata-elang-stable/opencti-connector)

## Prerequisite

:white_check_mark: Defense Center installed.

[Defense Center Installation](../../Installation-and-Configuration/Defense-Center-Installation.md).

:white_check_mark: OpenCTI installed.

[OpenCTI Installation](https://docs.opencti.io/latest/deployment/installation/).


## OpenCTI Connector Configuration

▶️ Find **compose.opencti-connector.yml** inside defense center folder.

```bash
cd docs/defense_center
la
```

▶️ See where the default directory of **parser's .env** and **aggregator's .env.** It should be set to **conf** folder.

▶️ Open **conf** folder and find for OpenCTI **parser's .env** and OpenCTI **aggregator's .env.**

```bash
cd conf
la opencti*
```

:key: You should see this result

```bash
opencti-connector-aggr.env  opencti-connector-parser.env
```

### opencti-connector-aggr

:key: default value for **opencti-connector-aggr.env**

```bash
KAFKA_URL=broker:29092
KAFKA_CONSUMER_GROUP_ID=opencti-aggr
KAFKA_TOPIC=sensor_events
```

You may change each variable's value to connect to defence center.

### opencti-connector-parser

:key: default value for **opencti-connector-parser.env**

```bash
OPENCTI_URL=http://opencti:8080
OPENCTI_API_KEY=c5512621-e446-4ae8-bcab-cbd400ea9ea0
KAFKA_URL=broker:29092
KAFKA_CONSUMER_GROUP_ID=opencti-parser
KAFKA_TOPIC=opencti_events
```

You may change each variable's value to connect to defense center.

> :key:  **NOTE:** To get your API key, go to your Profile > API access. Refer to the [OpenCTI Integrations Authentication documentation](https://docs.opencti.io/latest/deployment/integrations/#authentication)

▶️ Go back to **defense center** folder and pull **opencti connector** image by typing this command:

```bash
docker compose -f compose.opencti-connector.yml pull
```

Wait until pull process finish.

▶️ Start **OpenCTI Connector**  service with this command:

```bash
docker compose -f compose.opencti-connector.yml up -d
```

▶️ Check the container whether its already running or not.

```bash
docker compose -f compose.opencti-connector.yml ps -a
```

:key: You shall expect this kind of result.

```bash
CONTAINER ID   IMAGE                   COMMAND                  CREATED       STATUS          PORTS   NAMES
0857966e66a1   mfscy/snort3-parser:2   "/go/bin/app client …"   2 weeks ago   Up 14 minutes           me2-deploy-sensor-parser-1
```
