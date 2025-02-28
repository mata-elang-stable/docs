---
title: Mata Elang Defense Center
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


## Configurating and Installing Defense Center

### Download Installation Media

▶️ Clone [Mata Elang v2 Defense Center](https://gitlab.com/mata-elang/v2/docs.git) from GitHub to your defense center machine.

```bash
git clone https://gitlab.com/mata-elang/v2/docs.git
```


### Download GeoLite2 database

- [GeoLite2 City and ASN Database](https://dev.maxmind.com/geoip/geoip2/geolite2/) in mmdb format.


##### Preparation
**Place GeoLite2 Databases**: Place the GeoLite2 City and ASN databases in the `geoip` directory.
```bash
cp /path/to/GeoLite2-City.mmdb files/GeoLite2-City.mmdb
cp /path/to/GeoLite2-ASN.mmdb files/GeoLite2-ASN.mmdb
```

> **Note:**
> The filename for the GeoLite2 City and ASN databases should be `GeoLite2-City.mmdb` and `GeoLite2-ASN.mmdb` respectively.
> Otherwise, you need to update the [compose.reporting.yml in line 42-43](compose.reporting.yml#L42-L43).


▶️ Find **defense_center** folder, and check for its contained files.

```bash
cd docs/defense_center/
la
```

🔑 You shall expect this result

```bash
compose.dashboard.yml  compose.yml  conf  .env.example  files  .gitignore  scripts  templates
```

### Enviroment Configuration

▶️ Create a **.env** file by copying **.env.example**

```bash
cp .env.example .env
```

You will have a new file titled **.env**.

▶️ Edit the **.env** using `nano` if you want to customize your defense center's credential, or changing Postgress database's table name.

```bash
nano .env
```

##### 🔑 .env's default variable values:

```bash
POSTGRES_DB=mataelang
POSTGRES_USER=mataelang
POSTGRES_PASSWORD=mataelang@123

OPENSEARCH_INITIAL_ADMIN_PASSWORD=Mataelang@123

OPENCTI_URL=
OPENCTI_API_KEY=
```

:warning: **NOTE:** You may change those variable value to meet your need. :warning:

▶️ After your **.env** file, you can pull **compose.yml** image using this command.

```bash
docker compose -f compose.yml -f compose.dashboard.yml pull
```

### Installing Defense Center

▶️ After pulling process is done, you can start the services by running both of those compose file simultaneously.

```bash
docker compose -f compose.yml -f compose.dashboard.yml up -d
```

▶️ Check the container whether its already running or not.

```bash
docker compose -f compose.yml -f compose.dashboard.yml ps -a
```

🔑 You shall expect this kind of result.

```bash
NAME                                 IMAGE                                                                COMMAND                  SERVICE                  CREATED          STATUS                        PORTS
mataelang-broker-1                   confluentinc/cp-kafka:7.8.0                                          "/etc/confluent/dock…"   broker                   11 seconds ago   Up 10 seconds                 9092/tcp
mataelang-kafka-ui-1                 provectuslabs/kafka-ui:latest                                        "/bin/sh -c 'java --…"   kafka-ui                 11 seconds ago   Up 10 seconds                 0.0.0.0:9021->8080/tcp, [::]:9021->8080/tcp
mataelang-opensearch-dashboards-1    opensearchproject/opensearch-dashboards:2                            "./opensearch-dashbo…"   opensearch-dashboards    11 seconds ago   Up 10 seconds                 0.0.0.0:5601->5601/tcp, :::5601->5601/tcp
mataelang-opensearch-init-1          curlimages/curl:8.10.1                                               "/entrypoint.sh /bin…"   opensearch-init          11 seconds ago   Up 10 seconds
mataelang-opensearch-logstash-1      opensearchproject/logstash-oss-with-opensearch-output-plugin:8.9.0   "/usr/local/bin/dock…"   opensearch-logstash      11 seconds ago   Up 9 seconds                  5044/tcp, 9600/tcp
mataelang-opensearch-logstash-2      opensearchproject/logstash-oss-with-opensearch-output-plugin:8.9.0   "/usr/local/bin/dock…"   opensearch-logstash      11 seconds ago   Up 9 seconds                  5044/tcp, 9600/tcp
mataelang-opensearch-node1-1         opensearchproject/opensearch:2                                       "./opensearch-docker…"   opensearch-node1         11 seconds ago   Up 10 seconds                 9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp
mataelang-schema-registry-1          confluentinc/cp-schema-registry:7.8.0                                "/etc/confluent/dock…"   schema-registry          11 seconds ago   Up 10 seconds                 0.0.0.0:8081->8081/tcp, :::8081->8081/tcp
mataelang-sensor-api-1               ghcr.io/mata-elang-stable/sensor-snort-service:latest                "/go/bin/app server …"   sensor-api               11 seconds ago   Up 10 seconds                 0.0.0.0:50051->50051/tcp, :::50051->50051/tcp
mataelang-sensor-event-stream-op-1   ghcr.io/mata-elang-stable/event-stream-aggr:latest                   "/go/bin/app -v"         sensor-event-stream-op   11 seconds ago   Up 10 seconds
```
