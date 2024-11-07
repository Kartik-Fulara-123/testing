// server.js
const express = require("express");
const mongoose = require("mongoose");
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

// Define a Mongoose Schema and Model for "Item"
const itemSchema = new mongoose.Schema({
  food_name: {
    type: String,
    required: [true, "Food name is required"],
  },
  category: {
    type: String,
    enum: ["fruit", "vegetable", "meat", "dairy", "grains"], // Based on custom list
    required: [true, "Category is required"],
  },
  price: {
    type: Number,
    min: [0.99, "Price must be at least 0.99"],
    max: [50, "Price cannot exceed 50"],
    required: [true, "Price is required"],
  },
  expiration_date: {
    type: Date,
    min: "2022-01-01",
    max: "2023-12-31",
    required: [true, "Expiration date is required"],
  },
  calories: {
    type: Number,
    min: [0, "Calories cannot be less than 0"],
    max: [1000, "Calories cannot exceed 1000"],
  },
  ingredients: {
    type: String, // Array of strings for ingredients
    required: [true, "Ingredients are required"],
  },
  allergens: {
    type: String,
    enum: ["peanuts", "dairy", "gluten", "soy", "shellfish"], // Based on custom list
  },
  origin_country: {
    type: String, // Could use a Country code or name
  },
  brand: {
    type: String,
  },
  nutritional_info: {
    type: String,

    message: "Nutritional info must contain between 1 and 3 sentences",
  },
});

const Item = mongoose.model("Item", itemSchema);

// 1. GET / - Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the Example Node.js Server with MongoDB!");
});

// 2. GET /items - Get all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GET /items/:id - Get an item by ID
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. POST /items - Create a new item
app.post("/items", async (req, res) => {
  console.log(req.body); // Log the incoming request body

  // Validate that the request body is an array
  if (!Array.isArray(req.body)) {
    return res
      .status(400)
      .json({ message: "Request body must be an array of items." });
  }

  try {
    // Use `insertMany` to save multiple items at once
    const savedItems = await Item.insertMany(req.body);
    res.status(201).json(savedItems); // Return the saved items
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle validation errors
  }
});
// 5. PUT /items/:id - Update an item by ID
app.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body, // Pass req.body directly to update all fields
      { new: true, runValidators: true }
    );
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 6. DELETE /items/:id - Delete an item by ID
app.delete("/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
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
