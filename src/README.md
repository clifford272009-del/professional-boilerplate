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

   Activity 9

   ## Reflection Questions

### 1. What is the difference between authentication and authorization? Give a real-world example of each.

Authentication is the process of verifying a user's identity. For example, when a user logs in using their email and password, the system checks if the credentials are correct.

Authorization determines what a user is allowed to access or do. For example, an admin can manage all users, while a regular user can only view their own account.

### 2. Why is JWT considered "stateless" and how does that benefit scalability?

JWT is considered stateless because the server does not need to store session information for every logged-in user. The token contains the information needed to verify the user's identity.

This improves scalability because multiple servers can verify tokens independently without sharing session storage.

### 3. What are the three parts of a JWT token and what does each part do?

A JWT consists of three parts:

- Header – Contains the token type and signing algorithm.
- Payload – Contains information or claims about the user, such as user ID and role.
- Signature – Verifies that the token has not been modified and was signed using the correct secret or private key.

### 4. Why should you never put sensitive data (like passwords) in the JWT payload?

JWT payloads are encoded, not encrypted by default. This means anyone who gets the token can decode and read its contents.

Putting passwords or other sensitive information in the payload can expose private user data.

### 5. How does bcrypt protect user passwords? What is the purpose of the "salt" and "rounds"?

Bcrypt protects passwords by hashing them instead of storing the original passwords.

A salt is a random value added during hashing to make password hashes unique, even when users have the same password.

Rounds determine how much computational work is required to generate the hash. More rounds make password cracking slower and more difficult.

### 6. What happens if someone steals a JWT token? How can you mitigate this risk?

If someone steals a JWT token, they may be able to access the user's account by using that token until it expires or is revoked.

To reduce this risk, we should:
- Use HTTPS.
- Set short expiration times.
- Store tokens securely.
- Never share tokens with other people.
- Implement refresh token rotation and revocation when necessary.

### 7. Why is it important to use HTTPS when transmitting JWT tokens?

HTTPS encrypts communication between the client and server. It protects JWT tokens from being intercepted or stolen by attackers while traveling across a network.

Without HTTPS, attackers may capture tokens and use them to access user accounts.

### 8. What is the difference between a short-lived access token and a long-lived refresh token? When would you use each?

An access token is a short-lived token used to access protected resources or API endpoints.

A refresh token is a longer-lived token used to request a new access token when the current access token expires.

Access tokens are used for normal API requests, while refresh tokens help users stay logged in without repeatedly entering their passwords.

### 9. How does the auth middleware know which user is making the request?

The authentication middleware reads the JWT from the Authorization header, usually using the Bearer token format.

It verifies the token using the secret key or public key. If the token is valid, the middleware extracts the user information from the payload and attaches it to the request object.

The application can then identify the user making the request.

### 10. If you had to implement role-based authorization (e.g., admin vs. regular user), how would you modify your current setup?

I would add a role field to the User entity or database table, with values such as "admin" and "user".

When a user logs in, the role can be included as a claim in the JWT payload.

I would also create an authorization middleware that checks the user's role before allowing access to protected routes.

For example, only admins would be allowed to delete users or manage the system, while regular users would only have permission to access their own information.

This would make the application more secure by ensuring that users can only perform actions allowed by their roles.