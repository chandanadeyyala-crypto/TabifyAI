from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import subprocess

from tabgen import generate_tabs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

progress_data = {
    "progress": 0,
    "message": "Idle"
}


@app.get("/")
def home():
    return {
        "message": "TabifyAI backend running"
    }


@app.get("/progress")
def get_progress():
    return progress_data


@app.post("/upload")
async def upload_song(file: UploadFile = File(...)):

    progress_data["progress"] = 10
    progress_data["message"] = "Uploading audio..."

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    progress_data["progress"] = 20
    progress_data["message"] = "Starting Demucs..."

    subprocess.run(
        ["demucs", file_path],
        check=True
    )

    progress_data["progress"] = 70
    progress_data["message"] = "Extracting guitar stem..."

    song_name = file.filename.rsplit(".", 1)[0]
    guitar_path = f"separated/htdemucs/{song_name}/other.wav"

    progress_data["progress"] = 80
    progress_data["message"] = "Audio separated successfully"

    return {
        "status": "completed",
        "guitar_file": guitar_path
    }


@app.post("/generate-tabs")
async def generate_tab(file_path: str):

    progress_data["progress"] = 85
    progress_data["message"] = "Detecting notes..."

    cleaned_path = file_path.replace("file_path: ", "").strip()

    tabs = generate_tabs(cleaned_path)

    progress_data["progress"] = 100
    progress_data["message"] = "Generating guitar tabs complete"

    return {
        "status": "success",
        "tabs": tabs
    }