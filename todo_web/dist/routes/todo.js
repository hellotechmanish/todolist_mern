"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = __importDefault(require("../models/todo"));
const auth_1 = require("../middleware/auth");
const routerTodos = (0, express_1.Router)();
routerTodos.get('/', auth_1.authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const todos = await todo_1.default.find({ user: req.user._id });
        return res.status(200).json({ todos });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to get todos' });
    }
});
routerTodos.post('/', auth_1.authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { title, description, dueDate, category } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    try {
        const newTodo = new todo_1.default({
            title,
            description,
            dueDate,
            category,
            user: req.user._id,
        });
        const savedTodo = await newTodo.save();
        return res.status(201).json(savedTodo);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to create todo' });
    }
});
routerTodos.delete('/:id', auth_1.authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const todo = await todo_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or not authorized to delete' });
        }
        return res.status(200).json({ message: 'Todo deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete todo' });
    }
});
routerTodos.get('/:id', auth_1.authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const todo = await todo_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.status(200).json(todo);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch todo' });
    }
});
routerTodos.put('/:id', auth_1.authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { title, description, dueDate, category } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    try {
        const updatedTodo = await todo_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { title, description, dueDate, category }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.status(200).json(updatedTodo);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update todo' });
    }
});
exports.default = routerTodos;
