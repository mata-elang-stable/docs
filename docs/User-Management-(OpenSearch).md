---
title: User Management (OpenSearch)
sidebar_position: 9
---

## Create User

1. Choose Security, Internal Users, and Create internal user.
2. Provide a username and password. The security plugin automatically hashes the password and stores it in the .opendistro_security index.
3. If desired, specify user attributes.
   Attributes are optional user properties that you can use for variable substitution in index permissions or document-level security.
4. Choose Submit.

## Create Role

1. Choose Security, Roles, and Create role.
2. Provide a name for the role.
3. Add permissions as desired.
   For example, you might give a role no cluster permissions, read permissions to two indices, unlimited permissions to a third index, and read permissions to the analysts tenant.
4. Choose Submit.

## Map User for Role

1. Choose Security, Roles, and a role.
2. Choose the Mapped users tab and Manage mapping.
3. Specify users or external identities (also known as backend roles).
4. Choose Map.

## Predefined Roles

The security plugin includes several predefined roles that serve as useful defaults.

| Role | Description |
| --- | --- |
| alerting_ack_alerts | Grants permissions to view and acknowledge alerts, but not modify destinations or monitors. |
| alerting_full_access | Grants full permissions to all alerting actions. |
| alerting_read_access | Grants permissions to view alerts, destinations, and monitors, but not acknowledge alerts or modify destinations or monitors. |
| anomaly_full_access | Grants full permissions to all anomaly detection actions. |
| anomaly_read_access | Grants permissions to view detectors, but not create, modify, or delete detectors. |
| all_access | Grants full access to the cluster: all cluster-wide operations, write to all indices, write to all tenants. |
| cross_cluster_replication_follower_full_access | Grants full access to perform cross-cluster replication actions on the follower cluster. |
| cross_cluster_replication_leader_full_access | Grants full access to perform cross-cluster replication actions on the leader cluster. |
| opensearch_dashboards_read_only | A special role that prevents users from making changes to visualizations, dashboards, and other OpenSearch Dashboards objects. See opensearch_security.readonly_mode.roles in opensearch_dashboards.yml. Pair with the opensearch_dashboards_user role. |
| opensearch_dashboards_user | Grants permissions to use OpenSearch Dashboards: cluster-wide searches, index monitoring, and write to various OpenSearch Dashboards indices. |
| logstash | Grants permissions for Logstash to interact with the cluster: cluster-wide searches, cluster monitoring, and write to the various Logstash indices. |
| manage_snapshots | Grants permissions to manage snapshot repositories, take snapshots, and restore snapshots. |
| readall | Grants permissions for cluster-wide searches like msearch and search permissions for all indices. |
| readall_and_monitor | Same as readall, but with added cluster monitoring permissions. |
| security_rest_api_access | A special role that allows access to the REST API. See plugins.security.restapi.roles_enabled in opensearch.yml and Access control for the API. |
| reports_read_access | Grants permissions to generate on-demand reports, download existing reports, and view report definitions, but not to create report definitions. |
| reports_instances_read_access | Grants permissions to generate on-demand reports and download existing reports, but not to view or create report definitions. |
| reports_full_access | Grants full permissions to reports. |
| asynchronous_search_full_access | Grants full permissions to all asynchronous search actions. |
| asynchronous_search_read_access | Grants permissions to view asynchronous searches, but not to submit, modify, or delete async searches. |
| index_management_full_access | Grants full permissions to all index management actions, including ISM, transforms, and rollups. |

## Sample Roles

The following examples show how you might set up a read-only and a bulk access role.

## Set up a read-only user

Create a new read_only_index role:

1. Open OpenSearch Dashboards.
2. Choose Security, Roles.
3. Create a new role named read_only_index.
4. For Cluster permissions, add the cluster_composite_ops_ro action group.
5. For Index Permissions, add an index pattern. For example, you might specify my-index-\*.
6. For index permissions, add the read action group.
7. Choose Create.

## Map three roles to the read-only user

1. Choose the Mapped users tab and Manage mapping.
2. For Internal users, add your read-only user.
3. Choose Map.
4. Repeat these steps for the opensearch_dashboards_user and opensearch_dashboards_read_only roles.

## Set up a bulk access role in OpenSearch Dashboards

Create a new bulk_access role:

1. Open OpenSearch Dashboards.
2. Choose Security, Roles.
3. Create a new role named bulk_access.
4. For Cluster permissions, add the cluster_composite_ops action group.
5. For Index Permissions, add an index pattern. For example, you might specify my-index-\*.
6. For index permissions, add the write action group.
7. Choose Create.

## Map the role to your user

1. Choose the Mapped users tab and Manage mapping.
2. For Internal users, add your bulk access user.
3. Choose Map.

In order to manage users effectively, including creating users, assigning roles, and mapping users to roles, refer to the steps outlined in the official documentation site of [OpenSearch Access-Control](https://opensearch.org/docs/latest/security/access-control/users-roles/).
