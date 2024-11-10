const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todosRoutes = require("./routes/todosRoutes");

const app = express();
const PORT = 3000;

// MongoDB Connection
const MONGO_URI =
  "mongodb+srv://kfcodeacc2001:NvB9BgLUitZYNWAs@cluster0.cchqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/todos", todosRoutes);

// Additional Routes
app.get("/", (req, res) =>
  res.send("Welcome to the Example Node.js Server with MongoDB!")
);
app.get("/status", (req, res) =>
  res.json({ status: "Server is running", uptime: process.uptime() })
);
app.post("/echo", (req, res) => res.json(req.body));
app.get("/info", (req, res) =>
  res.json({
    name: "Example Node.js Server with MongoDB",
    version: "1.0.0",
    author: "Your Name",
  })
);

// Start the server
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
