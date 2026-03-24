# TaskFlow — MERN Task Management System

A full-stack task management app built with **MongoDB, Express.js, React.js, and Node.js**.

---

## Features

- **JWT Authentication** — register, login, auto-logout on token expiry
- **Password hashing** — bcrypt with 10 salt rounds
- **Task CRUD** — create, read, toggle complete, delete
- **Progress summary** — total / pending / completed stats with progress bar
- **Overdue detection** — highlights tasks past their due date
- **Filter tabs** — view All / Pending / Completed tasks
- **Responsive UI** — works on mobile, tablet, and desktop

---

## Project Structure

```
task-management-system/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   ├── User.js          # Mongoose user schema
│   │   └── Task.js          # Mongoose task schema
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login
│   │   └── tasks.js         # GET/POST/PUT/DELETE /tasks
│   ├── server.js            # Express entry point
│   ├── package.json
│   └── .env.example         # ← copy this to .env
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── TaskCard.jsx        # Individual task card
    │   │   ├── TaskCard.css
    │   │   ├── AddTaskModal.jsx    # Modal for new tasks
    │   │   └── AddTaskModal.css
    │   ├── context/
    │   │   └── AuthContext.js      # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   ├── api.js                  # Axios instance + interceptors
    │   ├── App.jsx                 # Router + route guards
    │   ├── index.js
    │   └── index.css               # Global styles & design tokens
    ├── package.json
    └── .env.example                # ← copy this to .env
```

---

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) v16 or newer
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## Setup & Installation

### 1. Clone / download the project

```bash
# If using git
git clone <your-repo-url>
cd task-management-system
```

---

### 2. Configure the Backend

```bash
cd backend

# Install dependencies
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Open `backend/.env` in a text editor and set:

```env
MONGO_URI=mongodb://localhost:27017/taskdb   # or your Atlas URI
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
```

**Start MongoDB** (if running locally):
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows — run MongoDB as a service or:
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"

# Linux
sudo systemctl start mongod
```

**Run the backend:**
```bash
# Development (auto-restart on save)
npm run dev

# Production
npm start
```

You should see:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:5000
```

---

### 3. Configure the Frontend

```bash
# In a NEW terminal tab/window
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env
```

The default `frontend/.env` points to `http://localhost:5000/api` — no changes needed for local development.

**Run the frontend:**
```bash
npm run dev
```

The app opens at **http://localhost:5173** automatically.

---

## API Reference

All task routes require the `Authorization: Bearer <token>` header.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/register` | ❌ | Create a new user account |
| POST | `/api/login` | ❌ | Login and receive a JWT |
| GET | `/api/tasks` | ✅ | Get all tasks for the logged-in user |
| POST | `/api/tasks` | ✅ | Create a new task |
| PUT | `/api/tasks/:id` | ✅ | Update a task (status, title, etc.) |
| DELETE | `/api/tasks/:id` | ✅ | Delete a task |

### Example: Register
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'
```

### Example: Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","date":"2024-12-31"}'
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Tailwind CSS |

---

## Common Issues

**"MongoDB connection failed"**
→ Make sure MongoDB is running locally, or check your Atlas URI in `.env`.

**"No token — access denied"**
→ You're calling a protected route without a valid token. Log in first.

**Frontend shows blank page**
→ Make sure the backend is running on port 5000 before starting the frontend.

**CORS error in browser**
→ The backend has CORS enabled for all origins. If issues persist, check `server.js`.
