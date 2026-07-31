# Jobnetic

> AI-powered job search platform for students and freshers: find jobs that fit you, not just your keywords.

![Status](https://img.shields.io/badge/status-in%20development-brightgreen)
![Stack](https://img.shields.io/badge/stack-MERN-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What is Jobnetic?

Jobnetic is a full-stack AI-powered job search platform built for college students and freshers navigating placement season. Instead of manually browsing LinkedIn, Naukri, and company portals separately, Jobnetic centralizes job discovery, ranks opportunities by how well they match your profile, and uses AI to generate tailored cover letters and resume suggestions in one dashboard.

---

## Features

- **AI Match Score** - every job gets a match percentage based on your resume and skills
- **Resume Parser** - upload your PDF resume and extract resume text automatically
- **Cover Letter Generator** - n8n + Gemini generate a cover letter tailored to each job
- **Resume Tailor** - n8n + Gemini suggest specific resume changes for each role
- **Gap Analysis** - n8n + Gemini identify missing skills for a job
- **Application Tracker** - Kanban board to track every application stage (Saved, Applied, Interview, Offer)
- **Daily Job Alerts** - n8n sends email when a high-match job appears
- **Job Fetching** - Express fetches JSearch jobs and deduplicates them in MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| User/Auth Database | MongoDB Atlas (Mongoose) |
| Jobs Database | MongoDB Atlas |
| Profile/Preferences Database | Supabase (PostgreSQL) |
| Authentication | JWT (custom implementation) |
| AI Pipeline | n8n webhooks + Google Gemini Flash API |
| Automation | n8n for Gemini workflows and email alerts |
| Job Data Source | JSearch API (RapidAPI) |
| File Storage | Supabase Storage |
| Deployment | Vercel (frontend) + Render (backend) |

---

## System Architecture

```txt
React Frontend (Vite)
        |
        v
Express REST API
        |
        +--> MongoDB Atlas
        |       - users
        |       - job listings
        |
        +--> Supabase
        |       - profiles
        |       - preferences
        |       - applications
        |       - notifications
        |       - resume storage
        |
        +--> n8n webhooks
                - Gemini cover letter
                - Gemini resume tailor
                - Gemini gap analysis
                - email alerts
```

---

## n8n Workflows

| Workflow | Trigger | Description |
|---|---|---|
| Cover Letter Generator | Webhook | Resume + job description -> Gemini Flash -> cover letter |
| Resume Tailor | Webhook | Resume + job description -> Gemini Flash -> suggested edits |
| Gap Analyzer | Webhook | Resume + job description -> Gemini Flash -> missing skills and bullet points |
| Alert Sender | Daily cron | Finds high-match users and sends email notifications |

---

## Project Structure

```txt
jobnetic/
|-- client/                    # React frontend
|   `-- src/
|       |-- components/
|       |   |-- Navbar.jsx
|       |   `-- JobCard.jsx
|       |-- pages/
|       |   |-- LandingPage.jsx
|       |   |-- Login.jsx
|       |   |-- Register.jsx
|       |   |-- Onboarding.jsx
|       |   `-- Dashboard.jsx
|       |-- context/           # Auth context
|       |-- hooks/
|       |-- services/          # Axios API layer
|       `-- utils/
|-- server/                    # Express backend
|   |-- config/
|   |   |-- db.js              # MongoDB connection
|   |   |-- supabase.js        # Supabase client
|   |   `-- jsearch.js         # JSearch API client
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- profileController.js
|   |   `-- jobController.js
|   |-- middleware/
|   |   |-- authMiddleware.js  # JWT protect
|   |   `-- upload.js          # Multer PDF upload
|   |-- models/
|   |   |-- User.js            # Mongoose user schema
|   |   `-- Job.js             # Mongoose job schema
|   `-- routes/
|       |-- authRoutes.js
|       |-- profileRoutes.js
|       `-- jobRoutes.js
`-- README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Supabase account
- n8n account
- Google Gemini API key
- RapidAPI account with JSearch API access

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/swayam-248/jobnetic.git
cd jobnetic
```

**2. Set up the backend**

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

**3. Set up the frontend**

```bash
cd client
npm install
cp .env.example .env
# Add VITE_API_URL=http://localhost:5000/api
npm run dev
```

**4. Verify setup**

```txt
GET http://localhost:5000/api/health
-> { "status": "ok" }
```

---

## Environment Variables

### server/.env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JSEARCH_API_KEY=your_rapidapi_key
JSEARCH_API_HOST=jsearch.p.rapidapi.com
```

Future n8n integration will add variables like:

```env
N8N_COVER_LETTER_WEBHOOK_URL=
N8N_RESUME_TAILOR_WEBHOOK_URL=
N8N_GAP_ANALYSIS_WEBHOOK_URL=
N8N_ALERT_WEBHOOK_URL=
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Routes

### Auth

```txt
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login and get JWT
GET    /api/auth/me              Get current user (protected)
```

### Profile

```txt
POST   /api/profile/resume       Upload PDF resume to Supabase
POST   /api/profile/preferences  Save job preferences
PATCH  /api/profile/complete     Mark onboarding complete
GET    /api/profile/me           Get full profile
```

### Jobs

```txt
POST   /api/jobs/fetch           Fetch jobs from JSearch and store in MongoDB
GET    /api/jobs                 Get stored jobs with filters and pagination
```

---

## Supabase Tables

```sql
profiles      -> user_id, full_name, resume_url, parsed_resume_text, onboarding_complete
preferences   -> user_id, target_role, locations[], job_type, min_salary
applications  -> user_id, job_title, company, status, notes
notifications -> user_id, message, type, read
```

---

## Roadmap

- [x] Project setup and architecture
- [x] MongoDB Atlas + Supabase connected
- [x] JWT authentication (register/login)
- [x] Landing page (hero, stats, job card preview, how it works, alerts, CTA, footer)
- [x] Login and Register pages with auth wiring
- [x] Onboarding flow (resume upload, Supabase Storage, preferences, complete flag)
- [x] Smart login redirect based on onboarding status
- [x] JSearch API integration (fetch + store jobs in MongoDB)
- [x] Jobs dashboard with real job cards
- [x] Job filters (role, location, type) + pagination
- [x] Setup/docs consistency pass
- [ ] Job detail page with AI action placeholders
- [ ] Match score engine (resume vs job description)
- [ ] Application tracker (Kanban board)
- [ ] n8n Gemini pipeline (cover letter, resume tailor, gap analysis)
- [ ] n8n email alert workflow
- [ ] Deployment (Vercel + Render, with n8n hosted separately)

---

## Author

**Swayam Sahore**

- GitHub: [@swayam-248](https://github.com/swayam-248)
- LinkedIn: [linkedin.com/in/swayam-sahore](https://linkedin.com/in/swayam-sahore)
- LeetCode: [Swayam_Sahore](https://leetcode.com/Swayam_Sahore)

---

## License

This project is licensed under the MIT License.

---

*Built as a major project during B.E. Computer Science Engineering, Chitkara University*