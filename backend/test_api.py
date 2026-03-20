"""
Quick test script to verify JWT authentication API is working.
"""
import time
import subprocess
import sys

# Give the server a moment to start if needed
time.sleep(2)

try:
    import requests
except ImportError:
    print("Installing requests...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

API_URL = "http://localhost:8000"

def test_api():
    """Test the authentication API endpoints."""
    print("=" * 60)
    print("Testing FastAPI JWT Authentication System")
    print("=" * 60)
    
    # Test 1: Get root endpoint
    print("\n1. Testing root endpoint (GET /)...")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Message: {data.get('message')}")
        print(f"   Test Credentials: {data.get('test_credentials')}")
        print("   ✓ PASS")
    except Exception as e:
        print(f"   ✗ FAIL: {e}")
        return
    
    # Test 2: Sign up new user
    print("\n2. Testing sign up endpoint (POST /signup)...")
    try:
        signup_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpass123"
        }
        response = requests.post(f"{API_URL}/signup", json=signup_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Message: {data.get('message')}")
            print(f"   Username: {data.get('username')}")
            print(f"   Email: {data.get('email')}")
            print("   ✓ PASS")
        else:
            print(f"   Response: {response.json().get('detail', response.text)}")
    except Exception as e:
        print(f"   ✗ FAIL: {e}")
    
    # Test 3: Try to sign up with duplicate username
    print("\n3. Testing sign up with duplicate username (should fail)...")
    try:
        duplicate_data = {
            "username": "user1",  # Already exists
            "email": "different@example.com",
            "password": "password123"
        }
        response = requests.post(f"{API_URL}/signup", json=duplicate_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 400:
            print(f"   Error: {response.json().get('detail')}")
            print("   ✓ PASS (correctly rejected)")
        else:
            print(f"   Result: {response.text}")
    except Exception as e:
        print(f"   Note: {e}")
    
    # Test 4: Try to sign up with invalid email
    print("\n4. Testing sign up with invalid email (should fail)...")
    try:
        invalid_email_data = {
            "username": "emailtest",
            "email": "invalidemail",  # Invalid format
            "password": "password123"
        }
        response = requests.post(f"{API_URL}/signup", json=invalid_email_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 400:
            print(f"   Error: {response.json().get('detail')}")
            print("   ✓ PASS (correctly rejected)")
        else:
            print(f"   Result: {response.text}")
    except Exception as e:
        print(f"   Note: {e}")
    
    # Test 5: Login with correct credentials
    print("\n5. Testing login with correct credentials (POST /login)...")
    try:
        response = requests.post(
            f"{API_URL}/login",
            data={"username": "user1", "password": "password123"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print(f"   Token received: {token[:50]}...")
            print(f"   Token type: {token_data.get('token_type')}")
            print("   ✓ PASS")
        else:
            print(f"   ✗ FAIL: {response.text}")
            return
    except Exception as e:
        print(f"   ✗ FAIL: {e}")
        return
    
    # Test 6: Access protected route with token
    print("\n6. Testing protected route with valid token (GET /protected)...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_URL}/protected", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Message: {data.get('message')}")
            print(f"   Username: {data.get('username')}")
            print(f"   Email: {data.get('email')}")
            print("   ✓ PASS")
        else:
            print(f"   ✗ FAIL: {response.text}")
    except Exception as e:
        print(f"   ✗ FAIL: {e}")
    
    # Test 7: Access protected route without token
    print("\n7. Testing protected route without token (should fail)...")
    try:
        response = requests.get(f"{API_URL}/protected")
        print(f"   Status: {response.status_code}")
        if response.status_code == 403:
            print(f"   Error: {response.json().get('detail')}")
            print("   ✓ PASS (correctly rejected)")
        else:
            print(f"   Result: {response.text}")
    except Exception as e:
        print(f"   Note: {e}")
    
    # Test 8: Login with wrong password
    print("\n8. Testing login with wrong credentials (should fail)...")
    try:
        response = requests.post(
            f"{API_URL}/login",
            data={"username": "user1", "password": "wrongpassword"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print(f"   Error: {response.json().get('detail')}")
            print("   ✓ PASS (correctly rejected)")
        else:
            print(f"   Result: {response.text}")
    except Exception as e:
        print(f"   Note: {e}")
    
    # Test 9: Get user profile
    print("\n9. Testing user profile endpoint with token (GET /user/profile)...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_URL}/user/profile", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Username: {data.get('username')}")
            print(f"   Full Name: {data.get('full_name')}")
            print(f"   Email: {data.get('email')}")
            print("   ✓ PASS")
        else:
            print(f"   ✗ FAIL: {response.text}")
    except Exception as e:
        print(f"   ✗ FAIL: {e}")
    
    print("\n" + "=" * 60)
    print("Testing Complete!")
    print("=" * 60)
    print("\nAPI Documentation available at: http://localhost:8000/docs")
    print("Alternative docs (ReDoc) at: http://localhost:8000/redoc")

if __name__ == "__main__":
    test_api()
