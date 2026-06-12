import streamlit as st
import tensorflow as tf
import numpy as np
import pickle
import joblib
from PIL import Image

# Load models and dictionary
cnn_model = tf.keras.models.load_model("cnn_model.keras")
nlp_pipeline = joblib.load("mnb_nlp_pipeline.pkl")

with open("pesticide_dict.pkl", "rb") as f:
    pesticide_dict = pickle.load(f)

# Class names for CNN prediction
cnn_class_names = [
    'Pepper_bell___Bacterial_spot',
    'Pepper_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# App title
st.title("🌿 Crop Disease Detection & Recommendation System")

# Tabs: Image | Description
tab1, tab2 = st.tabs(["📷 Image Upload (CNN)", "✏️ Text Description (NLP)"])

# ---------------- CNN TAB ----------------
with tab1:
    st.header("Upload a Crop Image")

    img_file = st.file_uploader("Choose an image", type=["jpg", "png", "jpeg"])

    if img_file:
        img = Image.open(img_file).convert("RGB")
        st.image(img, caption="Uploaded Image", use_column_width=True)

        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        try:
          # Predict
          pred = cnn_model.predict(img_array)
          pred_index = np.argmax(pred)
          pred_class = cnn_class_names[pred_index]
          st.success(f"🧠 CNN Prediction: **{pred_class}**")

          # Auto health detection
          status = "healthy" if "healthy" in pred_class.lower() else "unhealthy"
          st.info(f"🩺 Detected Crop Health Status: **{status}**")

          # Clean class name
          import re
          pred_class_clean = re.sub(r'[\s\-]+', '_', pred_class.strip())

          # Final recommendation lookup — just by class name
          recommendation = pesticide_dict.get(pred_class_clean, "❌ No recommendation found")

          # Optional: Add auto-message if healthy
          if "healthy" in pred_class_clean.lower():
              recommendation = "✅ No pesticide needed"

          st.success(f"🧪 Recommended Pesticide: **{recommendation}**")
        except Exception as e:
            st.warning(f"⚠️ Error during prediction: {e}")


# ---------------- NLP TAB ----------------
with tab2:
    st.header("Describe the Crop Issue")

    user_text = st.text_area("Enter description here (e.g., yellow spots on leaves)...")

    if st.button("Classify & Recommend"):
      if user_text.strip():
        pred_label = nlp_pipeline.predict([user_text])[0]
        st.success(f"🧠 NLP Prediction: **{pred_label}**")
        
        try:
            # Handle label like 'Tomato___healthy' directly
            recommendation = pesticide_dict.get(pred_label, "❌ No recommendation found")

            # Convert 'None' to a friendly message
            if recommendation is None or str(recommendation).lower() == "none":
                recommendation = "✅ No pesticide needed"

            st.info(f"🧪 Recommended Pesticide: **{recommendation}**")
        except Exception as e:
            st.warning(f"Unexpected prediction format or error: {e}")
    else:
        st.warning("Please enter a valid description.")

st.markdown("---")
st.caption("Created by 👩‍💻G-R-O-U-P__S-E-V-E-N👨‍💻 • Powered by CNN + NLP + Streamlit")