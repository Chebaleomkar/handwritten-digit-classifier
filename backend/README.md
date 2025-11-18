# ⚡ Backend - Handwritten Digit Classifier

A high-performance **FastAPI** microservice designed to serve Deep Learning models for real-time inference.

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **ML Engine**: [TensorFlow / Keras](https://www.tensorflow.org/)
- **Image Processing**: [Pillow (PIL)](https://python-pillow.org/) & [NumPy](https://numpy.org/)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI)

## ⚙️ Architecture & Logic

The backend pipeline is optimized for low-latency inference:

1.  **Ingestion**: Receives a JSON payload containing a Base64 encoded image string.
2.  **Preprocessing**:
    -   Decodes Base64 to raw bytes.
    -   Converts image to Grayscale (L mode).
    -   Resizes image to **28x28 pixels** (matching MNIST dataset dimensions).
    -   Normalizes pixel values to `[0, 1]` range.
3.  **Inference**:
    -   Reshapes data based on model type (4D tensor for CNN, flattened array for MLP).
    -   Executes forward pass through the pre-loaded Keras model.
4.  **Response**: Returns the predicted digit (0-9) and confidence score.

## 📂 Model Management

Models are loaded into memory **once** at startup to ensure fast response times for subsequent requests.
- **CNN**: Optimized for spatial pattern recognition.
- **MLP**: Standard dense neural network.

## 🚀 Setup & Run

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start API server
uvicorn backend.main:app --reload
```

The API will be live at [http://localhost:8000](http://localhost:8000).
