import requests

url = "http://127.0.0.1:5000/preimages"

# New preimage data!
data = {"preimage": "your_new_preimage"}

response = requests.post(url, data=data)

if response.status_code == 200:
    print("Preimage created successfully")
else:
    print("Error:", response.text)
