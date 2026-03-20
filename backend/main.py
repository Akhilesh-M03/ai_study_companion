"""
FastAPI application with JWT authentication.
Login endpoint and protected routes.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
    Token,
    TokenData,
    UserCreate,
    UserResponse,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Initialize FastAPI application
app = FastAPI(
    title="JWT Authentication System",
    description="FastAPI with JWT token-based authentication",
    version="1.0.0"
)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Fake in-memory user database
# In production, this would be a real database
FAKE_USERS_DB = {
    "user1": {
        "username": "user1",
        "full_name": "John Doe",
        "email": "user1@example.com",
        "hashed_password": hash_password("password123"),
        "disabled": False,
    },
    "user2": {
        "username": "user2",
        "full_name": "Jane Smith",
        "email": "user2@example.com",
        "hashed_password": hash_password("securepass456"),
        "disabled": False,
    },
}


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    """
    Dependency to validate and extract user from JWT token.
    
    Args:
        token: JWT token from request header
        
    Returns:
        TokenData object containing username
        
    Raises:
        HTTPException: If token is invalid or expired (401)
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode and validate token
    token_data = decode_token(token)
    
    if token_data is None:
        raise credential_exception
    
    # Verify user exists in database
    user = FAKE_USERS_DB.get(token_data.username)
    if user is None:
        raise credential_exception
    
    return token_data


@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login endpoint to authenticate user and return JWT token.
    
    Args:
        form_data: Form data containing username and password
        
    Returns:
        Token object with access_token and token_type
        
    Raises:
        HTTPException: If credentials are invalid (401)
    """
    # Get user from fake database
    user = FAKE_USERS_DB.get(form_data.username)
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is disabled
    if user.get("disabled", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
        )
    
    # Create and return JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/signup", response_model=dict)
async def signup(user_data: UserCreate):
    """
    Sign up endpoint for new user registration.
    
    Args:
        user_data: User registration data (username, email, password)
        
    Returns:
        Success message with user information
        
    Raises:
        HTTPException: If username or email already exists (400)
    """
    # Validate username format (alphanumeric, 3-20 characters)
    if not user_data.username or len(user_data.username) < 3 or len(user_data.username) > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be 3-20 characters long"
        )
    
    # Check if username already exists (case-insensitive)
    if user_data.username.lower() in [u.lower() for u in FAKE_USERS_DB.keys()]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Validate email format (basic validation)
    if not user_data.email or "@" not in user_data.email or "." not in user_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address"
        )
    
    # Check if email already exists (case-insensitive)
    if any(u["email"].lower() == user_data.email.lower() for u in FAKE_USERS_DB.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password strength (minimum 6 characters)
    if not user_data.password or len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Create new user in database
    hashed_password = hash_password(user_data.password)
    FAKE_USERS_DB[user_data.username] = {
        "username": user_data.username,
        "full_name": user_data.username.title(),  # Use username as display name for now
        "email": user_data.email,
        "hashed_password": hashed_password,
        "disabled": False,
    }
    
    return {
        "message": "User registered successfully",
        "username": user_data.username,
        "email": user_data.email,
        "status": "active"
    }


@app.get("/protected")
async def protected_route(current_user: TokenData = Depends(get_current_user)):
    """
    Protected route that requires valid JWT token.
    
    Args:
        current_user: Current authenticated user from JWT token
        
    Returns:
        JSON response with user information
    """
    user = FAKE_USERS_DB.get(current_user.username)
    return {
        "message": f"Hello, {user['full_name']}!",
        "username": current_user.username,
        "email": user["email"]
    }


@app.get("/user/profile")
async def get_user_profile(current_user: TokenData = Depends(get_current_user)):
    """
    Get current user profile information.
    
    Args:
        current_user: Current authenticated user from JWT token
        
    Returns:
        User profile information
    """
    user = FAKE_USERS_DB.get(current_user.username)
    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "email": user["email"],
        "disabled": user["disabled"]
    }


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "JWT Authentication API",
        "endpoints": {
            "signup": "POST /signup - Register new user (username, email, password)",
            "login": "POST /login - Authenticate user and get JWT token",
            "protected": "GET /protected - Access protected route with token",
            "profile": "GET /user/profile - Get user profile",
            "docs": "GET /docs - Interactive API documentation"
        },
        "test_credentials": {
            "username": "user1",
            "password": "password123"
        },
        "signup_example": {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "mypassword123"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
