import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import numpy as np
import os
import io
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS

# --- 1. CONFIGURATION & MODEL LOADING ---

# This MUST match the order your model was trained on
CLASS_NAMES = ['MildDemented', 'ModerateDemented', 'NonDemented', 'VeryMildDemented']
MODEL_FILENAME = 'alzheimers_efficientnet_model.keras'
IMAGE_SIZE = (224, 224)

app = Flask(__name__)
# --- HERE IS THE KEY ---
# This line allows your frontend (running on a different port)
# to make requests to your backend.
CORS(app) 

model = None

def load_model_on_startup():
    """Load the Keras model into memory on startup."""
    global model
    model_path = os.path.join(os.path.dirname(__file__), MODEL_FILENAME)
    
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        print("Please place your .keras file in the 'backend' folder.")
        model = None
    else:
        try:
            # --- Use the Functional API model ---
            model = tf.keras.models.load_model(model_path, compile=False)
            print(f"--- Model {MODEL_FILENAME} loaded successfully ---")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None

def predict_image(image_bytes):
    """
    Takes image bytes, preprocesses them, and returns the
    predicted class and confidence.
    """
    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
        img = pil_image.resize(IMAGE_SIZE)
        
        if img.mode == 'L': # Handle grayscale
            img = img.convert('RGB')
        
        img_array = np.array(img)
        img_batch = np.expand_dims(img_array, axis=0)
        img_preprocessed = preprocess_input(img_batch)
        
        predictions = model.predict(img_preprocessed)
        
        confidence = float(np.max(predictions[0]))
        predicted_index = int(np.argmax(predictions[0]))
        predicted_class = CLASS_NAMES[predicted_index]
        
        return predicted_class, confidence
    
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None, None

# --- 2. FLASK API ROUTES ---

@app.route('/', methods=['GET'])
def index():
    """A simple route to confirm the API is running."""
    return jsonify({"message": "Alzheimer's API is running!"})

@app.route('/predict', methods=['POST'])
def handle_prediction():
    """Handles the image upload and model prediction."""
    if model is None:
        return jsonify({"error": "Model is not loaded."}), 500
        
    if 'file' not in request.files:
        return jsonify({"error": "No 'file' part in the request."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    if file:
        try:
            image_bytes = file.read()
            predicted_class, confidence = predict_image(image_bytes)
            
            if predicted_class is None:
                 return jsonify({"error": "Failed to process image."}), 500
                 
            # Return a successful JSON response
            return jsonify({
                "class": predicted_class,
                "confidence": confidence
            })
            
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# --- 3. RUN THE APP ---
if __name__ == "__main__":
    # Load the model once on startup
    load_model_on_startup()
    # Run the Flask app on port 5000
    app.run(debug=True, host='0.0.0.0', port=5000)
