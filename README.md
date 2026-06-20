# TabifyAI

An AI-powered fullstack web application designed to isolate guitar tracks from audio recordings and transcribe them directly into guitar tablature.

> Note: Full AI processing works locally. Cloud deployment requires a higher-memory backend instance.

## Live Demo

Frontend: https://tabify-ai.vercel.app

Backend Docs: https://tabifyai.onrender.com/docs

## Demo video
https://github.com/user-attachments/assets/2791b89d-e808-49be-9d31-a5b8c7ffc896

## Tech Stack
- React + Vite
- FastAPI
- MongoDB Atlas
- JWT Authentication
- Demucs
- Basic Pitch
- jsPDF

## Features
- User signup and login
- JWT-based authentication
- Audio upload
- AI-based audio separation
- Note detection and tab generation
- Save generated songs
- View song history
- Delete saved songs
- Download tabs as PDF
- Responsive UI

## Deployment Status

The backend was deployed on Render and the frontend was deployed on Vercel. Authentication and API connectivity were configured successfully.

The frontend is live on Vercel and the database routes function via Render. However, running deep learning models like Demucs and Basic Pitch requires heavy RAM usage that exceeds free cloud hosting tiers (e.g., Render's 512MB limit). For full transcription processing, please run the application locally using the steps below.

## Backend Setup

# Navigate to backend directory
cd backend

# Create and activate your virtual environment
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# Mac/Linux
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start the local development server
uvicorn main:app --reload

## Frontend Setup

# Navigate to frontend directory
cd ../frontend

# Install node packages
npm install

# Start the development server
npm run dev




