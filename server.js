// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

// MongoDB Connection
const MONGO_URI =
  "mongodb+srv://kfcodeacc2001:NvB9BgLUitZYNWAs@cluster0.cchqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

// Increase payload limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const todosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const Todos = mongoose.model("Todos", todosSchema);

app.use(cors()); // Use CORS middleware


// 1. GET / - Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the Example Node.js Server with MongoDB!");
});

app.get("/todos", async (req, res) => {
  try {
    const items = await Todos.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const item = await Todos.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Todos not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todos(req.body); // Create a new instance
    const savedItem = await newTodo.save(); // Save to the database
    res.status(201).json(savedItem); // Return the saved item
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle validation errors
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const updatedItem = await Todos.findByIdAndUpdate(
      req.params.id,
      req.body, // Pass req.body directly to update all fields
      { new: true, runValidators: true }
    );
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Todos not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const deletedItem = await Todos.findByIdAndDelete(req.params.id);
    if (deletedItem) {
      res.json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. GET /status - Check server status
app.get("/status", (req, res) => {
  res.json({ status: "Server is running", uptime: process.uptime() });
});

// 8. POST /echo - Echo the request body
app.post("/echo", (req, res) => {
  res.json(req.body);
});

// 9. GET /info - Return server info
app.get("/info", (req, res) => {
  res.json({
    name: "Example Node.js Server with MongoDB",
    version: "1.0.0",
    author: "Your Name",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
