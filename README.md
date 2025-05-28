![ChatGPT Image May 28, 2025, 12_14_49 PM](https://github.com/user-attachments/assets/b466fa20-8f1d-420f-83a0-caf11dd8a97a)“This project is a part of a hackathon run by https://www.katomaran.com"

# 📝 Taskify - Todo Task Management Web Application

A full-stack Todo Task Management Web Application built using the **MERN** stack. This app allows users to sign in with social logins (Google, GitHub, Facebook), manage tasks through a clean UI, and securely persist their data.

---

## 🚀 Features

### 🔐 Authentication
- Sign in using **Clerk** with support for Google, GitHub, and Facebook logins.
- Secure session handling and user data storage.

### ✅ Task Management
- Create, edit, delete, and complete tasks (CRUD operations).
- Each user sees only their tasks.
- Tasks are displayed with dynamic UI updates.

### 📅 User Dashboard
- Real-time updates upon task creation or completion.
- Auto-login persistence using Clerk and session cookies.

### 🌐 Responsive UI
- Fully responsive design using **Tailwind CSS v4**.
- Clean and intuitive interface.

### 🛠 Backend (Node.js + Express)
- RESTful APIs for user authentication and task operations.
- Cookie-based session management.
- Clerk integration for user verification.

### 🗃 Database (MongoDB)
- Stores user profiles and tasks securely.

---

## 🧰 Tech Stack

| Frontend       | Backend         | Auth & Deployment     |
|----------------|-----------------|------------------------|
| React (Vite)   | Node.js, Express| Clerk (OAuth provider)|
| Tailwind CSS   | MongoDB (Mongoose)| Vercel & Render/Backend |

---

### Architecture
- https://drive.google.com/file/d/1t-IfKzZIPsEzBMAnKGeGazdcwruN1l5a/view?usp=sharing

---

### Working
- https://drive.google.com/file/d/1IY1BwLcdHjf36EYhfoNo4bcnuHFriSFh/view?usp=sharing

---


### Prerequisites:
- Node.js and npm
- MongoDB
- Clerk Project setup with your frontend & backend URLs whitelisted

### 1. Clone the repository

```bash
git clone https://github.com/your-username/taskify-mern.git
cd server
npm i
npm start

cd client
npm i
npm run dev
```

## 2.⚙️ Environment Variables Setup

### 🔐 Frontend `.env` file

Create a `.env` file in the `server/` directory:

```env
PORT=portnumber
MONGO_URI=mongouri
JWT_SECRET=jwtsecretkey
ALLOWED_ORIGINS=yoururl
```

Create a `.env` file in the `client/` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=clerkid
VITE_BACKEND_URL=deployedlink
```
