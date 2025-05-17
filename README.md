# � Microservices Backend Test - Order System
This project is a technical test for Backend Developer candidates. It simulates a
distributed system using microservices architecture with asynchronous communication
via RabbitMQ.
--

## � Services Overview
| Service | Description|
|----------------------|---------------------------------------------------------------|
| `order-service` | Exposes an API to create orders and publishes `order.created` |
| `inventory-service` | Listens to `order.created`, checks stock, and updates it  |
| `notification-service`| Logs a success message when inventory is updated |

## � Tech Stack
- Node.js + TypeScript
- NestJS
- RabbitMQ (message broker)
- Docker & Docker Compose
- PostgreSQL 
---
## � Running the Application (via Docker)
### 1. **Prerequisites**
- Docker & Docker Compose installed
- Ports `5672`, `15672` (RabbitMQ), `3000+` for services should be free
### 2. **Clone the Repository**
```bash
git clone https://github.com/your-username/microservices-order-system.git
```
### 3. **Go to the project directory**

```bash
cd microservices-order-system
```
### rename file `.env.example` to `.env`

### 4. **Running the appas by docker compose**
```bash
docker-compose up --build
```

### 5. **Run seeder data inventory**
- login into inventory-service container
```bash
docker exec -it inventory-service /bin/bash
```
- run seed by npm
```bash
npm run seed
```

## � API Reference
#### Post Order

```http
  POST /orders
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `header` | **Required** Basic Auth|
| `userId` | `numeric` | **Required**|
| `itemId` | `numeric` | **Required**|
| `quantity` | `numeric` | **Required**|

#### CURL
```curl
curl --location 'http://localhost:3001/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic YWRtaW46c2VjcmV0' \
--data '{
    "userId": 1,
    "itemId": 1,
    "quantity": 1
}'
```