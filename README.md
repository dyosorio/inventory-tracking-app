# Inventory Tracking Application

## Project Overview

This project is an inventory and notification system that provides real-time inventory updates and notification alerts when stock decreases below a predefined threshold. The threshold can be set dynamically through a POST request to the /inventory/set-threshold endpoint.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
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

## Project Setup

### Prerequisites

- **Node.js** and **npm** installed.
- **NestJS CLI** installed globally.
- Docker
- ngrok 

### Usage

### API endpoints

| Endpoint                    | Method | Description                                                            | Example Request Body                                                           |
|-----------------------------|--------|------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `/inventory/update`         | POST   | Updates inventory for a specific product in a region.                  | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 100 }`    |
| `/inventory/increase`       | PATCH  | Increases inventory allocation for a product in a region.              | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 20 }`     |
| `/inventory/decrease`       | PATCH  | Decreases inventory allocation for a product in a region.              | `{ "productId": "product-uuid", "regionId": "region-uuid", "amount": 10 }`     |
| `/inventory/set-threshold`  | POST   | Sets the global threshold percentage for stock decrease notifications. | `{ "thresholdPercentage": 30 }`                                                |
| `/inventory`                | GET    | Retrieves all inventory records.                                       |                                                                                |

