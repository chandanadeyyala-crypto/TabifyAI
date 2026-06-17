from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import subprocess
import re
from pydantic import BaseModel
from database import users_collection

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
def upload_song(file: UploadFile = File(...)):

    progress_data["progress"] = 0
    progress_data["message"] = "Uploading audio..."

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    progress_data["message"] = "Starting Demucs AI separation..."

    process = subprocess.Popen(
        ["demucs", file_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    for line in process.stdout:
        print(line.strip())

        match = re.search(r"(\d+)%", line)

        if match:
            demucs_percent = int(match.group(1))

            # THIS goes directly to the circle
            progress_data["progress"] = demucs_percent
            progress_data["message"] = "Demucs separating audio..."

    process.wait()

    if process.returncode != 0:
        progress_data["progress"] = 0
        progress_data["message"] = "Demucs failed"
        raise Exception("Demucs failed")

    progress_data["progress"] = 100
    progress_data["message"] = "Demucs separation complete"

    song_name = file.filename.rsplit(".", 1)[0]
    guitar_path = f"separated/htdemucs/{song_name}/other.wav"

    progress_data["message"] = "Guitar stem extracted"

    return {
        "status": "completed",
        "guitar_file": guitar_path
    }


@app.post("/generate-tabs")
def generate_tab(file_path: str):

    progress_data["message"] = "Detecting notes..."

    cleaned_path = file_path.replace("file_path: ", "").strip()

    tabs = generate_tabs(cleaned_path)

    progress_data["message"] = "Guitar tabs generated successfully"
    progress_data["progress"] = 100

    return {
        "status": "success",
        "tabs": tabs
    }

class User(BaseModel):
    email: str
    password: str

@app.post("/signup")
async def signup(user: User):

    existing = await users_collection.find_one({
        "email": user.email
    })

    if existing:
        return {
            "status": "error",
            "message": "User already exists"
        }

    await users_collection.insert_one({
        "email": user.email,
        "password": user.password
    })

    return {
        "status": "success"
    }