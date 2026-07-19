# Jobnetic 🟢

> AI-powered job search platform for students and freshers — find jobs that fit you, not just your keywords.

![Status](https://img.shields.io/badge/status-in%20development-brightgreen)
![Stack](https://img.shields.io/badge/stack-MERN-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What is Jobnetic?

Jobnetic is a full-stack AI-powered job search platform built for college students and freshers navigating placement season. Instead of manually browsing LinkedIn, Naukri, and company portals separately, Jobnetic centralizes job discovery, ranks opportunities by how well they match your profile, and uses AI to generate tailored cover letters and resume suggestions — all in one dashboard.

---

## Features

- **AI Match Score** — every job gets a match percentage based on your resume and skills
- **Resume Parser** — upload your PDF resume and skills are extracted automatically
- **Cover Letter Generator** — one-click AI-generated cover letter tailored to each job
- **Resume Tailor** — AI suggests specific changes to your resume for each role
- **Gap Analysis** — see exactly which skills you're missing for a job
- **Application Tracker** — Kanban board to track every application stage (Saved → Applied → Interview → Offer)
- **Daily Job Alerts** — automated email when a high-match job appears
- **Automated Job Fetching** — n8n workflows fetch and deduplicate jobs every morning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| User Database | Supabase (PostgreSQL) |
| Jobs Database | MongoDB Atlas |
| Authentication | JWT (custom implementation) |
| AI Pipeline | Google Gemini Flash API via n8n |
| Automation | n8n workflows |
| Job Data Source | JSearch API (RapidAPI) |
| File Storage | Supabase Storage |
| Deployment | Vercel (frontend) + Render (backend) |

---

## System Architecture

```
React Frontend (Vite)
        ↓
Express REST API
        ↓
┌───────────────────────────────┐
│  Supabase (PostgreSQL)        │  ← users, profiles, preferences,
│  + pgvector                   │    applications, notifications
└───────────────────────────────┘
┌───────────────────────────────┐
│  MongoDB Atlas                │  ← job listings (fetched daily)
└───────────────────────────────┘
┌───────────────────────────────┐
│  n8n Automation               │  ← job fetch, deduplication,
│  + Gemini Flash API           │    AI cover letter, resume tailor,
│                               │    email alerts
└───────────────────────────────┘
```

---

## n8n Workflows

| Workflow | Trigger | Description |
|---|---|---|
| Job Fetcher | Daily cron | Fetches jobs from JSearch, deduplicates, stores in MongoDB |
| Alert Sender | Daily cron | Finds high-match users and sends email notifications |
| Cover Letter Generator | Webhook | Resume + JD → Gemini Flash → cover letter |
| Resume Tailor | Webhook | Resume + JD → Gemini Flash → suggested edits |
| Gap Analyzer | Webhook | Resume + JD → Gemini Flash → missing skills + bullet points |

---

## Project Structure

```
jobnetic/
├── client/                    ← React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/           ← Auth context
│       ├── hooks/
│       ├── services/          ← Axios API layer
│       └── utils/
├── server/                    ← Express backend
│   ├── config/                ← DB connections
│   ├── controllers/
│   ├── middleware/            ← JWT auth
│   ├── models/                ← Mongoose schemas
│   └── routes/
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Supabase account (free tier)
- n8n account (cloud free tier)
- Google Gemini API key
- RapidAPI account (JSearch API)

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
# Fill in your .env values (see Environment Variables section)
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

Hit the health check:
```
GET http://localhost:5000/api/health
→ { "status": "ok" }
```

---

## Environment Variables

### server/.env
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## Supabase Tables

```sql
-- profiles, preferences, applications, notifications
-- See /server/config/supabase-schema.sql for full schema
```

---

## Roadmap

- [x] Project setup and architecture
- [x] MongoDB Atlas + Supabase connected
- [x] JWT authentication (register/login)
- [x] Landing page (hero, stats, job card preview, how it works, alerts, CTA, footer)
- [x] Login and Register pages with auth wiring
- [ ] Onboarding flow (resume upload + preferences)
- [ ] Job listings dashboard
- [ ] Match score engine
- [ ] n8n job fetch workflow
- [ ] Gemini AI pipeline (cover letter, resume tailor, gap analysis)
- [ ] Application tracker (Kanban)
- [ ] Email alert system
- [ ] Deployment (Vercel + Render)

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