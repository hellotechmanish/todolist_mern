// server/models/todo.js
const { Schema, model } = require('mongoose');

const todoSchema = new Schema({
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    dueDate: { type: Date },
    category: { type: String, enum: ['Urgent', 'Non-Urgent'], default: 'Non-Urgent' },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = model('Todo', todoSchema);
