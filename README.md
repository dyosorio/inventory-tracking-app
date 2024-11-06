# Inventory Tracking Application

## Project Overview

This project is an inventory and notification system that provides real-time inventory updates and notification alerts when stock decreases below a predefined threshold. The threshold can be set dynamically through a POST request to the /inventory/set-threshold endpoint.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Architecture](#project-architecture)
- [Project Setup](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features
- **Real-time Inventory Management**: Provides two API endpoints for updating product inventory levels, one for increasing and one for decreasing stock.
- **Selective Notification System**: The application sends a notification to a specified webhook endpoint only when the stock levels decrease below the predefined threshold.
- **Kafka Integration**: Uses Kafka for asynchronous messaging.
- **Webhook Notification**: Integrates webhook notifications for external applications.

## Technologies

- **Node.js**
- **TypeScript**
- **NestJS**
- **PostgreSQL** for database management
- **Kafka** for message broker functionality.
- **Docker** for containerized Kafka, Zookeeper, and Kafdrop services
- **Swagger** for API documentation
- **ngrok** for exposing local webhook endpoints

## Project Architecture

The architecture of this applicaiton is designed as a layered structure, to achieve clear separation of concerns and modularity. 
Each layer is responsible for a specific set of tasks:

```
Project Architecture
|
├── Presentation Layer
│   ├── API Endpoints
│   └── Controllers
│       └── Maps HTTP requests to services, response validation, Swagger documentation
|
├── Business Logic Layer
│   └── Services
│       └── Contains the core business logic for managing inventory
|
├── Data Access Layer
│   ├── Repositories
│   └── Database Interactions
│       └── Handles data persistence
|
├── Integration Layer
│   ├── Kafka Messaging
│   └── Webhooks and External APIs
│       └── Handles Async Communication with external services
|
├── Persistence Layer
│   └── Entities
│       └── Database schema definitions
|
└── Configuration & Infrastructure Layer
    ├── Environment Setup
    ├── Docker Configurations
    └── Configuration Files
        └── Sets up development and production environments
```

## Project Setup

### Prerequisites

- **Node.js** and **npm** installed.
- **NestJS CLI** installed globally.
- Docker
- ngrok 

### Usage
- Open Swagger http://localhost:3000/api#/
- Set up the threshold using the POST endpoint `/inventory/set-threshold`, or don't set up the threshold and use the default 30% value
- Select an item from the inventory to test. You can get the complete inventory by executing the GET `/inventory`  endpoint in Swagger
  - Once the data base is seeded, run `SELECT * FROM inventory;`
  - Make sure the selected item have enough stock balance, if not add stock by using the `/inventory/increase` endpoint

  - Example of the Inventory Table

```
                  id                  | allocation |   allocationTimestamp   |              productId               |               regionId               | stockBalance 
--------------------------------------+------------+-------------------------+--------------------------------------+--------------------------------------+--------------
 6a8cf6bb-95c3-4fe8-965a-dd4c43e55a0a |          1 | 2024-11-05 23:46:00.629 | 5666dda1-a424-4a23-93ed-22ee993d5590 | 39ca596b-f30c-41eb-bdd0-53ab2c2f979a |            100
 1315f364-84c0-4125-9445-83e11d30c7cd |          3 | 2024-11-05 10:58:16.187 | a54158c7-c2ee-4cd8-a095-37103d696ba4 | 39ca596b-f30c-41eb-bdd0-53ab2c2f979a |            300
 8c81d6be-d666-492c-9771-353cd82b97bd |          1 | 2024-11-05 20:09:58.389 | e310a916-a5d4-4033-bc59-27b8771f1efa | 39ca596b-f30c-41eb-bdd0-53ab2c2f979a |            100
 8e88278f-903d-4c64-a2bc-a9b409d5663c |          1 | 2024-11-05 20:24:11.135 | 5666dda1-a424-4a23-93ed-22ee993d5590 | f1110fbe-f527-4a82-b506-9abf53010896 |            100
 946bea86-2ed8-46fa-bfcd-9c2e862e43a3 |          2 | 2024-11-05 21:28:31.508 | a54158c7-c2ee-4cd8-a095-37103d696ba4 | f1110fbe-f527-4a82-b506-9abf53010896 |            200
 663804ec-800a-499d-9f08-df3471c7bce0 |          4 | 2024-11-05 22:56:15.524 | 5666dda1-a424-4a23-93ed-22ee993d5590 | 3201295c-b350-49fc-8c24-c874aa1f48af |            400
 bc176a56-d402-4012-af6d-5d1f67a0bad5 |          2 | 2024-11-05 23:02:42.654 | e310a916-a5d4-4033-bc59-27b8771f1efa | 3201295c-b350-49fc-8c24-c874aa1f48af |            200
 9eaf9953-ab5c-4f8a-8a39-e0120d2515d7 |          2 | 2024-11-05 23:05:40.397 | a54158c7-c2ee-4cd8-a095-37103d696ba4 | 3201295c-b350-49fc-8c24-c874aa1f48af |            200
```
- Decrease the item stock levels by using the `/inventory/decrease` endpoint in Swagger. You will need to add the productId and regionId to the requestBody. Also add the amount you would like to SUBSTRACT from the current stockBalance. If the current stockBalance is 80 for example, and you set up 20 in the amount, then will get 60 in the remaining stockBalance. Make sure you substract enough to trigger the low balance threshold notification.
```
{
  "productId": "5666dda1-a424-4a23-93ed-22ee993d5590",
  "regionId": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
  "amount": 20
}
```
- Optionally check kafkadrops to monitor the Kafka notification.
- Check the Node log messages to get the notification alert only when the item stock levels fall under the defined allocation or stock balance threshold level.


### API endpoints

| Endpoint                    | Method | Description                                                            | Example Request Body                                                           |
|-----------------------------|--------|------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `/inventory/update`         | POST   | Updates inventory for a specific product in a region.                  | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 100 }`    |
| `/inventory/increase`       | PATCH  | Increases inventory allocation for a product in a region.              | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 20 }`     |
| `/inventory/decrease`       | PATCH  | Decreases inventory allocation for a product in a region.              | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 10 }`     |
| `/inventory/set-threshold`  | POST   | Sets the global threshold percentage for stock decrease notifications. | `{ "thresholdPercentage": 30 }`                                                |
| `/inventory`                | GET    | Retrieves all inventory records.                                       |                                                                                |

