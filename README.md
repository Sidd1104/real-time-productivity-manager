# Real-Time Productivity Manager

A production-grade full-stack SaaS application built with the MERN stack, Redux Toolkit, and Socket.io.

## 🔗 Live Demo
- **Frontend (Application)**: [https://real-time-productivity-manager.vercel.app](https://real-time-productivity-manager.vercel.app)
- **Backend (API)**: [https://real-time-productivity-manager.onrender.com](https://real-time-productivity-manager.onrender.com)

## Features

- **Authentication**: Secure JWT-based auth with bcrypt password hashing.
- **Smart Priority Engine**: Dynamic task prioritization based on deadlines and overdue status.
- **Real-Time Updates**: Instant syncing across clients using Socket.io.
- **Analytics Dashboard**: Comprehensive insights using MongoDB aggregation pipelines.
- **Premium UI**: Modern, responsive design with glassmorphism and smooth animations.

## Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT.

## Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd SAAS
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```
Start the frontend:
```bash
npm run dev
```

## Folder Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom hooks (Socket, Auth)
│   │   ├── pages/       # Page components (Login, Register, Dashboard)
│   │   ├── store/       # Redux Toolkit slices
│   │   └── utils/       # Helpers
└── server/              # Node/Express backend
    ├── src/
    │   ├── config/      # DB and Socket config
    │   ├── controllers/ # Route handlers
    │   ├── middleware/  # Auth and Error middleware
    │   ├── models/      # Mongoose schemas
    │   ├── routes/      # API endpoints
    │   ├── services/    # Business logic (Priority Engine)
    │   └── utils/       # Error handling helpers
```
