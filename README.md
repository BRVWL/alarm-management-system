# Cogvis Alarm Management System

A secure API for managing alarms from sensors, handling visualizations, and providing authentication.

> **Note:** This documentation currently focuses on the backend API. Frontend documentation will be added in future updates.

## Features

- Secure authentication with JWT tokens
- Receive alarms from sensors (UUID, timestamp, type)
- Handle JPEG image visualizations
- List alarms with pagination and filtering
- View alarm visualizations
- API documentation with Swagger

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SQLite

## Getting Started

### API Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install
   ```

3. Database Setup:
   The application uses SQLite, which is included in the dependencies. The database file will be created automatically when you start the server.

4. Create an admin user:
   ```bash
   cd server
   npm run create-admin
   ```
   This will create an admin user with the following credentials:
   - Username: `admin`
   - Password: `admin123`

### Running the API Server

1. Start the server:
   ```bash
   cd server
   npm run start:dev
   ```
   The server will run on http://localhost:3000 by default.

2. Access the API documentation:
   Open your browser and navigate to http://localhost:3000/api to access the Swagger documentation.

## API Authentication

The API uses JWT (JSON Web Token) for authentication. All endpoints except for login and register are protected and require authentication.

### How to Authenticate

1. Register a new user or use the admin account:
   - POST `/auth/register` - Register a new user
   - POST `/auth/login` - Login with existing credentials

2. Include the JWT token in your requests:
   - Add the token to the Authorization header: `Bearer <your-token>`

Example using curl:
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Use the returned token for authenticated requests
curl -X GET http://localhost:3000/alarms \
  -H "Authorization: Bearer <your-token>"
```

## API Endpoints

The API provides the following main endpoints:

- **Auth**: User registration, login, and profile management
- **Alarms**: CRUD operations for alarms
- **Visualizations**: Upload and retrieve visualizations
- **Sensors**: Manage sensor data

For detailed API documentation, please refer to the Swagger documentation at http://localhost:3000/api when the server is running.

## API Development

### Project Structure

```
cogvis-assignment/
├── client/             # Frontend application (to be documented later)
├── server/             # Backend API
│   ├── src/
│   │   ├── alarms/     # Alarms module
│   │   ├── auth/       # Authentication module
│   │   ├── config/     # Configuration files
│   │   ├── sensors/    # Sensors module
│   │   ├── visualizations/ # Visualizations module
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts     # Application entry point
│   ├── uploads/        # Directory for uploaded files
│   └── package.json    # Server dependencies
└── package.json        # Root dependencies
```

### Environment Variables

The API supports the following environment variables:

- `PORT`: The port on which the server will run (default: 3000)
- `JWT_SECRET`: Secret key for JWT token generation (default: 'your-secret-key')

For production, it's recommended to set these variables in a `.env` file or through your deployment environment.

## API Troubleshooting

### Authentication Issues

If you're having trouble logging in with the admin credentials:

1. Verify the database was created properly:
   ```bash
   # Check if the database file exists
   ls -la db.sqlite
   ```

2. Recreate the admin user:
   ```bash
   # Run the create-admin script again
   npm run create-admin
   ```
   
   If you see "Admin user already exists", you can try to delete the database and recreate it:
   ```bash
   # Remove the database file
   rm db.sqlite
   
   # Start the server to recreate the database schema
   npm run start:dev
   
   # In another terminal, create the admin user
   npm run create-admin
   ```

3. Check the login request format:
   Make sure your login request is properly formatted:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

4. Verify the server logs for any errors during authentication.

### Using Swagger UI for Authentication

If you're having trouble logging in via Swagger UI:

1. Navigate to http://localhost:3000/api in your browser
2. Expand the "Auth" section in the Swagger UI
3. Find and click on the `POST /auth/login` endpoint
4. Click the "Try it out" button
5. In the Request Body, ensure the JSON is formatted exactly as follows:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
6. Click "Execute"
7. If successful, you'll receive a response with a status code of 201 and a JSON object containing an `accessToken`
8. Copy the `accessToken` value (without the quotes)
9. Click the "Authorize" button at the top of the Swagger UI page
10. In the popup dialog, enter the token in the format: `your_token_here`
11. Click "Authorize" and then "Close"
12. Now you should be able to access protected endpoints

Common Swagger UI authentication issues:
- Make sure there are no extra spaces in the username or password
- Ensure the JSON is properly formatted in the request body
- Verify that the server is running and the database has been properly initialized
- If you get a 401 Unauthorized response, your token may have expired or is invalid

### SQLite Issues on M1/M2 Mac

If you encounter issues with SQLite on M1/M2 Mac, follow these steps:

1. Install SQLite via Homebrew:
   ```bash
   brew install sqlite3
   ```

2. Set compiler flags:
   ```bash
   export LDFLAGS="-L/opt/homebrew/opt/sqlite/lib"
   export CPPFLAGS="-I/opt/homebrew/opt/sqlite/include"
   export PKG_CONFIG_PATH="/opt/homebrew/opt/sqlite/lib/pkgconfig"
   ```

3. Clean install dependencies:
   ```bash
   rm -rf node_modules
   npm cache verify
   npm install sqlite3
   ```
