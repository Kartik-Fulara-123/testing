const Todos = require("../models/Todos");

exports.getAllTodos = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};

    if (type === "active") filter = { isCompleted: false };
    else if (type === "completed") filter = { isCompleted: true };

    const items = await Todos.find(filter).sort("-order"); // Sort by order field in descending order
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const item = await Todos.findById(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "Todo not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const newTodo = new Todos(req.body);
    const savedItem = await newTodo.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const updatedItem = await Todos.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedItem) res.json(updatedItem);
    else res.status(404).json({ message: "Todo not found" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deletedItem = await Todos.findByIdAndDelete(req.params.id);
    if (deletedItem) res.json({ message: "Item deleted" });
    else res.status(404).json({ message: "Item not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCompletedTodos = async (req, res) => {
  try {
    await Todos.deleteMany({ isCompleted: true });
    res.json({ message: "Completed todos cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reorderTodos = async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of todo IDs in the desired order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    // Prepare bulk operations
    const bulkOperations = orderedIds.map((item, index) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    // Execute bulk write operation
    await Todos.bulkWrite(bulkOperations);

    res.json({ message: "Todos reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
