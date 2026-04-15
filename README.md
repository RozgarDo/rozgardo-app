# RozgarDo

A job portal application connecting employers with job seekers.

## Features

- User authentication (Admin, Employer, Employee roles)
- Job posting and management
- Application tracking
- Profile management

## Tech Stack

- **Frontend:** React, React Router, Vite
- **Backend:** Express.js, Supabase
- **Database:** PostgreSQL (via Supabase)

## Getting Started

### Prerequisites

- Node.js installed
- Supabase account with configured database

### Installation

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install
```

### Running the App

```bash
# Start backend (port 5000)
cd backend && node server.js

# Start frontend (port 5173)
cd frontend && npm run dev
```

### Seeding Database

```bash
node backend/seed.js
```

### Default Login Credentials

| Role    | Phone     | OTP    |
|---------|-----------|-------|
| Admin   | 9999999999| 123456|
| Employer| 8888888888| 123456|
| Employee| 7777777777| 123456|

## License

ISC