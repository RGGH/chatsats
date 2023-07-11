import requests
import json
from pprint import pprint

headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
}
#  Question 1
json_data = {
    'input': 'what is the largest land animal?',
}

response = requests.post('http://127.0.0.1:5000/chat', 
                         headers=headers, json=json_data)

decoded_content = response.content.decode("utf-8")
dc = json.loads(decoded_content)
pprint(dc)

# Follow up Question
json_data = {
    'input': 'how colour is it?',
}
response = requests.post('http://127.0.0.1:5000/chat', 
                         headers=headers, json=json_data)

decoded_content = response.content.decode("utf-8")
dc = json.loads(decoded_content)
pprint(dc)