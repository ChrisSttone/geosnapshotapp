
# GeoSnapshot

**GeoSnapshot** is a powerful photo editing web application that allows users to:

- ✂️ Automatically remove backgrounds from images (using `rembg`)
- ❌ Remove unwanted objects from images
- 🧍‍♂️ Detect and cut out individual people from group photos using **YOLOv8** + **SAM (Segment Anything Model)**
- ⬆️ Upload and download edited files via an intuitive UI
- ⚡ Runs on a Flask backend and a React frontend

---

## 🗂️ Project Structure

```
geosnapshotapp/
├── geosnapshot-front/     # React frontend
│   ├── src/
│   └── ...
├── photo-ai-flask/        # Flask backend with YOLO + SAM
│   ├── app.py
│   └── sam_vit_b.pth (Not committed - download separately)
├── .gitignore
└── README.md
```

---

## 🚀 Features

- **Background Removal**: Powered by [`rembg`](https://github.com/danielgatis/rembg)
- **Object Removal**: Custom OpenCV-based masking and inpainting
- **Person Cutouts**: YOLOv8 detects and SAM precisely segments people
- **Gallery & Downloads**: Simple UI to view and download edited results

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ChrisSttone/geosnapshotapp.git
cd geosnapshotapp
```

---

### 2. Backend Setup (Flask)

#### ⬇️ Install dependencies

```bash
cd photo-ai-flask
pip install -r requirements.txt
```

#### 📦 Download `sam_vit_b.pth` model manually

Download the `sam_vit_b.pth` file from [Meta AI SAM Repo](https://github.com/facebookresearch/segment-anything#model-checkpoints)  
Then place it inside the `photo-ai-flask/` folder.

#### ▶️ Start the Flask server

```bash
python app.py
```

---

### 3. Frontend Setup (React)

```bash
cd ../geosnapshot-front
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## ⚠️ Notes

- The `sam_vit_b.pth` model file is **not included** due to GitHub’s file size limit (>100MB)
- All heavy models and cache data are gitignored via `.gitignore`
- Ensure you have Python 3.8+ and Node.js installed

---


## ✨ Credits

- [rembg](https://github.com/danielgatis/rembg)
- [YOLOv8](https://github.com/ultralytics/ultralytics)
- [SAM (Segment Anything)](https://github.com/facebookresearch/segment-anything)
- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)

---
