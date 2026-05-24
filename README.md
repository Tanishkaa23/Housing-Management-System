# 🏢 SocietySync - Smart Housing Management System

SocietySync is a modern, full-stack housing management system built using the MERN stack. It streamlines communication, billing, complaints, visitor tracking, and general administration for residential housing societies.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or an Atlas connection URI)

---

## 📂 Project Structure

The project is split into two main directories:
```
Housing-Management-System/
├── backend/          # Express API server with MongoDB
└── frontend/         # Vite + React Client application
```

---

## 🚀 Getting Started

To run the application locally, you will need to set up and run both the **backend** and **frontend** services.

### 1. Set Up the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the environment template file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and adjust the configuration as needed (e.g., set your MongoDB URI or PORT).

4. **Seed the Database (Optional):**
   To populate the database with default or dummy data for testing, run:
   ```bash
   npm run seed
   ```

5. **Start the backend server:**
   - **For Development (with auto-reload):**
     ```bash
     npm run dev
     ```
   - **For Production/Normal execution:**
     ```bash
     npm start
     ```
   The backend server should now be running, by default on `http://localhost:5000`.

---

### 2. Set Up the Frontend

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. Start the Vite development server
   ```bash
   npm run dev
   ```
   The frontend application should now be running, by default on `http://localhost:5173`. Open your browser and navigate to this URL to view the app!

