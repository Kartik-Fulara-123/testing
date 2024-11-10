const express = require("express");
const router = express.Router();
const todosController = require("../controllers/todosController");

router.get("/", todosController.getAllTodos);
router.get("/:id", todosController.getTodoById);
router.post("/", todosController.createTodo);
router.put("/:id", todosController.updateTodo);
router.delete("/:id", todosController.deleteTodo);
router.delete("/clearCompleted", todosController.clearCompletedTodos);
router.post("/reorder", todosController.reorderTodos);

module.exports = router;
