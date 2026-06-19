# TabifyAI

AI-powered full-stack web app that converts uploaded audio recordings into guitar tablature.

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

## Running Locally

### Backend
cd backend
.\.venv311\Scripts\Activate.ps1
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Deployment Status

The backend was deployed on Render and the frontend was deployed on Vercel. Authentication and API connectivity were configured successfully.

However, the full AI processing pipeline using Demucs and Basic Pitch requires more RAM than Render’s free instance provides. During deployment testing, the backend exceeded the 512 MB memory limit. Therefore, the full AI tab-generation pipeline is intended to run locally or on a higher-memory server.

> Note: Full AI processing works locally. Cloud deployment requires a higher-memory backend instance.
