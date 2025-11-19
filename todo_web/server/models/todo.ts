import { Schema, model, type Document, type Types } from 'mongoose';

export interface TodoDocument extends Document {
    title: string;
    description?: string;
    dueDate?: Date;
    category: 'Urgent' | 'Non-Urgent';
    completed: boolean;
    user: Types.ObjectId;
}

const todoSchema = new Schema<TodoDocument>(
    {
        title: { type: String, required: true, maxlength: 100 },
        description: { type: String, maxlength: 500 },
        dueDate: { type: Date },
        category: { type: String, enum: ['Urgent', 'Non-Urgent'], default: 'Non-Urgent' },
        completed: { type: Boolean, default: false },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

const Todo = model<TodoDocument>('Todo', todoSchema);

export default Todo;
