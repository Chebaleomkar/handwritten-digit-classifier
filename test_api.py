import requests
import base64
import json
import os

# Create a dummy white image 28x28
from PIL import Image
from io import BytesIO

img = Image.new('L', (28, 28), color=255)
buffered = BytesIO()
img.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode()

# Define endpoints
BASE_URL = "http://127.0.0.1:8000"

def test_model_info():
    print("Testing /model_info...")
    try:
        resp = requests.get(f"{BASE_URL}/model_info")
        if resp.status_code == 200:
            print("SUCCESS: /model_info returned 200")
            print(json.dumps(resp.json(), indent=2))
        else:
            print(f"FAILURE: /model_info returned {resp.status_code}")
            print(resp.text)
    except Exception as e:
        print(f"FAILURE: Could not connect to {BASE_URL}. Is the server running?")
        print(e)

def test_predict(model_name):
    print(f"Testing /predict/{model_name}...")
    payload = {"image_base64": img_str}
    try:
        resp = requests.post(f"{BASE_URL}/predict/{model_name}", json=payload)
        if resp.status_code == 200:
            print(f"SUCCESS: /predict/{model_name} returned 200")
            print(json.dumps(resp.json(), indent=2))
        else:
            print(f"FAILURE: /predict/{model_name} returned {resp.status_code}")
            print(resp.text)
    except Exception as e:
        print(f"FAILURE: Could not connect to {BASE_URL}")
        print(e)

if __name__ == "__main__":
    test_model_info()
    test_predict("cnn")
    test_predict("mlp")
