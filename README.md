# BookTrack — Personal Book Tracker

A full-stack web application for managing a personal reading list, built as a MongoDB learning project.

**Live Demo:** https://booktrack-h8d1.onrender.com  
**GitHub:** https://github.com/Fakruddin-Coder/BookTrack

## Features
- Add, view, edit, and delete books
- Track reading status: Want to Read, Reading, and Completed
- Search and filter books
- View reading statistics

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Deployment:** Render

## Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Fakruddin-Coder/BookTrack.git
   cd BookTrack
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the app:
   ```bash
   npm start
   ```
5. Open http://localhost:5000.

## MongoDB
BookTrack uses MongoDB Atlas for cloud storage. Add your connection string to the `MONGODB_URI` environment variable locally or in Render's Environment settings.

**Security:** Never commit `.env` files, passwords, or real MongoDB connection strings to GitHub.
