---
title: OpenSearch Dashboard
sidebar_position: 10
---

Here is how you monitor the Mata Elang v2 system using OpenSearch Dashboard.

First, you have to open OpenSearch Dashboard page on your browser. You will have to input your credential.
![image](uploads/d143583d02f5f501f135a9c935f97f6e/image.png){width=1434 height=549}

After that, you need to navigate to sidebar and seek for OpenSearch Dashboard's dashboard tile.
![image](uploads/fb47b9779593fe575f59c931b77293ce/image.png){width=1438 height=726}

![image](uploads/1160ae3d82b4301ffc3ee5b1e4b503e3/image.png){width=240 height=141}

And then, choose which dashboard you want to see.
![image](uploads/13a2d159874c13e34c28bade2f2b9b84/image.png){width=1440 height=396}

![OpenSearch Dashboard Main View](uploads/93dad5d4e85ecb86c57755b9e8ed5e50/image.png)

You will have few parts of dashboard's tools, such as charts, filter, and data display. You will see total alerts number, and total alerts per priority number. This number is depends on your filter if it set.

## Setting Your Time Filter

![OpenSearch Dashboard Time Filter](uploads/690b108ad10d61ddd3b1de0ef71391f1/image-1.png)

You can adjust the time filter if you want to see more data from past. Set the start date and end date as you want. Press Refresh button after that to refresh the dashboard to show the data based on your time filter.

## Setting Your Sensor Filter

![OpenSearch Dashboard Sensor Filter](uploads/cc178ccee71dfc4bf8002cda92662b90/image-2.png)

You can adjust the sensor filter if you want to see each alerts detected by each sensor. For instance, You could select a sensor and set the alerts priority, then you could set one and many classification you want to investigate. The data display will eventually shows data based on your sensor's filter.

## Alert IP Address Route Chart Reading

![OpenSearch Dashboard IP Address Route Chart](uploads/22f93f81fbaac5b04e71bfe23f894b50/image-4.png)

This is an example of Alert IP Address Route chart. To read it, you have to understand that left side of the chart is Source IP Address, where the alerts comes from, and the right side is Destination IP Address, where the alerts is sent to.

Each of streams explaining how many alerts going from an IP Address to target's IP Address. For example, that green stream tells us that there's some alerts, going from `0.0.0.0` to `255.255.255.255` and the total green's alert is 162.033 alerts, which contributing about 28% of total alerts recorded.


## Sensor List Table

![Sensor List](uploads/5fe03e4a3a9490762f978f373b54c304/image-9.png)

This table provides a detailed overview of the sensors connected to the defense center, specifically focusing on the data collected by each sensor.

##### Table Overview:

- Title: The table is titled "Sensors List," indicating that it lists various sensors monitored by the defense center.
- Columns:
  Sensor ID: This column identifies each sensor uniquely. In the provided data, there is only one sensor listed with the ID "sensor-12."
- Total: This column shows the total number of events or data points collected by the sensor. For "sensor-12," the total is 99,857.
  - High: This column indicates the number of high-priority or high-severity events detected by the sensor. For "sensor-12," there are 39 high-priority events.
  - Medium: This column shows the number of medium-priority or medium-severity events. In this case, "sensor-12" has recorded 0 medium-priority events.
  - Low: This column represents the number of low-priority or low-severity events. "Sensor-12" has recorded 99,818 low-priority events.

## Top 10 Classification with Priority Table Reading

![OpenSearch Dashboard Top 10 Classification Table](uploads/e5f3d5460a1b188041f38abf70838c86/image-5.png)

This table inform you of top 10 most malicious alert recorded by classification and priority. For example, the most malicious alert among that list informs you that there was some attempts of code execution with descriptive message and total alert's count.

## Alerts by Priority Table Reading

![image-11](uploads/308a03c50c3723061b1da8259fe18a0b/image-11.png)
This table informs you about total alerts categorized by priority (explained by color lists on left) that represented as Y - Axis per 60 minutes of time interval represented as X - Axis that visualized as dots.

## Alerts by Protocol Table Reading

![image-12](uploads/9fa57880979b2ec6169136296c652aa3/image-12.png)

This table informs you about total alerts categorized by protocol (explained by color lists on left) that represented as Y - Axis per 60 minutes of time interval represented as X - Axis that visualized as dots.


## Top 10 Source IP Address List Table Reading

![image-14](uploads/78e827607cf137e7fb8b1eede75be95c/image-14.png)

This table informs you about top 10 most frequent source IP Addresses from which network traffic originates, along with the corresponding count of occurrences.

## Source IP Address Mapping

![OpenSearch Dashboard Source IP Address Map](uploads/2657c209764285eac0406d6f4401dfa6/image-6.png)

This map informs you about alert's source IP Address location. Each color explains about quantity of alerts sent from that location.

## Top 10 Source IP Address Country Table Reading

![image-15](uploads/8df28ca7ef3e504f38ba1e54dd87d2c8/image-15.png)

This table informs you about top 10 country from which source IP Addresses originates from, along with the corresponding count of occurrences.

## Top 10 Destination IP Address List Table Reading

![image-16](uploads/3e020f2722ecb2a24b7fc7c0fc0fbf5f/image-16.png)

This table informs you about the top 10 most frequent destination IP addresses to which network traffic is directed, along with the corresponding count of occurrences.


## Destination IP Address Mapping

![OpenSearch Dashboard Destination IP Address Map](uploads/dc5dc03aedae35ecb5e7a0a1f96e2a1a/image-7.png)

This map informs you about alert's destination IP Address location. Each color explains about quantity of alerts sent to that location.


## Top 10 Destination IP Address Country Table Reading

![image-17](uploads/934456822fc4eb71e69117cb2fbf43b6/image-17.png)

This table informs you about the top 10 destination countries to which IP addresses are directed, along with the corresponding count of occurrences.


## Alert Detail

![OpenSearch Dashboard Alert Detail Table](uploads/f8dfa2f2bffe2a91bb73b66f47464f25/image-8.png)

This table informs you about alert's detail. You will see each alert's timestamps, which sensor that detected it, alert's source IP Address, alert's source IP Address country, alert's source alias, alert's destination IP Address, alert's destination IP Address country, alert's destination alias, and alert's classification.
