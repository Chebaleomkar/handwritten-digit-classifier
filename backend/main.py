from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np 
import base64
from io import BytesIO
from PIL import Image
import json     
import os 
from backend.custom_metrics import f1

app = FastAPI(title="Handwritten Digit Recognizer")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model metadata (model_info.json)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_META_PATH = os.path.join(BASE_DIR, "model_info.json")

print(f"Loading model metadata from: {MODEL_META_PATH}")
try:
    with open(MODEL_META_PATH) as f:
        MODEL_META = json.load(f)
except FileNotFoundError:
    print(f"ERROR: model_info.json not found at {MODEL_META_PATH}")
    MODEL_META = {"models": []}

# load models into memory on startup
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODELS = {}
for m in MODEL_META["models"]:
    path = os.path.join(MODEL_DIR, m["file"])
    print(f"Loading model: {m['name']} from {path}")
    try:
        MODELS[m['name']] = tf.keras.models.load_model(path, custom_objects={'f1': f1})
        print(f"Successfully loaded {m['name']}")
    except Exception as e:
        print(f"Error loading {m['name']}: {e}")

class PredictRequest(BaseModel):
    image_base64: str

def preprocess_base64_to_28x28(img_b64: str) -> np.ndarray:
    # remove data prefix if present
    if "," in img_b64:
        img_b64 = img_b64.split(",", 1)[1]
    img_data = base64.b64decode(img_b64)
    img = Image.open(BytesIO(img_data)).convert("L")  # grayscale
    
    # Handle Pillow version differences for resampling
    if hasattr(Image, "Resampling"):
        resample_method = Image.Resampling.LANCZOS
    else:
        resample_method = Image.ANTIALIAS
        
    img = img.resize((28,28), resample_method)
    arr = np.array(img).astype("float32") / 255.0
    # For CNN: shape (1,28,28,1); for MLP: flatten (1,784)
    return arr

@app.get("/model_info")
def model_info():
    return MODEL_META

@app.post("/predict/{model_name}")
def predict(model_name: str, req: PredictRequest):
    model_name = model_name.lower()
    if model_name not in MODELS:
        raise HTTPException(status_code=404, detail="Model not found")
    arr = preprocess_base64_to_28x28(req.image_base64)
    if model_name == "cnn":
        x = arr.reshape(1,28,28,1)
    else:  # mlp
        x = arr.reshape(1,784)
    preds = MODELS[model_name].predict(x)
    pred_class = int(np.argmax(preds, axis=1)[0])
    confidence = float(np.max(preds, axis=1)[0])
    return {"prediction": pred_class, "confidence": confidence}