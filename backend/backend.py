from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS  # You'll need to install this: pip install flask-cors
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
model = load_model("CNN.h5")
IMG_SIZE = 100
CATEGORIES = os.listdir("data")

# Ensure directories exist
os.makedirs('static/uploads', exist_ok=True)
os.makedirs('static/processed', exist_ok=True)

# In-memory storage for patient history (in a real app, use a database)
patient_history = []

def prepare_image(filepath):
    try:
        img_array = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        clahe = cv2.createCLAHE(clipLimit=100.0, tileGridSize=(8, 8))
        img_array = clahe.apply(img_array)
        median = cv2.medianBlur(img_array.astype('uint8'), 5)
        median = 255 - median
        _, thresh = cv2.threshold(median, 165, 255, cv2.THRESH_BINARY_INV)
        new_array = cv2.resize(thresh, (IMG_SIZE, IMG_SIZE))
        
        # Save the processed image for reference
        processed_filepath = filepath.replace('uploads', 'processed')
        cv2.imwrite(processed_filepath, new_array)
        
        # Prepare for model input
        new_array = new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 1) / 255.0
        return new_array
    except Exception as e:
        print("Error processing image:", e)
        return None

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        # Generate unique filename
        unique_filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        filepath = os.path.join('static/uploads', unique_filename)
        file.save(filepath)
        
        # Get patient info from form data
        patient_name = request.form.get('patientName', 'Unknown')
        patient_age = request.form.get('patientAge', '0')
        doctor = request.form.get('doctor', 'Unknown')
        
        # Process image
        image = prepare_image(filepath)
        
        if image is not None:
            # Make prediction
            predictions = model.predict(image)[0]
            predicted_class_index = np.argmax(predictions)
            predicted_class = CATEGORIES[predicted_class_index]
            confidence = float(predictions[predicted_class_index]) * 100
            
            # Create record for patient history
            record = {
                'id': len(patient_history) + 1,
                'patientName': patient_name,
                'age': patient_age,
                'doctor': doctor,
                'date': datetime.now().strftime('%Y-%m-%d'),
                'prediction': predicted_class,
                'confidence': f"{confidence:.2f}%",
                'imagePath': filepath
            }
            patient_history.append(record)
            
            return jsonify({
                'prediction': predicted_class,
                'confidence': f"{confidence:.2f}%",
                'imagePath': filepath
            })
        else:
            return jsonify({'error': 'Error processing image'}), 500
    
    return jsonify({'error': 'Unknown error'}), 500

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(patient_history)

@app.route('/history/<int:record_id>', methods=['GET'])
def get_history_record(record_id):
    for record in patient_history:
        if record['id'] == record_id:
            return jsonify(record)
    return jsonify({'error': 'Record not found'}), 404

@app.route('/statistics', methods=['GET'])
def get_statistics():
    if not patient_history:
        return jsonify({
            'totalScans': 0,
            'conditionDistribution': {},
            'averageConfidence': 0
        })
    
    total_scans = len(patient_history)
    
    # Calculate condition distribution
    condition_distribution = {}
    for record in patient_history:
        condition = record['prediction']
        if condition in condition_distribution:
            condition_distribution[condition] += 1
        else:
            condition_distribution[condition] = 1
    
    # Convert to percentages
    for condition in condition_distribution:
        condition_distribution[condition] = (condition_distribution[condition] / total_scans) * 100
    
    # Calculate average confidence
    total_confidence = 0
    for record in patient_history:
        confidence_value = float(record['confidence'].replace('%', ''))
        total_confidence += confidence_value
    
    average_confidence = total_confidence / total_scans if total_scans > 0 else 0
    
    return jsonify({
        'totalScans': total_scans,
        'conditionDistribution': condition_distribution,
        'averageConfidence': average_confidence
    })

@app.route('/', methods=['GET'])
def index():
    return "RetinaCare API is running. Use the React frontend to interact with it."

if __name__ == '__main__':
    app.run(debug=True, port=5000)