from flask import Flask, render_template, request, jsonify, url_for
from PIL import Image
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/match', methods=['POST'])
def match():
    # Get the uploaded image files
    image1 = request.files['image1']
    image2 = request.files['image2']

    # Load the images
    img1 = Image.open(image1).convert('RGB')
    img2 = Image.open(image2).convert('RGB')

    # Convert images to OpenCV format
    cv_img1 = cv2.cvtColor(np.array(img1), cv2.COLOR_RGB2BGR)
    cv_img2 = cv2.cvtColor(np.array(img2), cv2.COLOR_RGB2BGR)

    # Load pre-trained face cascade classifier
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    # Detect faces in the images
    faces1 = face_cascade.detectMultiScale(cv_img1, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    faces2 = face_cascade.detectMultiScale(cv_img2, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Compare the number of detected faces
    match = len(faces1) > 0 and len(faces2) > 0

    return jsonify({'match': match})

if __name__ == '__main__':
    app.run(port=9000)