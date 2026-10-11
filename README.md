# 📚 BookTrack — Personal Book Tracker

> A full-stack web application built for tracking personal reading goals and demonstrating core MongoDB database operations, Mongoose schema modeling, RESTful API architecture, and cloud deployment on Render with MongoDB Atlas.

---

## 🌟 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [MongoDB Architecture & Schema](#-mongodb-architecture--schema)
- [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide)
- [Local MongoDB Setup Guide](#-local-mongodb-setup-guide)
- [Environment Variables](#-environment-variables)
- [Local Installation & Development](#-local-installation--development)
- [API Documentation](#-api-documentation)
- [Render Deployment Guide](#-render-deployment-guide)
- [Project Directory Structure](#-project-directory-structure)
- [Security & Best Practices](#-security--best-practices)

---

## 📖 Project Overview

**BookTrack** is a clean, personal library and reading tracker application. It allows users to organize their bookshelf, categorize books by genres, monitor reading progress through real-time counters, and perform full CRUD (Create, Read, Update, Delete) operations backed by MongoDB.

This project is tailored for a **MongoDB Assignment**, showcasing:
- Mongoose schema design with data types and built-in validations
- MongoDB Atlas cloud database provisioning and access control
- Compound indexing for search optimization
- Full CRUD API endpoints connected via Express.js
- Production-ready cloud deployment on Render with strict secret isolation

---

## ✨ Key Features

- **Full CRUD Functionality**:
  - **Create**: Add new books with title, author, genre, and reading status.
  - **Read**: Fetch books dynamically from MongoDB, sorted by most recently added.
  - **Update**: Edit book details or switch reading statuses instantly.
  - **Delete**: Remove books from the collection with immediate UI updates.
- **Dynamic Search & Filtering**:
  - Text search by book title or author.
  - Category filters: *Want to Read*, *Reading*, and *Completed*.
- **Real-Time Reading Statistics**:
  - Dynamic dashboard counters displaying total, in-progress, and completed book counts.
- **Responsive & Modern Interface**:
  - Emerald green and white design palette.
  - Accessible forms, modal dialogs, and smooth micro-interactions.
- **Service Health Monitoring**:
  - Dedicated `/api/health` endpoint reporting live database connection states (`connected` / `disconnected`), active database name, and uptime.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Database** | MongoDB Atlas / Local MongoDB | Document database for persistent storage |
| **ODM** | Mongoose `v8.x` | Object Data Modeling library with schema validation |
| **Backend** | Node.js + Express `v4.x` | RESTful API server and static asset delivery |
| **Frontend** | HTML5, Vanilla CSS3, JavaScript (ES6+) | Lightweight, reactive client interface |
| **Config & Secrets** | `dotenv` | Environment variable management |
| **Deployment** | Render | Cloud PaaS web service host |
| **Version Control** | Git & GitHub | Source control with strict secret exclusion |

---

## 🗄️ MongoDB Architecture & Schema

### Database Details
- **Database Name**: `booktrack`
- **Collection**: `books`

### Mongoose Schema Design (`models/Book.js`)

```javascript
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      maxlength: 120
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: 100
    },
    genre: {
      type: String,
      trim: true,
      default: "Other",
      maxlength: 60
    },
    status: {
      type: String,
      enum: ["Want to Read", "Reading", "Completed"],
      default: "Want to Read"
    }
  },
  { timestamps: true }
);

// Compound text index on title and author for fast search queries
bookSchema.index({ title: "text", author: "text" });
```

### Sample Document Structure

```json
{
  "_id": "6740f91b72e5b6c891a23456",
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help",
  "status": "Completed",
  "createdAt": "2024-11-22T21:40:11.832Z",
  "updatedAt": "2024-11-22T21:45:00.124Z",
  "__v": 0
}
```

---

## ☁️ MongoDB Atlas Setup Guide

To run BookTrack in the cloud or prepare it for Render deployment, configure a free MongoDB Atlas cluster:

### Step 1: Create an Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Sign up or log into your account.

### Step 2: Build a Free Cluster
1. On the Atlas dashboard, click **Create** or **Build a Database**.
2. Select the **M0 Free (Shared)** tier.
3. Choose a cloud provider (e.g., AWS) and region closest to your users.
4. Name your cluster (e.g., `Cluster0`) and click **Create Deployment**.

### Step 3: Create a Database User
1. In the left navigation, go to **Security** > **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication.
4. Enter a **Username** (e.g., `booktrack_admin`) and a secure **Password**.
   > **Note on Special Characters**: If your password contains special characters such as `@`, `:`, `%`, or `#`, you must URL-encode them (e.g., `@` becomes `%40`) in your connection string.
5. Set Database User Privileges to **Read and write to any database** (or Atlas admin).
6. Click **Add User**.

### Step 4: Configure Network Access (IP Whitelist)
1. In the left navigation, go to **Security** > **Network Access**.
2. Click **Add IP Address**.
3. To allow Render and external cloud services to connect, select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Confirm**.

### Step 5: Copy the Connection String
1. Go back to **Database** (or **Clusters**).
2. Click the **Connect** button next to your cluster.
3. Select **Drivers**.
4. Choose **Node.js** and the latest version.
5. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add the database name `booktrack` right before the query parameters:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/booktrack?retryWrites=true&w=majority
   ```

---

## 💻 Local MongoDB Setup Guide

If you prefer testing with a local MongoDB instance:

1. Download and install **[MongoDB Community Server](https://www.mongodb.com/try/download/community)**.
2. Start the local MongoDB service (MongoDB typically runs on port `27017`).
3. Set your connection string in `.env`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/booktrack
   PORT=5000
   ```
4. Optional: Download **MongoDB Compass** to visually inspect documents in the `booktrack` database.

---

## 🔐 Environment Variables

Environment variables are managed using `dotenv`. Create a `.env` file in the project root to store your local configuration.

### Configuration Reference

| Variable | Required | Default | Description | Example |
|---|---|---|---|---|
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas or local connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/booktrack` |
| `PORT` | No | `5000` | Port for the Express HTTP server | `5000` (Render automatically assigns `10000`) |

### Setting Up Your `.env` File
Create a `.env` file in the project root with your configuration:
Open `.env` and set your `MONGODB_URI`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://yourUser:yourPassword@cluster0.xxxx.mongodb.net/booktrack?retryWrites=true&w=majority
```

> ⚠️ **CRITICAL SECURITY NOTE**: Never commit `.env` to GitHub. The `.gitignore` file is configured to exclude all `.env` files to keep your database credentials safe.

---

## 🚀 Local Installation & Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- MongoDB Atlas cluster or running local MongoDB instance

### Step-by-Step Instructions

1. **Clone or navigate to the repository**:
   ```bash
   git clone https://github.com/Fakruddin-Coder/BookTrack.git
   cd BookTrack
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file with your `MONGODB_URI` and `PORT`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/booktrack?retryWrites=true&w=majority
   ```

4. **Start the application**:
   - **Production mode**:
     ```bash
     npm start
     ```
   - **Development mode** (with auto-restart via nodemon):
     ```bash
     npm run dev
     ```

5. **Open in browser**:
   Navigate to [http://localhost:5000](http://localhost:5000).

---

## 📡 API Documentation

### Base URL: `/api`

| Method | Endpoint | Description | Request Body | Response (Success) |
|---|---|---|---|---|
| `GET` | `/api/health` | Check MongoDB connection status | None | `200 OK` `{ "status": "connected", "database": "booktrack", "uptime": 42 }` |
| `GET` | `/api/books` | Retrieve all books (with optional filters) | None | `200 OK` Array of book documents |
| `GET` | `/api/books?search=alchemist` | Filter books by title or author | None | `200 OK` Array of matching books |
| `GET` | `/api/books?status=Reading` | Filter books by status (`Want to Read`, `Reading`, `Completed`) | None | `200 OK` Array of filtered books |
| `POST` | `/api/books` | Create a new book | JSON: `{ title, author, genre?, status? }` | `201 Created` Created book document |
| `PUT` | `/api/books/:id` | Update an existing book's details or status | JSON: `{ title, author, genre?, status? }` | `200 OK` Updated book document |
| `DELETE` | `/api/books/:id` | Remove a book by ID | None | `200 OK` `{ "message": "Book deleted successfully." }` |

### Example API Request (Create Book)

**Request**:
```http
POST /api/books HTTP/1.1
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Technology",
  "status": "Reading"
}
```

**Response (`201 Created`)**:
```json
{
  "_id": "6740fa5d72e5b6c891a23457",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Technology",
  "status": "Reading",
  "createdAt": "2024-11-22T21:45:33.210Z",
  "updatedAt": "2024-11-22T21:45:33.210Z",
  "__v": 0
}
```

---

## 🌐 Render Deployment Guide

Follow these steps to deploy BookTrack as a live Web Service on Render:

### Prerequisites
1. Ensure your code is pushed to your GitHub repository: `https://github.com/Fakruddin-Coder/BookTrack.git`.
2. Ensure your MongoDB Atlas cluster has IP whitelist set to `0.0.0.0/0` (Network Access).

### Method 1: Render Web Service (Dashboard)

1. **Log in to Render**:
   - Go to [render.com](https://render.com) and sign in with GitHub.
2. **Create a New Web Service**:
   - Click **New +** > **Web Service**.
   - Select **Build and deploy from a Git repository**.
   - Connect your `BookTrack` repository (`Fakruddin-Coder/BookTrack`).
3. **Configure the Service**:
   - **Name**: `booktrack`
   - **Region**: Choose the region closest to your MongoDB Atlas cluster (e.g., Oregon, Frankfurt, Singapore).
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. **Configure Environment Variables**:
   - Scroll to the **Environment Variables** section.
   - Click **Add Environment Variable**:
     - **Key**: `MONGODB_URI`
     - **Value**: Your full MongoDB Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/booktrack?retryWrites=true&w=majority`).
     *(Optional)*:
     - **Key**: `NODE_ENV`, **Value**: `production`
5. **Deploy**:
   - Click **Create Web Service**.
   - Render will pull your repository, run `npm install`, execute `npm start`, and bind to `0.0.0.0`.
6. **Verify Deployment**:
   - Once the deployment status turns **Live**, click the generated URL (e.g., `https://booktrack-xxxx.onrender.com`).
   - Check the health check endpoint: `https://your-app.onrender.com/api/health` to confirm database connectivity.

### Method 2: Render Blueprint (`render.yaml`)

A pre-configured [`render.yaml`](file:///render.yaml) is included in this repository.
1. In Render, select **New +** > **Blueprint**.
2. Select your `BookTrack` repository.
3. Render will detect `render.yaml`.
4. Fill in the secret variable `MONGODB_URI` when prompted in the Render dashboard.
5. Click **Apply**.

---

## 📁 Project Directory Structure

```text
BookTrack/
├── .gitignore          # Excludes node_modules, secrets (.env), and logs
├── models/
│   └── Book.js         # Mongoose schema, validation, and text indexes
├── public/
│   ├── app.js          # Client-side dynamic logic, CRUD calls, UI state
│   ├── index.html      # Accessible semantic HTML layout
│   └── styles.css      # Custom emerald & white responsive styling
├── package.json        # Node.js dependencies, scripts, and engine specs
├── package-lock.json   # Deterministic dependency tree
├── render.yaml         # Render Infrastructure-as-Code Blueprint
├── server.js           # Express server, MongoDB connection & REST endpoints
└── README.md           # Comprehensive project documentation
```

---

## 🔒 Security & Best Practices

1. **Secret Isolation**: Never commit passwords or connection URIs into Git. Use environment variables exclusively.
2. **Strict `.gitignore`**: The project's `.gitignore` prevents `.env`, `node_modules`, log files, and OS artifacts from being committed.
3. **Graceful Termination**: The server implements clean process shutdown (`SIGINT` and `SIGTERM`) to terminate Mongoose database connections without data loss.
4. **Input Sanitization**: Regular expression characters in search queries are safely escaped to prevent regex injection.
5. **Validation**: All book creation and update actions enforce Mongoose schema validation constraints.
