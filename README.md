# Inventory Tracking Application

## Project Overview

This project is an inventory and notification system that provides real-time inventory updates and notification alerts when stock decreases below a predefined threshold. The threshold can be set dynamically through a POST request to the /inventory/set-threshold endpoint.

Regarding the threshold logic, I decided to implement a dynamic, configurable threshold percentage. To trigger a notification, you need to decrease the stock by an amount that brings it below the percentage of the current allocation or stock balance.

For example: 
If the threshold is set to 10% and the stock balance is 100, you would need to decrease the stock by 97 items to trigger the notification alert.

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

- **Node.js** and **npm** installed. Make sure you are using `v18.19.1` or up
- **NestJS CLI** installed globally.
- Docker
- ngrok 

### Steps

1. Clone the Repository
    ```
    git clone https://github.com/dyosorio/inventory-tracking-app.git
    cd inventory-tracking-app
    ```
    - Set up the .env file, after you set up postgreSQL it needs to look like this. You need to generate a WEBHOOK_URL everytime by running ngrok.

    ```
    # PostgreSQL configuration
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: inventory_db

    # Kafka configuration
    KAFKA_BROKERS=localhost:9092
    KAFKAJS_NO_PARTITIONER_WARNING=1

    # Webhook
    WEBHOOK_URL=https://<your-ngrok-id>.ngrok-free.app/webhook/receive-alert
    ```
2. run `npm install`

3. Make sure Docker is installed, open Docker Desktop and run `docker-compose up`

4. Run the application `npm run start`

5. Create and set up ngrok account (Sorry for the inconvenience! This will generate the WEBHOOK_URL)
    - Sign in for an account: https://dashboard.ngrok.com/signup
    - Use Google oauth
    - Accept terms, click on Create Account. Ignore the QR, or the token, follow to the next step.
    - Access the url https://dashboard.ngrok.com/get-started/your-authtoken and follow the steps
    - Copy the token under the text `This is your personal Authtoken. Use this to authenticate the ngrok agent that you downloaded.`
    - Copy this command `ngrok config add-authtoken $YOUR_AUTHTOKEN`
    - Run it in your terminal, prefix it with npx `npx ngrok config add-authtoken $YOUR_AUTHTOKEN`
    - run `ngrok http 3000` to get the webhook URL. Find the URL next to Forwarding
    - Copy the URL and add it as a value for WEBHOOK_URL on the .env file. Please make sure you add `/webhook/receive-alert`at the end of the generated url
        ```
        WEBHOOK_URL=https://<your-ngrok-url>/webhook/receive-alert
        ```     

6. Access Swagger for API testing http://localhost:3000/api

7. Access kafdrop for Kafka monitoring, Topic: inventory-decrease http://localhost:9000/topic/inventory-decrease

