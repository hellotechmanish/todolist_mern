// server/routes/todos.js
const express = require('express');
const Todo = require('../models/todo');
const { authenticate } = require('../middleware/auth');

const routerTodos = express.Router();

// Get all Todos route for the authenticated user
routerTodos.get('/', authenticate, async (req, res) => {  // Use '/' to match the frontend route
    try {
        // Find todos only for the authenticated user
        const todos = await Todo.find({ user: req.user._id });  // Filter todos by user
        res.status(200).json({ todos });  // Send todos in an object
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get todos', error: err.message });
    }
});

// Create Todo route
routerTodos.post('/', authenticate, async (req, res) => {
    const { title, description, dueDate, category } = req.body;

    // Basic validation
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newTodo = new Todo({
            title,
            description,
            dueDate,
            category,
            user: req.user._id, // Ensure the todo is associated with the authenticated user
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo); // Send the saved todo as a response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create todo', error: err.message });
    }
});

// Delete Todo route
routerTodos.delete('/:id', authenticate, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id  // Ensure the todo is deleted only by the user who created it
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or not authorized to delete' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete todo', error: err.message });
    }
});

routerTodos.get('/:id', authenticate, async (req, res) => {
    try {
        // Fetch the todo by ID and make sure it belongs to the authenticated user
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(todo); // Send the todo data as a response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch todo', error: err.message });
    }
});

// Update Todo route
routerTodos.put('/:id', authenticate, async (req, res) => {
    const { title, description, dueDate, category } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, // Ensure the user is the owner of the todo
            { title, description, dueDate, category },  // Updated fields
            { new: true } // Return the updated todo
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(updatedTodo); // Send the updated todo as a response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update todo', error: err.message });
    }
});


module.exports = routerTodos;
