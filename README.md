# 🩸 Blood Group Detection from Fingerprint using Deep Learning

An AI-powered **Blood Group Prediction System** built using **Python, Flask, TensorFlow/Keras, OpenCV, and Deep Learning**. The application analyzes fingerprint images and predicts the most likely blood group based on patterns learned during model training.

This project demonstrates the application of **Artificial Intelligence**, **Computer Vision**, and **Deep Learning** in biometric image analysis and healthcare-related research.

---

# 📖 Project Overview

Blood group identification traditionally requires laboratory testing using blood samples. This project explores an alternative **research-oriented approach** that investigates whether deep learning models can identify relationships between fingerprint patterns and blood groups.

Users can upload a fingerprint image through the web interface, and the trained model analyzes the image to predict the corresponding blood group.

> **⚠️ Disclaimer:** This project is intended **for educational and research purposes only**. It is **not** a medically validated method for determining blood groups and should **not** replace laboratory blood typing.

---

# 🎬 Project Demonstration

*https://youtu.be/_CPJoDdniB8?si=rBDFrmcS4lGQcUQd*

---

# ✨ Features

* 🩸 Blood group prediction from fingerprint images
* 📤 Upload fingerprint images through a web interface
* 🤖 AI-powered image classification
* ⚡ Fast prediction and inference
* 🌐 Flask-based web application
* 💻 Easy local setup
* ☁️ Ready for cloud deployment

---

# 🏗️ Prediction Workflow

```text id="sd0k7j"
        Fingerprint Image
               │
               ▼
      Image Preprocessing
               │
               ▼
      Deep Learning Model
               │
               ▼
     Blood Group Prediction
               │
               ▼
        Display Result
```

---

# 🛠️ Technology Stack

## Backend

* Python
* Flask
* OpenCV
* NumPy

## Artificial Intelligence

* TensorFlow
* Keras
* Deep Learning
* Convolutional Neural Networks (CNN)

## Frontend

* HTML5
* CSS3
* JavaScript

---

# 📂 Project Structure

```text id="5nh3jc"
Blood-Group-Detection/
│
├── model/
├── static/
├── templates/
├── app.py
├── requirements.txt
├── README.md
└── ...
```

---

# ⚙️ Environment Setup

Ensure that **Anaconda** is installed before proceeding.

## 1. Clone the Repository

```bash id="2csmjd"
git clone https://github.com/<your-github-username>/Blood-Group-Detection.git

cd Blood-Group-Detection
```

---

## 2. Create a Conda Environment

```bash id="c6tvrq"
conda create -n detect-blood-grp python=3.10
```

---

## 3. Activate the Environment

```bash id="jlwmk8"
conda activate detect-blood-grp
```

---

## 4. Install Dependencies

```bash id="jlwmk9"
pip install -r requirements.txt
```

---

## 5. Run the Application

```bash id="jlwmka"
python app.py
```

Once the Flask server starts successfully, open your browser and navigate to:

```text id="jlwmkb"
http://127.0.0.1:5000/
```

The application is now ready to analyze uploaded fingerprint images.

---

# 🚀 How to Use

1. Launch the application.
2. Open the web interface.
3. Upload a fingerprint image.
4. Wait while the AI model processes the image.
5. View the predicted blood group.

---

# 📸 Screenshots

You can add screenshots such as:

* Home Page
* Fingerprint Upload Screen
* Prediction Result
* Application Interface

---

# 🔮 Future Enhancements

* Improve prediction accuracy with larger datasets
* Multi-class confidence scores
* Explainable AI (Grad-CAM) visualizations
* REST API support
* Mobile-friendly interface
* Docker support
* Cloud deployment (AWS, Azure, GCP)
* Batch fingerprint analysis

---

# 🤝 Contributions

Contributions, feature requests, and improvements are welcome. Feel free to fork the repository and submit a Pull Request.

---

# 👨‍💻 Author

**Mandeep Kharb**

If you found this project useful, consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is intended for educational, research, and learning purposes only. It should not be used for clinical diagnosis, medical decision-making, or laboratory blood typing.
