# MERN Bug Tracker

A full-stack bug tracking application built with MongoDB, Express.js, React, and Node.js. Users can report, view, update, and delete bugs, with comprehensive testing and debugging features.

---

## 🚀 Setup

1. **Clone the repository:**  
   ```bash
   git clone <your-repo-url>
   ```

2. **Install dependencies:**  
   ```bash
   pnpm install
   cd server && pnpm install
   cd ../client && pnpm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file inside the `server/` directory with the following:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   PORT=5000
   ```

4. **Start MongoDB:**  
   ```bash
   mongod
   ```

5. **Run the application:**  
   ```bash
   pnpm start
   ```

6. **Open in browser:**  
   [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing

- **Backend tests:**  
  ```bash
  cd server && pnpm test
  ```

- **Frontend tests:**  
  ```bash
  cd client && pnpm test
  ```

- **Test Coverage:**  
  View coverage reports in:
  - `coverage/server/`  
  - `coverage/client/`  
  > 💡 70% statement and 60% branch coverage required.

---

## 🐞 Debugging

- **Backend Logs:**  
  View logs in terminal (e.g., `Creating bug: {...}`).

- **Frontend Logs:**  
  Use Chrome DevTools → Console (e.g., `Submitting form`, `API response`).

- **Intentional Bug:**  
  Form fields in `/create` don’t reset on error. Displays:  
  `"Failed to save bug"`

- **Error Boundary:**  
  Displays `"Something went wrong"` on rendering errors.  
  _Test: Insert `throw new Error('Test error')` in `BugList.jsx`_

---

## 📡 API Endpoints

| Method | Endpoint         | Description                                 |
|--------|------------------|---------------------------------------------|
| POST   | `/api/bugs`      | Create a bug (requires title, description, priority, createdBy) |
| GET    | `/api/bugs`      | List bugs (supports `?status=` filter: open, in-progress, resolved) |
| GET    | `/api/bugs/:id`  | Get a bug by ID                             |
| PUT    | `/api/bugs/:id`  | Update a bug (title, description, priority, status) |
| DELETE | `/api/bugs/:id`  | Delete a bug                                |

---

## ✨ Features

- Create, read, update, and delete bugs.
- Filter bugs by status.
- Form validation and error handling.
- Responsive UI with Tailwind CSS.
- **Intentional bug**: Form fields retain values on failed submission.
- **Error boundary** for UI crash handling.

---

## 📝 Notes

- Frontend uses **Vite** (Port: `5173`).
- Backend runs on **Express** (Port: `5000`).
- Use **Postman** to test API endpoints.
  

  ## Project Structure

  Project Structure
mern-bug-tracker/
├── client/                 # React frontend
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   └── App.jsx         # Main application component
│   └── cypress/            # End-to-end tests
├── server/                 # Express.js backend
│   ├── src/                # Server source code
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── tests/              # Server-side tests
│       ├── unit/           # Unit tests
│       └── integration/    # Integration tests
├── jest.config.js          # Jest configuration
└── package.json            # Project dependencies
