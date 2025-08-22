# 🛒 E-Commerce Microservices App

This is a backend-focused **E-commerce application** built using a **microservices architecture**.  
It demonstrates authentication, product management, ordering, and notifications using modern .NET technologies.  

⚠️ **Disclaimer**:  
- This project currently runs **only on Windows**.  
- Requires **.NET 9** installed.  
- Backend is the main focus – the frontend may contain incomplete or placeholder details.  
- Sometimes **UserService** and **ProductService** may shut down unexpectedly. If that happens, you may need to restart them manually with `docker compose restart userservice productservice`.

---

## 🧩 Architecture

The system is composed of **five backend microservices** and a **frontend**:

- **API Gateway (ASP.NET Core)**  
  - Routes requests to the correct service.  
  - Handles JWT authentication.  

- **AuthService (ASP.NET Core)**  
  - Issues JWT tokens for authentication.  
  - Communicates with UserService via gRPC.  

- **UserService (ASP.NET Core + SQL Server)**  
  - Manages user data with **ASP.NET Core Identity**.  
  - Stores data in SQL Server.  
  - Exposed to AuthService via gRPC.  

- **ProductService (ASP.NET Core + SQL Server)**  
  - Handles product CRUD operations.  
  - Stores product information in SQL Server.  

- **OrderService (ASP.NET Core + MongoDB)**  
  - Handles order creation and management.  
  - Publishes messages to RabbitMQ for notifications.  

- **NotificationService (ASP.NET Core + RabbitMQ)**  
  - Listens to RabbitMQ messages from OrderService.  
  - Sends notifications when new orders are placed.  

- **Frontend (React + Vite)**  
  - Allows customers to browse and order products.  
  - Store owners can register and list their stores.  
  - ⚠️ Frontend may not be fully polished – backend is the primary focus.

---

## ⚡ Prerequisites

Make sure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows only)  
 
---

## 🚀 Running the App

1. Clone the repository:
   
   - git clone https://github.com/GeorgeSmirnis/e-commerce.git
   - cd e-commerce
   - docker compose up --build
   
If not all the sesrvices start then you might need to restart them manually via the docker UI or docker compose restart userservice productservice

