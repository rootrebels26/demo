# AI Interview Coach

AI Interview Coach is a full-stack application that helps job seekers practice interviews, receive AI feedback, check resume ATS quality, and review interview history through an admin dashboard.

The project is organized so a new developer can quickly find the backend APIs, frontend screens, AI services, data models, demo material, and tests.

## System Flow

```text
User/Auth -> Interview Chat -> AI Coach -> Saved Interview -> Feedback
Resume Upload -> Text Extraction -> ATS Score -> AI Resume Analysis
Admin Dashboard -> Users / Interviews / Resumes / Analytics
```

## Repository Map

```text
backend/      Flask backend, database models, API routes, AI services, utilities
frontend/     React + Vite frontend application
docs/         Architecture, implementation notes, and development contracts
```

## Backend Map

```text
backend/
├─ app.py                 Flask application entrypoint
├─ models.py              SQLAlchemy models for users, interviews, and resumes
├─ migrate_db.py          Local database migration helper
├─ requirements.txt       Python dependencies
├─ api/
│  ├─ routes/             Flask blueprints and HTTP endpoints
├─ services/              AI, speech, and company-specific interview prompt logic
└─ utils/                 Resume parsing and ATS scoring helpers
```

Current API route modules:

```text
backend/api/routes/auth_routes.py       Login, register, current user, admin user delete
backend/api/routes/chat_routes.py       AI interview interaction and interview save
backend/api/routes/resume_routes.py     Resume upload, ATS scoring, admin resume history
backend/api/routes/feedback_routes.py   Feedback generation, history, admin analytics
```

## Frontend Map

```text
frontend/
├─ src/
│  ├─ App.jsx             Router and page composition
│  ├─ main.jsx            React entrypoint
│  ├─ pages/              Screen-level views
│  ├─ components/         Reusable UI components
│  ├─ services/           API client wrappers
│  ├─ assets/             Source-controlled frontend assets
│  └─ styles/             Global CSS
├─ public/                Static public assets
├─ package.json           Frontend dependencies and scripts
└─ vite.config.js         Vite configuration
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| Database | SQLite, SQLAlchemy |
| Auth | Flask-JWT-Extended |
| AI | Groq SDK |
| Resume parsing | PyPDF2, python-docx, pdfplumber |
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Voice | react-speech-recognition, Web Speech API |
| UI/Animation | Lucide React, Framer Motion, Three.js |

## Setup

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET_KEY=replace_with_a_long_random_secret
```

Run the backend:

```powershell
python app.py
```

Backend health check:

```text
http://localhost:5000/api/health
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Default Admin

```text
Username: admin
Password: admin123
```

## More Documentation

Start here:

```text
docs/architecture/00_project_structure.md
docs/architecture/01_system_overview.md
docs/implementation/00_development_guide.md
docs/implementation_contracts/00_backend_frontend_contract.md
```
