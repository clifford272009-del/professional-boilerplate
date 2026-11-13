# Professional Node.js & TypeScript Express Boilerplate

A robust, production-ready backend boilerplate built with **Node.js**, **Express**, **TypeScript**, **TypeORM**, and **MySQL**. It includes enterprise-grade features such as centralized error handling, request validation, environment configuration, and structured logging.

---

## Features List

- **TypeScript Support**: Fully typed codebase for enhanced developer experience and maintainability.
- **TypeORM Integration**: Modern ORM configured for MySQL with Entity mapping.
- **Robust Error Handling**: Centralized middleware for catching operational errors and handling 404/not-found routes cleanly.
- **Input Validation**: Request payload validation powered by Joi/Celebrate (or equivalent middleware).
- **Structured Logging**: Winston-based logging setup for clean development and production log tracking.
- **Database Health Monitoring**: Built-in `/health` check route reporting live server and database connectivity status.
- **RESTful User API**: Complete CRUD-ready user management module (`/api/users`).

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server installed and running locally or via Docker.

### Installation Steps

1. **Clone the repository / Navigate to project folder**:
   ```bash
   cd professional-boilerplate