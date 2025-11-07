import requests

# Login as editor
login_url = "http://localhost:8080/api/auth/login"
login_data = {
    "email": "editor@example.com",
    "password": "password123"
}

response = requests.post(login_url, json=login_data)
if response.status_code == 200:
    token = response.json()["token"]
    print(f"✓ Login successful")
    
    # Try to download paper
    headers = {"Authorization": f"Bearer {token}"}
    download_url = "http://localhost:8080/api/editor/papers/1/download"
    
    download_response = requests.get(download_url, headers=headers)
    print(f"Download status: {download_response.status_code}")
    
    if download_response.status_code == 200:
        print(f"✓ Download successful! Size: {len(download_response.content)} bytes")
        print(f"Content-Type: {download_response.headers.get('Content-Type')}")
    else:
        print(f"✗ Download failed: {download_response.text}")
else:
    print(f"✗ Login failed: {response.text}")
