require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Book = require("./models/Book");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database connection health check
app.get("/api/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "connected" : "disconnected",
    dbState: mongoose.connection.readyState,
    database: mongoose.connection.name || undefined,
    uptime: Math.floor(process.uptime())
  });
});

// Read all books. Optional search and status filters are supported.
app.get("/api/books", async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;
    const filter = {};

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { author: { $regex: safeSearch, $options: "i" } }
      ];
    }

    if (status && ["Want to Read", "Reading", "Completed"].includes(status)) {
      filter.status = status;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch books." });
  }
});

// Create a book.
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, genre, status } = req.body;
    const book = await Book.create({ title, author, genre, status });
    res.status(201).json(book);
  } catch (error) {
    const message = error.name === "ValidationError"
      ? Object.values(error.errors).map(item => item.message).join(", ")
      : "Could not save the book.";
    res.status(400).json({ message });
  }
});

// Update a book's details or reading status.
app.put("/api/books/:id", async (req, res) => {
  try {
    const { title, author, genre, status } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, status },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (error) {
    const message = error.name === "ValidationError"
      ? Object.values(error.errors).map(item => item.message).join(", ")
      : "Could not update the book.";
    res.status(400).json({ message });
  }
});

// Delete a book.
app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Could not delete the book." });
  }
});

// Serve frontend for all unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Graceful shutdown listeners
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through process termination (SIGINT).");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through process termination (SIGTERM).");
  process.exit(0);
});

async function startServer() {
  if (!MONGODB_URI) {
    console.error("❌ Error: Missing MONGODB_URI environment variable.");
    console.error("Please copy .env.example to .env and configure your MongoDB connection string.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB successfully! Database: "${mongoose.connection.name || "booktrack"}"`);

    app.listen(PORT, () => {
      console.log(`BookTrack server is running on port ${PORT}`);
      console.log(`Local address: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (MONGODB_URI.startsWith("mongodb+srv://")) {
      console.error("\n--- MongoDB Atlas Connection Checklist ---");
      console.error("1. Network Access: Ensure your IP address (or 0.0.0.0/0 for Render) is whitelisted in MongoDB Atlas.");
      console.error("2. Database User: Verify the username and password match your Atlas Database Access user.");
      console.error("3. Special Characters: If your password contains characters like @, :, #, or %, ensure they are URL-encoded.");
      console.error("4. Database Name: Ensure a database name is specified before query parameters (e.g., ...mongodb.net/booktrack).\n");
    }
    process.exit(1);
  }
}

startServer();
