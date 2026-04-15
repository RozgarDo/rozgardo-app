# RozgarDo - Job Marketplace App for Blue Collar Employee

A full-stack job marketplace application built with React, Node.js, and Supabase, optimized for Vercel deployment.

## 🚀 Project Structure

- **/frontend**: React + Vite application.
- **/backend**: Serverless Node.js functions (Vercel compatible).
- **vercel.json**: Main configuration for monorepo routing.

## 🛠️ Local Development

### 1. Prerequisites
- Node.js (v18+)
- Vercel CLI (`npm i -g vercel`)

### 2. Setup
Clone the repository and install dependencies in both folders:
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 3. Running Locally
To run both the frontend and serverless functions locally, use the Vercel CLI from the root:
```bash
vercel dev
```
Alternatively, run them separately:
- **Frontend**: `cd frontend && npm run dev` (Runs on http://localhost:5173)
- **Backend**: `cd backend && node server.js` (Runs on http://localhost:5001)

## 📦 Deployment on Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
3. Import your repository.
4. Vercel will automatically detect the `vercel.json` and configure:
   - Frontend at `/`
   - Backend APIs at `/_/backend/`
5. Add your Supabase environment variables in the Vercel Dashboard.

## 📝 API Endpoints (Serverless)
- `GET /_/backend/jobs`: Returns a list of jobs.
- `POST /_/backend/login`: Handles user authentication.
