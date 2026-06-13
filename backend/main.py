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
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "TabifyAI backend running"
    }


@app.post("/upload")
async def upload_song(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    subprocess.run(
        [
            "demucs",
            file_path
        ],
        shell=True
    )

    song_name = file.filename.rsplit(".", 1)[0]

    guitar_path = f"separated/htdemucs/{song_name}/other.wav"

    return {
        "status": "completed",
        "guitar_file": guitar_path
    }


@app.post("/generate-tabs")
async def generate_tab(file_path: str):

    cleaned_path = file_path.replace("file_path: ", "").strip()

    tabs = generate_tabs(cleaned_path)

    return {
        "status": "success",
        "tabs": tabs
    }
