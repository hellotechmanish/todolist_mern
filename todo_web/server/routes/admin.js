// server/routes/admin.js
const express = require('express');
const Todo = require('../models/todo');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const routerAdmin = express.Router();

// Middleware to check if the user is an admin
routerAdmin.use(authenticate); // First, authenticate the user

// Admin route to get all todos from all users
routerAdmin.get('/todos', authorizeAdmin, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Fetch all todos from the database
        const todos = await Todo.find(); // You may want to paginate this query if you have a lot of todos
        res.status(200).json({ todos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch todos' });
    }
});
// Admin route to edit any todo
routerAdmin.put('/todos/:id', authorizeAdmin, async (req, res) => {
    const { title, description, dueDate, category } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, category },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);  // Return updated todo
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update todo' });
    }
});

// Admin route to delete a todo
routerAdmin.delete('/todos/:id', authorizeAdmin, async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete todo' });
    }
});

module.exports = routerAdmin;
