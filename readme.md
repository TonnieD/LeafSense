# LeafSense

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-orange)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.2.2-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Status](https://img.shields.io/badge/status-Production-brightgreen)

---

## Project Overview

LeafSense is a deep learning and natural language processing system that classifies crop leaf diseases from images and text descriptions. Trained on the PlantVillage dataset, the system covers 15 disease classes across three crop species — pepper bell, potato, and tomato — and provides targeted pesticide recommendations alongside each diagnosis.

The project was developed as a data science capstone by Group Seven and subsequently migrated to a production-grade web application. It demonstrates a complete machine learning pipeline from data ingestion and augmentation through model training, evaluation, and cloud deployment.

---

## Problem Statement

Crop diseases account for significant annual yield losses across smallholder and commercial farming alike. In many agricultural regions, access to trained agronomists is limited. Farmers routinely rely on visual inspection, which is susceptible to misidentification — particularly between disease classes with overlapping visual symptoms such as early and late blight.

Misdiagnosis carries a double cost: the incorrect pesticide fails to arrest the disease, while the financial and environmental burden of chemical application is incurred unnecessarily. Early, accurate identification is therefore a high-leverage intervention in the agricultural value chain.

LeafSense addresses this gap by providing an accessible, AI-powered diagnostic tool that can be operated from a smartphone browser, requiring either a photograph of the affected leaf or a plain-language description of observed symptoms.

---

## Dataset

**Source:** [PlantVillage dataset on Kaggle](https://www.kaggle.com/datasets/emmarex/plantdisease)

The training dataset is a subset of PlantVillage containing labelled images of healthy and diseased crop leaves. Images are organised in a flat directory structure with one folder per class.

| Property | Value |
|---|---|
| Total images | ~20,000 |
| Image size (after resize) | 128 x 128 pixels |
| Label format | Categorical (one-hot encoded) |
| Structure | Folder per class |
| Crops covered | Pepper bell, Potato, Tomato |

### Disease Classes (15)

1. Pepper bell — Bacterial Spot
2. Pepper bell — Healthy
3. Potato — Early Blight
4. Potato — Late Blight
5. Potato — Healthy
6. Tomato — Bacterial Spot
7. Tomato — Early Blight
8. Tomato — Late Blight
9. Tomato — Leaf Mold
10. Tomato — Septoria Leaf Spot
11. Tomato — Spider Mites (Two-spotted spider mite)
12. Tomato — Target Spot
13. Tomato — Yellow Leaf Curl Virus
14. Tomato — Mosaic Virus
15. Tomato — Healthy

---

## Methodology

The project follows the CRISP-DM framework across five phases:

1. **Data Loading and Preprocessing** — Images loaded via `tf.keras.utils.image_dataset_from_directory`, resized to 128x128, normalised to [0, 1].
2. **Data Augmentation** — Random horizontal and vertical flips, zoom (factor 0.2), and width/height shifts (factor 0.2) applied during training to improve generalisation.
3. **Model Building** — Two independent models developed: a sequential CNN for image classification and a Multinomial Naive Bayes pipeline for text classification.
4. **Training and Evaluation** — Adam optimiser with categorical crossentropy loss; accuracy and loss tracked over epochs; confusion matrix analysis on the held-out test set.
5. **Deployment** — FastAPI inference service on Render; Next.js frontend on Vercel.

---

## CNN Model

The image classification model is a custom sequential Convolutional Neural Network built in TensorFlow/Keras.

### Architecture

| Layer | Configuration |
|---|---|
| Conv2D | 32 filters, 3x3 kernel, ReLU |
| MaxPooling2D | 2x2 |
| BatchNormalization | — |
| Conv2D | 64 filters, 3x3 kernel, ReLU |
| MaxPooling2D | 2x2 |
| BatchNormalization | — |
| Conv2D | 128 filters, 3x3 kernel, ReLU |
| MaxPooling2D | 2x2 |
| Dropout | Rate 0.4 |
| Flatten | — |
| Dense | 256 units, ReLU |
| Dense (output) | 15 units, Softmax |

### Training Configuration

- **Optimizer:** Adam (default learning rate)
- **Loss function:** Categorical Crossentropy
- **Input shape:** (128, 128, 3)
- **Augmentation:** Random flips, zoom, width/height shift

### Results

| Metric | Score |
|---|---|
| Validation Accuracy | 95%+ |
| Test Accuracy | ~94% |
| Precision | High across most classes |
| Recall | High, with minor confusion on visually similar blight classes |
| F1 Score | Strong overall |

The confusion matrix analysis revealed that the principal source of misclassification is between early and late blight classes on tomato and potato, which share overlapping visual features at early disease stages. Healthy classes achieve near-perfect precision and recall across all three crops, indicating the model reliably distinguishes healthy tissue from diseased tissue.

The use of dropout (0.4) and data augmentation successfully constrained overfitting: training and validation accuracy curves converge without significant divergence over training epochs.

---

## NLP Model

The text classification pipeline uses a Multinomial Naive Bayes classifier with TF-IDF vectorization, implemented via scikit-learn.

### Pipeline

1. Input: raw symptom description string (e.g., "yellow spots with brown necrotic edges on lower tomato leaves")
2. TF-IDF vectorization converts the string to a weighted term-frequency matrix
3. Multinomial Naive Bayes classifier predicts the most probable disease class from 15 options
4. Predicted class label is used as a key to retrieve the pesticide recommendation from a curated lookup dictionary

### Training Data

The NLP model was trained on a synthetic dataset (`synthetic_data.csv`) containing 1,751 symptom descriptions generated from the PlantVillage class labels. Each row pairs a description with a disease class label. The synthetic approach enables full coverage of all 15 classes while acknowledging the limitation that real-world farmer language may differ from the training distribution.

### Pesticide Recommendation Lookup

A `pesticide_dict.pkl` dictionary maps each disease class name to a recommended pesticide or treatment. For healthy classes, the system returns "No treatment required". The CNN path applies a regex normalisation (`re.sub(r'[\s\-]+', '_', ...)`) to the predicted class name before lookup; the NLP path uses the raw predicted label directly, replicating the original Streamlit application behaviour exactly.

---

## Results

### CNN

- Validation accuracy exceeds 95% on the held-out validation split.
- Test accuracy reaches approximately 94% on an independent test partition.
- The model shows strong generalisation with minimal overfitting, attributable to the combination of dropout regularisation and aggressive data augmentation.
- Class-level confusion is most pronounced between tomato early blight and tomato late blight, and between tomato bacterial spot and tomato target spot — classes that share brown lesion morphology.

### NLP

- The Multinomial Naive Bayes classifier performs well on the synthetic test set.
- Performance on novel, informal descriptions depends on vocabulary overlap with the training corpus.
- Specificity of the symptom description is the strongest predictor of classification accuracy.

---

## Web Application

The production web application consists of two services:

**Image Diagnosis (/image-diagnosis)**
Users upload a leaf photograph via drag-and-drop or browse, or take a direct photo using the device camera (with front/back camera switching). The image is sent to the FastAPI inference service, which preprocesses it (RGB conversion, 128x128 resize, normalisation) and returns the predicted class, confidence score, health status, and pesticide recommendation.

**Text Diagnosis (/text-diagnosis)**
Users describe observed symptoms in a free-text field. Example prompts are provided to guide input. The description is sent to the NLP endpoint and the predicted disease class and recommendation are returned.

---

## Local Development

### Prerequisites

- Node.js 18+
- Conda (for the inference environment)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/TonnieD/LeafSense.git
cd LeafSense
```

### 2. Set up the inference service

```bash
# Create and activate the conda environment
conda env create -f inference/environment.yml
conda activate leafsense-inference

# Start the FastAPI server
cd inference
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The inference API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive API documentation.

### 3. Set up the Next.js frontend

```bash
cd web
cp ../.env.example .env.local
# Edit .env.local if your inference server runs on a different port

npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Deployment

### Inference service (Render)

1. Push the repository to GitHub.
2. Create a new Web Service on Render, pointing to this repository.
3. Set **Root Directory** to `inference`.
4. Render will detect `render.yaml` automatically. Build command: `pip install -r requirements.txt`. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Note the public URL (e.g. `https://leafsense-inference.onrender.com`).
6. Configure a cron job (e.g. via Render Cron or an external service) to ping `GET /health` every 14 minutes to prevent the free-tier service from spinning down.

### Frontend (Vercel)

1. Import the repository in the Vercel dashboard.
2. Set **Framework Preset** to **Other** and **Root Directory** to the repo root (leave blank).
3. Add environment variable: `NEXT_PUBLIC_INFERENCE_API_URL=https://leafsense-inference.onrender.com`
4. Deploy. Vercel reads `vercel.json` and routes the `web/` subdirectory as the Next.js frontend.

---

## Project Structure

```
LeafSense/
├── models/                          # Trained model artefacts
│   ├── cnn_model.keras              # CNN image classifier
│   ├── mnb_nlp_pipeline.pkl         # NLP classifier pipeline
│   └── pesticide_dict.pkl           # Pesticide recommendation lookup
├── PlantVillage/                    # Training dataset (15 class folders)
├── notebooks/
│   ├── crop.ipynb                   # CNN training notebook
│   └── crop_description.ipynb       # NLP training notebook
├── inference/                       # FastAPI inference service
│   ├── main.py                      # API endpoints and model loading
│   ├── requirements.txt             # Pinned Python dependencies
│   ├── environment.yml              # Conda environment for local dev
│   ├── .python-version              # Python 3.11
│   └── render.yaml                  # Render deployment config
├── web/                             # Next.js 14 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Home
│   │   │   ├── image-diagnosis/     # CNN diagnosis page (upload + camera)
│   │   │   ├── text-diagnosis/      # NLP diagnosis page
│   │   │   └── about/              # Project information
│   │   └── components/
│   │       ├── NavBar.tsx
│   │       └── DiagnosisResult.tsx
│   ├── package.json
│   └── tailwind.config.ts
├── synthetic_data.csv               # NLP training data
├── vercel.json                      # Vercel deployment config
├── .env.example                     # Environment variable template
└── README.md
```

---

## Known Limitations

- **Synthetic NLP training data:** The NLP model was trained on programmatically generated descriptions rather than real farmer reports. Its robustness on informal or regional language is untested.
- **PlantVillage distribution:** The dataset contains controlled laboratory images. The CNN may underperform on field photographs with complex backgrounds, poor lighting, or non-standard angles.
- **Limited crop coverage:** The system covers only three crop species. Many commercially important crops — maize, cassava, sorghum, beans — are outside the current scope.
- **Render free-tier cold starts:** Without a keep-alive cron job, the inference service may take 30–60 seconds to respond after 15 minutes of inactivity.

---

## Future Work

- Transfer learning using EfficientNet or MobileNetV3 to improve accuracy on field images
- Grad-CAM explainability overlays to highlight disease-relevant regions in predictions
- TensorFlow Lite conversion for offline mobile deployment
- Expanded crop coverage: maize, cassava, beans, sorghum
- Swahili and other East African regional language NLP support
- Real-time advisory system integration with agricultural extension services
- Fine-tuning on field-collected images to reduce domain shift from laboratory conditions
- Quantisation and pruning for edge device deployment

---

## Contributors

| Name | Role |
|---|---|
| Anthony Nganga Chege | Data Science + Production Migration |
| Diana Mayalo | Data Science |
| Aluoch Phanela | Data Science |
| Lewis Mwaki | Data Science |
| Margaret Kariuki | Data Science |

**Original project:** Group Seven Data Science Capstone  
**Production migration:** Anthony Nganga Chege