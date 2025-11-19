"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = __importDefault(require("../models/todo"));
const auth_1 = require("../middleware/auth");
const routerAdmin = (0, express_1.Router)();
routerAdmin.use(auth_1.authenticate);
routerAdmin.get('/todos', auth_1.authorizeAdmin, async (_req, res) => {
    try {
        const todos = await todo_1.default.find();
        return res.status(200).json({ todos });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch todos' });
    }
});
routerAdmin.put('/todos/:id', auth_1.authorizeAdmin, async (req, res) => {
    try {
        const updatedTodo = await todo_1.default.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            category: req.body.category,
        }, { new: true });
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
routerAdmin.delete('/todos/:id', auth_1.authorizeAdmin, async (req, res) => {
    try {
        const deletedTodo = await todo_1.default.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.status(200).json({ message: 'Todo deleted successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete todo' });
    }
});
exports.default = routerAdmin;
