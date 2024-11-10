const mongoose = require("mongoose");

const todosSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  isCompleted: { type: Boolean, default: false },
  order: { type: Number }, // Order field for tracking position
});

todosSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Find the current highest order value in the collection
      const lastTodo = await mongoose
        .model("Todos")
        .findOne()
        .sort("-order")
        .limit(1);
      const nextOrder = lastTodo ? lastTodo.order + 1 : 0; // If no todos exist, start at 0
      this.order = nextOrder;
      next();
    } catch (err) {
      next(err); // If there's an error, pass it to the next middleware
    }
  } else {
    next(); // If it's an existing document, skip the hook
  }
});

module.exports = mongoose.model("Todos", todosSchema);
