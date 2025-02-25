---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start Guide

This guide will help you to get started with Mata Elang. Mata Elang is a network security platform that provides network intrusion detection system (NIDS) capabilities. It is designed to help you monitor and protect your network from malicious activities.

See the [Introduction](/docs/intro.md) for more information.

## Defense Center - Hardware Requirements

In the latest version of Mata Elang, there are huge improvements in terms of performance and scalability. The hardware requirements for the new version change significantly. The following table shows the minimum and recommended hardware requirements for the new version of Mata Elang.

| Component | Minimum | Recommended |
| --- | --- | --- |
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Storage | 100 GB | 200 GB |
| Network | 1 Gbps | 1 Gbps |

### Sensor - Hardware Requirements

Mata Elang Sensor use Snort as the network intrusion detection system (NIDS). The sensor is deployed in the network to monitor the traffic and detect any malicious activities.

:::tip[Note]

The host machine must have at least **2 network interfaces**. One interface is used for management, and the other interface is used for monitoring.
The monitoring interface must be in [**promiscuous mode**](https://www.blumira.com/glossary/promiscuous-mode).

:::

| Component | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| Storage | 50 GB | 120 GB |
| Network | 1 Gbps | 1 Gbps |

## Software Requirements

Mata Elang Platform requires the following software to be installed on your system:

- [Docker](https://docs.docker.com/get-docker/)

:::tip[Docker Installation Best Practice]
For the best practice, please refer to the [Docker Official Documentation](https://docs.docker.com/engine/install/).
Using the official Docker repository is recommended to get the latest version and security updates.
:::

## Installation & Configuration

### Installing Mata Elang Defense Center

<Tabs
  className="unique-tabs"
  defaultValue="manual"
  groupId="installation-method"
  >
  <TabItem value="docker-compose" label="Docker Compose">
    
1. Create a `docker-compose.yml` file with the following content. You don't need to change anything in the file.

   ```yaml title="compose.yml" showLineNumbers
   volumes:
     kafka_data:
     opensearch_data1:

   services:
     sensor-api:
       image: ghcr.io/mata-elang-stable/sensor-snort-service:latest
       command: "server -v"
       restart: unless-stopped
       depends_on:
         - broker
         - schema-registry
       ports:
         - "50051:50051"
       environment:
         - MES_SERVER_HOST=0.0.0.0
         - MES_SERVER_PORT=50051
         - MES_SERVER_INSECURE="true"
         - MES_SERVER_MAX_MESSAGE_SIZE=1024
         - MES_SERVER_KAFKA_BROKERS=broker:29092
         - MES_SERVER_SCHEMA_REGISTRY_URL=http://schema-registry:8081
         - MES_SERVER_KAFKA_GROUP_ID=sensor-api
         - MES_SERVER_KAFKA_TOPIC=sensor_events
       deploy:
         resources:
           limits:
             cpus: "2.0"
             memory: 512M

     broker:
       image: confluentinc/cp-kafka:7.8.0
       restart: unless-stopped
       environment:
         - KAFKA_NODE_ID=1
         - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
         - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://broker:29092,PLAINTEXT_HOST://localhost:9092
         - KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
         - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
         - KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1
         - KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1
         - KAFKA_MESSAGE_MAX_BYTES=1073741824
         - KAFKA_JMX_PORT=9101
         - KAFKA_JMX_HOSTNAME=localhost
         - KAFKA_JMX_OPTS=-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false -Djava.rmi.server.hostname=kafka0 -Dcom.sun.management.jmxremote.rmi.port=9101
         - KAFKA_PROCESS_ROLES="broker,controller"
         - KAFKA_CONTROLLER_QUORUM_VOTERS="1@broker:29093"
         - KAFKA_LISTENERS="PLAINTEXT://broker:29092,CONTROLLER://broker:29093,PLAINTEXT_HOST://0.0.0.0:9092"
         - KAFKA_INTER_BROKER_LISTENER_NAME="PLAINTEXT"
         - KAFKA_CONTROLLER_LISTENER_NAMES="CONTROLLER"
         - KAFKA_LOG_DIRS="/tmp/kraft-combined-logs"
         # Replace CLUSTER_ID with a unique base64 UUID using "bin/kafka-storage.sh random-uuid"
         # See https://docs.confluent.io/kafka/operations-tools/kafka-tools.html#kafka-storage-sh
         - CLUSTER_ID="MkU3OEVBNTcwNTJENDM2Qk"
       volumes:
         - kafka_data:/var/lib/kafka/data

     schema-registry:
       image: confluentinc/cp-schema-registry:7.8.0
       restart: unless-stopped
       depends_on:
         - broker
       ports:
         - "8081:8081"
       environment:
         - SCHEMA_REGISTRY_HOST_NAME=schema-registry
         - SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS=broker:29092
         - SCHEMA_REGISTRY_LISTENERS=http://0.0.0.0:8081

     kafka-ui:
       image: provectuslabs/kafka-ui:latest
       restart: unless-stopped
       depends_on:
         - broker
         - schema-registry
       ports:
         - "9021:8080"
       environment:
         - KAFKA_CLUSTERS_0_NAME=MataElangKafkaCluster
         - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=broker:29092
         - KAFKA_CLUSTERS_0_SCHEMAREGISTRY=http://schema-registry:8081
         - KAFKA_CLUSTERS_0_METRICS_PORT=9101
         - DYNAMIC_CONFIG_ENABLED="true"
       deploy:
         resources:
           limits:
             cpus: "1.0"
             memory: 1G

     event-stream-aggr:
       image: ghcr.io/mata-elang-stable/event-stream-aggr:latest
       restart: unless-stopped
       command: "-v"
       depends_on:
         - broker
         - schema-registry
       environment:
         - KAFKA_BROKERS=broker:29092
         - INPUT_KAFKA_TOPIC=sensor_events
         - OUTPUT_KAFKA_TOPIC=snort_alerts
         - SCHEMA_REGISTRY_URL=http://schema-registry:8081
       deploy:
         resources:
           limits:
             cpus: "2.0"
             memory: 512M

     opensearch-node1:
       image: opensearchproject/opensearch:2
       restart: unless-stopped
       environment:
         - discovery.type=single-node
         - bootstrap.memory_lock="true"
         - OPENSEARCH_JAVA_OPTS="-Xms1g -Xmx1g"
         - node.name=opensearch-node1
         - OPENSEARCH_INITIAL_ADMIN_PASSWORD=${OPENSEARCH_INITIAL_ADMIN_PASSWORD:-SecurePassword@123}
       env_file:
         - .env
       ulimits:
         memlock:
           soft: -1
           hard: -1
         nofile:
           soft: 65536
           hard: 65536
       volumes:
         - opensearch_data1:/usr/share/opensearch/data

     opensearch-dashboards:
       image: opensearchproject/opensearch-dashboards:2
       restart: unless-stopped
       depends_on:
         - opensearch-node1
       ports:
         - 5601:5601
       environment:
         - OPENSEARCH_HOSTS='["https://opensearch-node1:9200"]'
         - OPENSEARCH_DASHBOARDS_JAVA_OPTS="-Xms1g -Xmx1g"
       env_file:
         - .env

     opensearch-logstash:
       image: opensearchproject/logstash-oss-with-opensearch-output-plugin:8.9.0
       restart: unless-stopped
       depends_on:
         - broker
         - schema-registry
         - opensearch-node1
         - opensearch-init
       command: "-f /usr/share/logstash/config/pipeline.conf"
       volumes:
         - ./conf/pipeline.conf:/usr/share/logstash/config/pipeline.conf:ro
       environment:
         - LS_JAVA_OPT="-Xmx512m -Xms512m"
         - LOGSTASH_INTERNAL_PASSWORD=${LOGSTASH_INTERNAL_PASSWORD:-}
         - OPENSEARCH_INITIAL_ADMIN_PASSWORD=${OPENSEARCH_INITIAL_ADMIN_PASSWORD:-SecurePassword@123}
       env_file:
         - .env
       deploy:
         resources:
           limits:
             cpus: "1.0"
             memory: 1G
   ```

2. Create a `.env` file with the following content

   `OPENSEARCH_INITIAL_ADMIN_PASSWORD` is the password for the initial admin user created in the OpenSearch instance.
   It is used to authenticate the Defense Center with OpenSearch.

   ```bash title=".env"
   OPENSEARCH_INITIAL_ADMIN_PASSWORD=SecurePassword@123
   ```

3. Create a `conf/pipeline.conf` file with the following content

   ```config title="conf/pipeline.conf" showLineNumbers
   input {
      kafka {
        bootstrap_servers => "broker:29092"
        topics => ["snort_alerts"]
        auto_offset_reset => "earliest"
        decorate_events => extended
        group_id => "mataelang-dc-logstash"
        schema_registry_url => "http://schema-registry:8081"
      }
   }

   filter {
      date {
        match => ["timestamp", "yy/MM/dd-HH:mm:ss.SSSSSS"]
        target => "@timestamp"
        timezone => "UTC"
      }

      ruby {
        code => "event.set('received_opensearch_at', (Time.now.to_f * 1000000).to_i)"
      }

      mutate {
        remove_field => ["event"]
      }

      if [dst_addr] {
        geoip {
            source => "dst_addr"
            target => "dst_geoip"
        }

        geoip {
            source => "dst_addr"
            target => "dst_as"
            default_database_type => "ASN"
            fields => ["AUTONOMOUS_SYSTEM_NUMBER", "AUTONOMOUS_SYSTEM_ORGANIZATION"]
        }
      }

      if [src_addr] {
        geoip {
            source => "src_addr"
            target => "src_geoip"
        }

        geoip {
            source => "src_addr"
            target => "src_as"
            default_database_type => "ASN"
            fields => ["AUTONOMOUS_SYSTEM_NUMBER", "AUTONOMOUS_SYSTEM_ORGANIZATION"]
        }
      }

      if [priority] == 1 {
        mutate { add_field => { "priority_str" => "High" } }
      } else if [priority] == 2 {
        mutate { add_field => { "priority_str" => "Medium" } }
      } else if [priority] == 3 {
        mutate { add_field => { "priority_str" => "Low" } }
      } else if [priority] > 3 {
        mutate { add_field => { "priority_str" => "Informational" } }
      } else {
        mutate { add_field => { "priority_str" => "Unknown" } }
      }
   }

   output {
      opensearch {
        hosts => ["https://opensearch-node1:9200"]
        index => "mataelang-sensor-events-stream"
        action => "create"
        user => "admin"
        password => "${OPENSEARCH_INITIAL_ADMIN_PASSWORD:SecurePassword@123}"
        ssl => true
        ssl_certificate_verification => false
      }
   }
   ```

4. Import the OpenSearch Dashboards index pattern and visualizations

   Download the compressed file containing the dashboards and visualizations from [here](#) and extract it.
   Then, go to the directory where you extracted the files and run the following command:

   ```bash
   OPENSEARCH_INITIAL_ADMIN_PASSWORD=SecurePassword@123 ./opensearch-init.sh
   ```

   :::note[Note]
   Don't forget to change the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` value according to the value you set in the `.env` file.
   :::

5. Run the following command to start the Defense Center

   ```bash
   docker-compose up -d
   ```

  </TabItem>
  <TabItem value="manual" label="Manual">

1. **Preparation**: Clone the repository and navigate to the `defense_center` directory.

   ```bash
   git clone https:// && cd defense_center
   ```

2. **Configuration**: Copy the example configuration file and update the configuration settings.

   ```bash
   cp .env.example .env
   ```

3. **Pull Images**: Pull the required Docker images.

   ```bash
   docker-compose pull
   ```

4. **Start Services**: Start the Docker services.

   ```bash
   docker-compose up -d
   ```

5. **Access Dashboard**: Access the Mata Elang Defense Center dashboard at [http://localhost:5601](http://localhost:5601).

  </TabItem>
</Tabs>

### Installing Mata Elang Sensor

<Tabs
  className="unique-tabs"
  defaultValue="manual"
  groupId="installation-method"
  >
  <TabItem value="docker-compose" label="Docker Compose">

1. Create a `compose.yml` file with the following content

   ```yaml title="compose.yml" showLineNumbers
   volumes:
   snort_log:
     driver: local
     driver_opts:
       type: tmpfs
       device: tmpfs
       o: size=1g

   services:
   snort:
     image: ghcr.io/mata-elang-stable/snort3-docker-image:v2.0-debian
     restart: unless-stopped
     network_mode: host
     env_file:
       - .env
     volumes:
       - snort_log:/var/log/snort:rw
       - ./custom.rules:/usr/local/etc/snort3/rules/local.rules:ro
       - ./rules:/tmp/rules:ro
     deploy:
       resources:
         limits:
           cpus: "1"
           memory: 512M

   snort-parser:
     image: ghcr.io/mata-elang-stable/sensor-snort-service:latest
     restart: unless-stopped
     command: "client -v"
     depends_on:
       - snort
     env_file:
       - .env
     volumes:
       - snort_log:/var/log/snort:rw
     deploy:
       resources:
         limits:
           cpus: "1"
           memory: 512M
   ```

2. Create a `.env` file with the following content

   :::note
   Change the `NETWORK_INTERFACE` and `MES_CLIENT_SERVER` values according to your environment. `NETWORK_INTERFACE` is the network interface to listen on, and `MES_CLIENT_SERVER` is the IP address of the Mata Elang Defense System (MES) server. If you are running the sensor and the defense center on the same machine, you can use `172.17.0.1` in Linux or `host.docker.internal` in Windows/Mac.
   :::

   ```bash title=".env"
   NETWORK_INTERFACE=eth0
   MES_CLIENT_SERVER=172.17.0.1
   MES_CLIENT_PORT=50051
   MES_CLIENT_SENSOR_ID=sensor1
   ```

3. Add the custom rules to the `custom.rules` file

   You can add your custom rules to the `custom.rules` file. For example:

   ```plaintext title="custom.rules"
   alert icmp any any -> any any (msg:"ICMP test detected"; gid:1; sid:10000001; rev:001; classtype:icmp-event;)
   ```

   The above rule will generate an alert when an ICMP packet is detected.

4. Then, run the following command to start the sensor

   ```bash
   docker compose up -d
   ```

  </TabItem>
  <TabItem value="manual" label="Manual">

1. Clone the example deployment repository and navigate to the `sensor_snort` directory.

   ```bash
   git clone https:// && cd sensor_snort
   ```

2. Copy the example configuration file and update the configuration settings.

   ```bash
   cp .env.example .env
   ```

   Configurations required to be updated:
    - `NETWORK_INTERFACE`: The network interface to capture packets. (e.g., `eth0`)
    - `MES_CLIENT_SERVER`: The Mata Elang Defense Center server address. (e.g., `172.17.0.1`). Leave it as it is if you are deploying the Mata Elang Defense Center on the same machine.
    - `MES_CLIENT_PORT`: The Mata Elang Defense Center server port. (e.g., `50051`). Leave it as it is if you are deploying the Mata Elang Defense Center on the same machine.
    - `MES_CLIENT_SENSOR_ID`: The Mata Elang Sensor ID. (e.g., `snort-1`)

   :::note
   If you are running the sensor and the defense center on the same machine, you can use `172.17.0.1` in Linux or `host.docker.internal` in Windows/Mac.
   :::

3. Pull the required Docker images.

   ```bash
   docker-compose pull
   ```

4. Start the Docker services.

   ```bash
   docker-compose up -d
   ```

5. Run the following command to start the sensor

   ```bash
   docker-compose up -d
   ```

  </TabItem>
</Tabs>

## Accessing the Dashboard

After successfully installing the Mata Elang Defense Center, you can access the dashboard by visiting [http://localhost:5601](http://localhost:5601) in your web browser.