8. Seed the data base
    - Run the command`npx run ts-node src/seeds/seed.ts`
    - After excecution go to Swagger and execute the GET /inventory endpoint
    - If the response is 200 and it has data you can procede to test the decrease endpoint and below threshold webhook notification. See - [Usage](#usage) for more details

## Usage
- Follow the set up steps above
- run `ngrok http 3000` to generate a fresh Webhook URL if needed. The URL is not persistent, it expires after some time.
- Go the .env file and add the ngrok generated URL with `/webhook/receive-alert` at the end if needed.
- Go to Swagger http://localhost:3000/api#/
- Set up the threshold percentage by executing the `POST` endpoint `/inventory/set-threshold`, or don't set up the threshold and use the default 30% value
- Select an item from the inventory to test. You can get the complete inventory by executing the GET `/inventory`  endpoint in Swagger. See the example response below.

    ```
    [
    {
        "allocation": 401,
        "stockBalance": 401,
        "id": "6a8cf6bb-95c3-4fe8-965a-dd4c43e55a0a",
        "allocationTimestamp": "2024-11-06T11:15:26.668Z",
        "product": {
        "id": "5666dda1-a424-4a23-93ed-22ee993d5590",
        "name": "VARSITY EMBROIDERED CARDIGAN RED",
        "description": "Bold, vintage-inspired charm"
        },
        "region": {
        "id": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
        "name": "NA"
        }
    },
    {
        "allocation": 3,
        "stockBalance": 3,
        "id": "1315f364-84c0-4125-9445-83e11d30c7cd",
        "allocationTimestamp": "2024-11-05T09:58:16.187Z",
        "product": {
        "id": "a54158c7-c2ee-4cd8-a095-37103d696ba4",
        "name": "CASHMERE BLEND STRIPED TURTLENECK SWEATER NATURAL",
        "description": "Soft with classic stripes"
        },
        "region": {
        "id": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
        "name": "NA"
        }
    },
    {
        "allocation": 1,
        "stockBalance": 1,
        "id": "8c81d6be-d666-492c-9771-353cd82b97bd",
        "allocationTimestamp": "2024-11-05T19:09:58.389Z",
        "product": {
        "id": "e310a916-a5d4-4033-bc59-27b8771f1efa",
        "name": "MEDWAY JUMPER MID BLUE",
        "description": "Timeless comfort with a modern twist"
        },
        "region": {
        "id": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
        "name": "NA"
        }
    },
    {
        "allocation": 1,
        "stockBalance": 1,
        "id": "8e88278f-903d-4c64-a2bc-a9b409d5663c",
        "allocationTimestamp": "2024-11-05T19:24:11.135Z",
        "product": {
        "id": "5666dda1-a424-4a23-93ed-22ee993d5590",
        "name": "VARSITY EMBROIDERED CARDIGAN RED",
        "description": "Bold, vintage-inspired charm"
        },
        "region": {
        "id": "f1110fbe-f527-4a82-b506-9abf53010896",
        "name": "APAC"
        }
    },
    {
        "allocation": 2,
        "stockBalance": 2,
        "id": "946bea86-2ed8-46fa-bfcd-9c2e862e43a3",
        "allocationTimestamp": "2024-11-05T20:28:31.508Z",
        "product": {
        "id": "a54158c7-c2ee-4cd8-a095-37103d696ba4",
        "name": "CASHMERE BLEND STRIPED TURTLENECK SWEATER NATURAL",
        "description": "Soft with classic stripes"
        },
        "region": {
        "id": "f1110fbe-f527-4a82-b506-9abf53010896",
        "name": "APAC"
        }
    },
    {
        "allocation": 4,
        "stockBalance": 4,
        "id": "663804ec-800a-499d-9f08-df3471c7bce0",
        "allocationTimestamp": "2024-11-05T21:56:15.524Z",
        "product": {
        "id": "5666dda1-a424-4a23-93ed-22ee993d5590",
        "name": "VARSITY EMBROIDERED CARDIGAN RED",
        "description": "Bold, vintage-inspired charm"
        },
        "region": {
        "id": "3201295c-b350-49fc-8c24-c874aa1f48af",
        "name": "EMEA"
        }
    },
    {
        "allocation": 2,
        "stockBalance": 2,
        "id": "bc176a56-d402-4012-af6d-5d1f67a0bad5",
        "allocationTimestamp": "2024-11-05T22:02:42.654Z",
        "product": {
        "id": "e310a916-a5d4-4033-bc59-27b8771f1efa",
        "name": "MEDWAY JUMPER MID BLUE",
        "description": "Timeless comfort with a modern twist"
        },
        "region": {
        "id": "3201295c-b350-49fc-8c24-c874aa1f48af",
        "name": "EMEA"
        }
    },
    {
        "allocation": 2,
        "stockBalance": 2,
        "id": "9eaf9953-ab5c-4f8a-8a39-e0120d2515d7",
        "allocationTimestamp": "2024-11-05T22:05:40.397Z",
        "product": {
        "id": "a54158c7-c2ee-4cd8-a095-37103d696ba4",
        "name": "CASHMERE BLEND STRIPED TURTLENECK SWEATER NATURAL",
        "description": "Soft with classic stripes"
        },
        "region": {
        "id": "3201295c-b350-49fc-8c24-c874aa1f48af",
        "name": "EMEA"
        }
    },
    {
        "allocation": 2,
        "stockBalance": 2,
        "id": "1354011a-6baf-4f53-b75c-66a855416eec",
        "allocationTimestamp": "2024-11-05T22:26:39.723Z",
        "product": {
        "id": "e310a916-a5d4-4033-bc59-27b8771f1efa",
        "name": "MEDWAY JUMPER MID BLUE",
        "description": "Timeless comfort with a modern twist"
        },
        "region": {
        "id": "f1110fbe-f527-4a82-b506-9abf53010896",
        "name": "APAC"
        }
    }
    ]
    ```
- You may need to increase inventory by using the PATCH /inventory/increase endpoint in Swagger
    ```
    {
    "productId": "5666dda1-a424-4a23-93ed-22ee993d5590",
    "regionId": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
    "amount": 400
    }
    ```

### Decrease stock levels below threshold and get the webhook notification
- Use the /inventory/decrease endpoint in Swagger to reduce item stock levels. In the request body, include the productId, regionId, and the amount you wish to subtract from the current stockBalance. For example, if the stockBalance is 80 and you set the amount to 20, the remaining stockBalance will be 60. Ensure that the amount you subtract is enough to trigger the low balance threshold notification.
    -Request Body
    ```
    {
    "productId": "5666dda1-a424-4a23-93ed-22ee993d5590",
    "regionId": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
    "amount": 20
    }
    ```
    - You will get this response
    ```
    {
        "status": "Inventory decreased successfully"
    }
    ```
- Optionally check kafkadrops in http://localhost:9000/ to monitor the Kafka notification. Topic Messages: inventory-decrease
    - In Node you will see this log
    ```
    [Nest] 47430  - 11/06/2024, 12:30:55 PM     LOG [KafkaService] Message sent to topic "inventory-decrease": {"productId":"5666dda1-a424-4a23-93ed-22ee993d5590","regionId":"39ca596b-f30c-41eb-bdd0-53ab2c2f979a","currentStock":1,"threshold":20,"message":"Stock level has fallen below 20% threshold."}
    ```
    - Additionally you will see this log
    ```
    [Nest] 47430  - 11/06/2024, 12:30:55 PM     LOG [KafkaService] Sending webhook notification to: https://e149-2a02-a44e-6e17-1-5537-6e7a-a711-a070.ngrok-free.app/webhook/receive-alert
    [Nest] 47430  - 11/06/2024, 12:30:55 PM     LOG [KafkaService] Payload: {"productId":"5666dda1-a424-4a23-93ed-22ee993d5590","regionId":"39ca596b-f30c-41eb-bdd0-53ab2c2f979a","currentStock":1,"threshold":20,"message":"Stock level has fallen below 20% threshold."}
    ```
- Check the Node log messages to get the notification alert only when the item stock levels fall under the defined allocation or stock balance threshold level.
    - If the webhook alert was successfully received, you will see the logs below on the node terminal
    ```
    [Nest] 47430  - 11/06/2024, 12:30:55 PM     LOG [WebhookController] Received alert:
    [Nest] 47430  - 11/06/2024, 12:30:55 PM     LOG [WebhookController] Object:
    {
    "productId": "5666dda1-a424-4a23-93ed-22ee993d5590",
    "regionId": "39ca596b-f30c-41eb-bdd0-53ab2c2f979a",
    "currentStock": 1,
    "threshold": 20,
    "message": "Stock level has fallen below 20% threshold."
    }

    [Nest] 47430  - 11/06/2024, 12:30:55 PM     LOG [KafkaService] Webhook notification sent: {"status":"Alert received successfully"}
    ```

- If you get this error instead of the decrease below threshold Webhook notification, it means you need to generate a new ngrok URL. Follow the steps below to solve it.
    ```
    [Nest] 10255  - 11/06/2024, 12:25:08 PM   ERROR [KafkaService] Error sending webhook notification:
    [Nest] 10255  - 11/06/2024, 12:25:08 PM   ERROR [KafkaService] AxiosError: Request failed with status code 404
    [Nest] 10255  - 11/06/2024, 12:25:08 PM   ERROR [KafkaService] Response Data: "Tunnel 5f0c-2a02-a44e-6e17-1-5537-6e7a-a711-a070.ngrok-free.app not found\r\n\r\nERR_NGROK_3200\r\n"
    [Nest] 10255  - 11/06/2024, 12:25:08 PM   ERROR [KafkaService] Status Code: 404
    ```
    - run `ngrok http 3000` to generate a new URL
    - Copy the url and past it on the .env file. Example: `WEBHOOK_URL=https://e149-2a02-a44e-6e17-1-5537-6e7a-a711-a070.ngrok-free.app/webhook/receive-alert`
    - Run `npm run start`again
    - Decrease inventory stock levels for an item again and check the logs for the notification.

### API endpoints

| Endpoint                    | Method | Description                                                            | Example Request Body                                                           |
|-----------------------------|--------|------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `/inventory/update`         | POST   | Updates inventory for a specific product in a region.                  | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 100 }`    |
| `/inventory/increase`       | PATCH  | Increases inventory allocation for a product in a region.              | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 20 }`     |
| `/inventory/decrease`       | PATCH  | Decreases inventory allocation for a product in a region.              | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 10 }`     |
| `/inventory/set-threshold`  | POST   | Sets the global threshold percentage for stock decrease notifications. | `{ "thresholdPercentage": 30 }`                                                |
| `/inventory`                | GET    | Retrieves all inventory records.                                       |                                                                                |

Thanks!