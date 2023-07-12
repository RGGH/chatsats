import requests
import json

url = "http://127.0.0.1:5000/preimages"

# New preimage data
data = {"preimage": "your_new_preimage"}

headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(data), headers=headers)

if response.status_code == 200:
    print("Preimage created successfully")
else:
    print("Error:", response.text)
