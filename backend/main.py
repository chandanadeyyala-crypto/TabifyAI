from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import subprocess
import re
from pydantic import BaseModel
from database import users_collection, songs_collection
from passlib.context import CryptContext
from bson import ObjectId
from tabgen import generate_tabs
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta

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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "tabifyai_secret_key_change_later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "tabifyai_secret_key_change_later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


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
        "password": pwd_context.hash(user.password)
    })

    return {
        "status": "success",
        "message": "User created successfully"
    }

@app.post("/login")
async def login(user: User):

    existing = await users_collection.find_one({
        "email": user.email
    })

    if not existing:
        return {
            "status": "error",
            "message": "User not found"
        }

    if not pwd_context.verify(
        user.password,
        existing["password"]
    ):
        return {
            "status": "error",
            "message": "Invalid password"
        }

    access_token = create_access_token({
        "sub": existing["email"]
    })

    return {
        "status": "success",
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

from datetime import datetime

class Song(BaseModel):
    fileName: str
    tabs: str


@app.post("/save-song")
async def save_song(
    song: Song,
    current_user: str = Depends(get_current_user)):
    await songs_collection.insert_one({
        "email": current_user,
        "fileName": song.fileName,
        "tabs": song.tabs,
        "createdAt": datetime.now()
    })

    return {
        "status": "success",
        "message": "Song saved successfully"
    }

@app.get("/my-songs")
async def my_songs(current_user: str = Depends(get_current_user)):

    songs_cursor = songs_collection.find({
        "email": current_user
    }).sort("createdAt", -1)

    songs = []

    async for song in songs_cursor:
        songs.append({
            "id": str(song["_id"]),
            "fileName": song["fileName"],
            "tabs": song["tabs"],
            "createdAt": str(song["createdAt"])
        })

    return {
        "status": "success",
        "songs": songs
    }

@app.delete("/delete-song/{song_id}")
async def delete_song(
    song_id: str,
    current_user: str = Depends(get_current_user)
):
    result = await songs_collection.delete_one({
        "_id": ObjectId(song_id),
        "email": current_user
    })

    if result.deleted_count == 1:
        return {
            "status": "success",
            "message": "Song deleted successfully"
        }

    return {
        "status": "error",
        "message": "Song not found"
    }