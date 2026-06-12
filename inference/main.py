from __future__ import annotations

import io
import os
import pickle
import re

import joblib
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Model paths — relative to the repo root (one level above inference/)
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ---------------------------------------------------------------------------
# CNN class names — verbatim from streamlit_app.py
# ---------------------------------------------------------------------------
CNN_CLASS_NAMES = [
    "Pepper_bell___Bacterial_spot",
    "Pepper_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]

# ---------------------------------------------------------------------------
# Load models at startup (deferred to lifespan below)
# ---------------------------------------------------------------------------
cnn_model = None
nlp_pipeline = None
pesticide_dict: dict = {}


def load_models() -> None:
    """Load all three model artefacts. Called once on startup."""
    global cnn_model, nlp_pipeline, pesticide_dict

    # TensorFlow is imported here so startup fails fast if TF is missing
    import tensorflow as tf  # noqa: PLC0415

    cnn_model = tf.keras.models.load_model(
        os.path.join(MODELS_DIR, "cnn_model.keras")
    )
    nlp_pipeline = joblib.load(os.path.join(MODELS_DIR, "mnb_nlp_pipeline.pkl"))

    with open(os.path.join(MODELS_DIR, "pesticide_dict.pkl"), "rb") as fh:
        pesticide_dict = pickle.load(fh)


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="LeafSense Inference API",
    description="CNN image classification and NLP text classification for crop disease detection.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    load_models()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

NO_TREATMENT = "No treatment required"


def _pesticide_for_cnn(pred_class: str) -> str:
    """
    Replicate CNN-tab pesticide lookup from streamlit_app.py exactly:
    1. Regex-clean the class name.
    2. If healthy, return NO_TREATMENT.
    3. Look up in pesticide_dict; fallback to NO_TREATMENT.
    """
    pred_class_clean = re.sub(r"[\s\-]+", "_", pred_class.strip())
    if "healthy" in pred_class_clean.lower():
        return NO_TREATMENT
    recommendation = pesticide_dict.get(pred_class_clean)
    if recommendation is None or str(recommendation).lower() == "none":
        return NO_TREATMENT
    return str(recommendation)


def _pesticide_for_nlp(pred_label: str) -> str:
    """
    Replicate NLP-tab pesticide lookup from streamlit_app.py exactly:
    1. Use the raw predicted label as the key.
    2. If healthy or None, return NO_TREATMENT.
    """
    recommendation = pesticide_dict.get(pred_label)
    if recommendation is None or str(recommendation).lower() == "none":
        return NO_TREATMENT
    if "healthy" in pred_label.lower():
        return NO_TREATMENT
    return str(recommendation)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health", summary="Health check")
async def health() -> dict:
    return {"status": "ok"}


class TextRequest(BaseModel):
    text: str


class ImagePredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    is_healthy: bool
    recommendation: str


class TextPredictionResponse(BaseModel):
    predicted_class: str
    recommendation: str


@app.post(
    "/predict/image",
    response_model=ImagePredictionResponse,
    summary="Classify a crop leaf image using the CNN model",
)
async def predict_image(file: UploadFile = File(...)) -> ImagePredictionResponse:
    if cnn_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    # Read and validate image
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc

    # Preprocess — identical to streamlit_app.py
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # shape: (1, 128, 128, 3)

    # Inference
    preds = cnn_model.predict(img_array)
    pred_index = int(np.argmax(preds))
    confidence = float(preds[0][pred_index])
    pred_class = CNN_CLASS_NAMES[pred_index]
    is_healthy = "healthy" in pred_class.lower()
    recommendation = _pesticide_for_cnn(pred_class)

    return ImagePredictionResponse(
        predicted_class=pred_class,
        confidence=confidence,
        is_healthy=is_healthy,
        recommendation=recommendation,
    )


@app.post(
    "/predict/text",
    response_model=TextPredictionResponse,
    summary="Classify crop symptoms using the NLP pipeline",
)
async def predict_text(body: TextRequest) -> TextPredictionResponse:
    if nlp_pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text must not be empty.")

    pred_label: str = nlp_pipeline.predict([text])[0]
    recommendation = _pesticide_for_nlp(pred_label)

    return TextPredictionResponse(
        predicted_class=pred_label,
        recommendation=recommendation,
    )
