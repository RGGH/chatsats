import requests

url = "http://127.0.0.1:5000/preimages"

# Dummy data
data = {"preimage": "dummydata"}

# Send POST request
response = requests.post(url, json=data)

# Check response
if response.status_code == 200:
    print("Preimage created successfully")
else:
    print("Error:", response.text)
