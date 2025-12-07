🧠 NeuroDetect: Early Detection of Alzheimer's Disease

An end-to-end Deep Learning application for the 4-class classification of Alzheimer's Disease using MRI scans.

📜 Project Overview

This project presents a robust system for automating the diagnosis of Alzheimer's Disease stages from 2D MRI scans. It utilizes a decoupled Client-Server architecture, featuring a Python Flask backend for model inference and a responsive HTML/CSS/JavaScript frontend for the user interface.

The core of the system is a fine-tuned EfficientNetB0 model, which achieved a state-of-the-art accuracy of 99.30%, outperforming other architectures like ResNet50 and DenseNet121 in a rigorous comparative study.

🔍 Key Features

Multi-Class Classification: Detects 4 stages: Non-Demented, Very Mild, Mild, and Moderate Demented.

High Accuracy: Powered by a fine-tuned EfficientNetB0 model (99.30% Test Accuracy).

Decoupled Architecture: Separate Flask API (Backend) and HTML/JS (Frontend).

Real-Time Predictions: Instant classification with confidence scores.

User-Friendly UI: Drag-and-drop file upload with a modern dark-mode interface.

📊 Model Performance (Comparative Analysis)

We trained and evaluated four different architectures on the Kaggle Alzheimer's MRI Dataset.

Model          Type              Test Accuracy F1-Score Status

EfficientNetB0 Transfer Learning 99.30%        0.99     🏆 Champion

Custom CNN     Built from Scratch 91.60%       0.91      Baseline

ResNet50       Transfer Learning  83.10%       0.82      Overfitting

DenseNet121    Transfer Learning  73.20%       0.72      Poor Generalization

🛠️ Tech Stack

Deep Learning: TensorFlow, Keras

Backend: Flask, Flask-CORS, Pillow, NumPy

Frontend: HTML5, CSS3, Vanilla JavaScript (ES6)

Tools: VS Code, Anaconda, Kaggle Kernels

⚙️ Installation & Setup Guide

Since the trained model file and the dataset are too large for GitHub, you must download them separately to run this project.

1. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME


2. Download the Model

You need the trained .keras file for the backend to work.

Download Link: [https://www.kaggle.com/code/neeraj32136/alzheimer-s-classification-using-cnn-updated]

(If you don't have a link, you can train it yourself using the train_efficientnet_functional.py script provided).

Place the file: Move the alzheimers_efficientnet_model.keras file into the backend/ folder.

3. Environment Setup (Backend)

It is recommended to use Python 3.10 or 3.11.

# Navigate to backend
cd backend

# Create virtual environment (Optional but recommended)
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt


4. Run the Application

Terminal 1: Start the Backend API

cd backend
python app.py


You should see: * Running on http://0.0.0.0:5000

Terminal 2: Start the Frontend

Open the frontend folder.

Open index.html in your browser.

(Recommended): If using VS Code, right-click index.html and select "Open with Live Server" to avoid CORS issues with local files.

🚀 Usage

Open the web app in your browser.

Drag and drop an MRI scan image (.jpg or .png) into the upload box.

Click the "Classify Scan" button.

View the predicted stage and the model's confidence score.

📂 Project Structure

├── backend/
│   ├── app.py                 # Flask API entry point
│   ├── requirements.txt       # Python dependencies
│   └── alzheimers...model.keras  # (You must add this file!)
│
├── frontend/
│   ├── index.html             # Main user interface
│   ├── style.css              # Dark mode styling
│   └── app.js                 # Client-side logic (Fetch API)
│
└── README.md                  # Project documentation


🔮 Future Scope

Integration of 3D Volumetric MRI analysis.

Adding Explainable AI (Grad-CAM) heatmaps to the UI to show doctors where the model is looking.

Deploying the system to the cloud (AWS/Azure).

📜 Credits

Dataset: Kaggle - Best Alzheimer's MRI Dataset

Base Papers: Chugh, L. (2023) "Addressing data scarcity and class imbalance in Alzheimer's".
