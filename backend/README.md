# FastAPI JWT Authentication System

A complete JWT-based authentication system built with FastAPI, featuring secure password hashing with bcrypt and JWT token generation with python-jose.

## Features

✅ **User Authentication** - Login with username and password  
✅ **JWT Tokens** - Secure token-based authentication with 30-minute expiry  
✅ **Password Hashing** - Bcrypt-based password hashing with passlib  
✅ **Protected Routes** - OAuth2 password bearer security scheme  
✅ **Error Handling** - Proper HTTP 401 responses for invalid credentials  
✅ **Clean Code** - Well-structured, documented, and maintainable code  

## Installation

1. **Create a virtual environment** (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the development server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

### Interactive Documentation
Access the interactive Swagger UI at: `http://localhost:8000/docs`

## Test Credentials

Use these credentials to test the API:

```
Username: user1
Password: password123
```

or

```
Username: user2
Password: securepass456
```

## API Endpoints

### 1. Sign Up Endpoint
**POST** `/signup`

Request (JSON):
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "mypassword123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "username": "newuser",
  "email": "newuser@example.com",
  "status": "active"
}
```

**Validation Rules:**
- Username: 3-20 characters, must be unique
- Email: Valid email format, must be unique
- Password: Minimum 6 characters

**Error Responses:**
- `400 Bad Request` - Username/email already exists, invalid format, or password too short
- Example: `{"detail": "Username already exists"}`

### 2. Login Endpoint
**POST** `/login`

Request (form-data):
```
username: user1
password: password123
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Protected Route
**GET** `/protected`

Headers:
```
Authorization: Bearer <access_token>
```

Response:
```json
{
  "message": "Hello, John Doe!",
  "username": "user1",
  "email": "user1@example.com"
}
```

### 4. Get User Profile
**GET** `/user/profile`

Headers:
```
Authorization: Bearer <access_token>
```

Response:
```json
{
  "username": "user1",
  "full_name": "John Doe",
  "email": "user1@example.com",
  "disabled": false
}
```

### 5. API Info
**GET** `/`

Response:
```json
{
  "message": "JWT Authentication API",
  "endpoints": {...},
  "test_credentials": {...},
  "signup_example": {...}
}
```

## File Structure

```
.
├── main.py              # FastAPI application and routes
├── auth.py              # Authentication utilities
├── requirements.txt     # Project dependencies
└── README.md           # This file
```

## Code Components

### auth.py
Contains all authentication logic:
- `hash_password()` - Hash passwords using bcrypt
- `verify_password()` - Verify password against hash
- `create_access_token()` - Generate JWT token with 30-minute expiry
- `decode_token()` - Validate and decode JWT token
- `Token` - Pydantic model for token response
- `TokenData` - Pydantic model for token payload

### main.py
FastAPI application with:
- In-memory user database (fake data for demo)
- `/login` endpoint for authentication
- `/protected` protected route requiring token
- `/user/profile` user profile endpoint
- `get_current_user()` dependency for token validation
- OAuth2PasswordBearer security scheme

## Security Notes

⚠️ **Production Deployment:**
1. Change `SECRET_KEY` in `auth.py` to a strong, secret value
2. Use environment variables for sensitive config
3. Replace in-memory database with a real database
4. Enable HTTPS/TLS in production
5. Add rate limiting to prevent brute force attacks
6. Consider implementing token refresh mechanism

## Testing with cURL

### Sign Up (Register New User):
```bash
curl -X POST "http://localhost:8000/signup" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"newuser\",\"email\":\"newuser@example.com\",\"password\":\"password123\"}"
```

### Login:
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user1&password=password123"
```

### Access Protected Route:
```bash
curl -X GET "http://localhost:8000/protected" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Responses

When credentials are invalid or token is expired:
```
Status Code: 401 Unauthorized

{
  "detail": "Incorrect username or password"
}
```

Or for invalid tokens:
```
Status Code: 401 Unauthorized

{
  "detail": "Could not validate credentials"
}
```

## Technologies Used

- **FastAPI** - Modern, fast web framework for Python
- **Uvicorn** - ASGI server for running FastAPI
- **python-jose** - JWT token creation and validation
- **passlib** - Password hashing library
- **bcrypt** - Cryptographic hashing algorithm
- **Pydantic** - Data validation using Python type annotations

## License

MIT

## Support

For issues or questions, refer to the official documentation:
- FastAPI: https://fastapi.tiangolo.com/
- python-jose: https://github.com/mpdavis/python-jose
- passlib: https://passlib.readthedocs.io/
