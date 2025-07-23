from flask import Flask, request, send_file, jsonify
from rembg import remove
from PIL import Image
import io
import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from segment_anything import sam_model_registry, SamPredictor
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

# Load YOLOv8 model
yolo_model = YOLO('yolov8n.pt')  # Make sure the file is available

# Load SAM model
sam = sam_model_registry["vit_b"](checkpoint="sam_vit_b.pth")
predictor = SamPredictor(sam)
device = "cuda" if torch.cuda.is_available() else "cpu"
sam.to(device)

@app.route('/remove_background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return 'No image uploaded', 400

    image_file = request.files['image']
    input_image = Image.open(image_file.stream).convert("RGBA")
    output_image = remove(input_image)

    byte_io = io.BytesIO()
    output_image.save(byte_io, 'PNG')
    byte_io.seek(0)
    return send_file(byte_io, mimetype='image/png')

@app.route('/generate_cutouts', methods=['POST'])
def generate_cutouts():
    if 'image' not in request.files:
        return 'No image uploaded', 400

    image_file = request.files['image']
    img_pil = Image.open(image_file.stream).convert("RGB")
    img_np = np.array(img_pil)

    # Run YOLOv8 to detect people
    results = yolo_model(img_np)
    boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)
    classes = results[0].boxes.cls.cpu().numpy().astype(int)

    # Filter only "person" class (class 0 in COCO)
    person_boxes = [box for box, cls in zip(boxes, classes) if cls == 0]

    if len(person_boxes) == 0:
        return jsonify({"cutouts": []})  # No people found

    # Set SAM image
    predictor.set_image(img_np)

    cutouts = []
    for i, box in enumerate(person_boxes):
        x0, y0, x1, y1 = box
        input_box = np.array([x0, y0, x1, y1])

        masks, scores, _ = predictor.predict(box=input_box, multimask_output=False)
        mask = masks[0]

        # Create cutout
        cutout = np.zeros_like(img_np, dtype=np.uint8)
        cutout[mask] = img_np[mask]
        cutout_pil = Image.fromarray(cutout)

        # Convert to base64 to send to frontend
        buffer = io.BytesIO()
        cutout_pil.save(buffer, format="PNG")
        base64_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
        cutouts.append(base64_image)

    return jsonify({"cutouts": cutouts})

if __name__ == '__main__':
    app.run(debug=True)
