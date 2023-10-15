# iGP Auth REST API Documentation
## Overview
This documentation provides an overview of the iGP Auth REST API, which is built using TypeScript, Express.js, and Mongoose. The API is designed to handle user authentication and user notifications.

## Technologies Used
The iGP Auth REST API is built using the following technologies:

- TypeScript: TypeScript is used for the development of the API, providing strong typing and improved code quality.

- Express.js: Express.js is a popular web application framework for Node.js, used to build the REST API endpoints.

- Mongoose: Mongoose is an Object Data Modeling (ODM) library for MongoDB, used to define schemas and interact with the database.

- Swagger: Swagger is used for API documentation, providing detailed information about API endpoints.

## Architecture
### index.ts
The `index.ts` file serves as the entry point of the application. It initializes the Express application, configures controllers, and starts the server.

### app.ts
The `app.ts` file defines the App class, which represents the Express application. It includes middleware setup, error handling, database connection, and WebSocket support for user notifications.

### Controllers
`auth.controller.ts`: This controller handles user authentication, including login, registration, and email verification.

`users.controller.ts`: This controller handles user-related operations, but its implementation is not provided in the code you shared.

user-notifications.controller.ts: This controller manages user notifications, including fetching notifications and creating new ones.

### Middleware
`validation.middleware.ts`: This middleware is used for request validation using JSON schemas.

`error.middleware.ts`: This middleware handles errors and sends appropriate responses.

`logger.middleware.ts`: This middleware logs incoming requests and responses.

### Schemas
`user.schema.ts`: This schema defines the structure of the user data stored in the database, including fields such as username, email, password, and verification codes.

`notification.schema.ts`: This schema defines the structure of notifications, including the title, body, and user ID associated with each notification.

### Services
`auth.service.ts`: This service contains the business logic for user authentication, including user registration, login, and email verification.

`users.service.ts`: This service, although not provided in the code you shared, likely handles user-related operations such as fetching user data.

`user-notifications.service.ts`: This service manages user notifications, including creating and retrieving notifications.

### Repositories
`users.repo.ts`: This repository, not explicitly mentioned in your code, is likely used to interact with the database and perform CRUD operations on user data.

## API Endpoints
The API exposes the following endpoints:

- `/api/auth/login`: POST - User login
- `/api/auth/register`: POST - User registration
- `/api/auth/emails/verify`: GET - Verify user email
- `/api/users/:userId/notifications`: GET - Get user notifications
- `/api/users/:userId/notifications`: POST - Create user notification


