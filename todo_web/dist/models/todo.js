"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    dueDate: { type: Date },
    category: { type: String, enum: ['Urgent', 'Non-Urgent'], default: 'Non-Urgent' },
    completed: { type: Boolean, default: false },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Todo = (0, mongoose_1.model)('Todo', todoSchema);
exports.default = Todo;
