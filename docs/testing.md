# REST API Testing

### Prerequisites
Before you begin testing the API, ensure that you have the following prerequisites:
- Postman installed on your system.
- The iGP Auth API server running locally or on a remote server with the necessary environment variables configured.


### API Endpoints
#### Authentication
Authenticate User
- Endpoint: POST /api/auth/login
- Description: Authenticate a user by providing their email and password.
- Request Body:

```json
{
  "email": "john.doe@mail.com",
  "password": "password"
}
```

- Responses:
    - 200 OK: User authenticated successfully.
    - 401 Unauthorized: Invalid email or password.


Register User
- Endpoint: POST /api/auth/register
- Description: Register a new user by providing their username, email, password, and confirmation password.
- Request Body:
```json
{
  "username": "johndoe",
  "email": "john.doe@mail.com",
  "password": "password",
  "confirmPassword": "password"
}
```
- Responses:
    - 204 No Content: User registered successfully.
    - 400 Bad Request: Registration failed.

Verify User Email
- Endpoint: GET /api/auth/emails/verify
- Description: Verify a user's email using their User ID and verification token.
- Query Parameters:
    - userId (string, required): User ID for verification.
    - token (string, required): Verification token.
- Responses:
    - 303 See Other: Email verified successfully.
    - 404 Not Found: User not found.
    - 409 Conflict: Email already verified or invalid verification code.


### Testing with Postman
1. Open Postman.
2. Import the collection by clicking "Import" and selecting the provided Postman collection file.
3. Select the "iGP Auth API" collection on the left panel.
4. Choose the desired request under each endpoint (e.g., "Authenticate User," "Register User," "Verify User Email").
5. Set the necessary request parameters and body.
6. Click the "Send" button to make the request.
7. Review the response in the "Response" panel to verify the API's behavior.
8. Repeat the process for other endpoints as needed.

### Auth Flow
1. After makin a POST request to /api/auth/register
2. in the app console you'll be able to see the email verification url, you can open that in the browser
- in this case it'll verify your email and redirect you to a static confirm email page (/api/pages/confirm-email) but because of some weird build script behaviour on my PC i've stopped using this page and opened the  `index.html` file locally
- copy the `userId` and `token` url params for websocket testing
3. if you have clicked the url test the `/api/auth/login` endpoint
- in postman, this will automatically store the `userId` and `token` to the postman collection environment which will enable you to make requests to 
    - GET `/api/users/:userId/notifications` --> get user notifications
    - POST `/api/users/:userId/notifications` --> create user notification




# Websockets Testing

### Overview
The `UserNotificationGateway` serves as a bridge between the client and the server, enabling real-time communication through websockets. The primary goal of this gateway is to manage user notifications.

The client (in this case, `index.html`) provides a visual interface for users to interact with the websocket. This guide will illustrate how the client and server interact via the websocket to send and receive notifications.

Websocket Initialization
The `UserNotificationGateway` initializes the websocket using the Socket.io library. Upon connection, it expects a JWT (JSON Web Token) for authentication, which is used to identify the user. Here are the steps involved in the authentication process:
- The client sends a JWT as a query parameter when initiating a websocket connection.
- The `UserNotificationGateway` middleware intercepts this connection attempt.
- The JWT is verified, and if it's valid, the user ID is extracted from it.
- If the JWT is invalid or missing, an error is emitted back to the client.


### Client-Side Setup
1. Dependencies: The client uses the Socket.io client library to establish a websocket connection. It also uses the Tailwind CSS framework for styling.
2. Initialization: When the page is loaded, it retrieves the user ID and authentication token from the URL parameters. This token is used to authenticate the websocket connection.
3. Websocket Events:
- Upon successfully establishing a connection, the client listens for the new-notification event to receive new notifications.
- It also listens for error events such as authentication-error, authorization-error, and validation-error to handle any issues that might arise during the communication.


### How to Test
1. Start the Server: Ensure that the server running the UserNotificationGateway is up and running.
2. Open the Client: Navigate to the index.html file in your browser. Ideally, it should be served via a local server or a hosting platform for correct behavior.
3. Provide User ID and Token: To initiate a websocket connection, the client requires a user ID and an authentication token. Append these as URL parameters like so: index.html?userId=YOUR_USER_ID&token=YOUR_AUTH_TOKEN.
4. Use the Interface:
- Click on the "Notify Me" button to send a request to create a new notification.
- If the notification is successfully created on the server-side, it will be sent back to the client through the websocket and displayed in the "Your Notifications" section.
- Any errors encountered will be shown in the "Errors" section.


### Important Notes
- Ensure that the server's origin (baseURL in the client script) is set correctly. For local testing, it's set to http://localhost:3000.
- The client's websocket connection uses the JWT for authentication. This token needs to be valid and correctly formed to pass the server's authentication middleware.
