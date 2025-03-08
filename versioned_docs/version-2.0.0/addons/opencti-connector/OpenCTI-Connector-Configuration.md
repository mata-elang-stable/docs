---
title: Installation and Configuration
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
cd example-docker-deployment/defense_center
la
```

▶️ See where the directory of **defense_center** It should be set to **.env.example**.

:key: You should see this result

```bash
.env.example
```

### opencti-connector

:key: default value for **.env.example**

```bash
# OPENCTI_URL is the URL of the OpenCTI instance.
OPENCTI_URL=http://opencti:8080

# OPENCTI_API is the API key used to authenticate the Defense Center with OpenCTI.
OPENCTI_API_KEY=
```

You may change each variable's value to connect to defence center.

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
