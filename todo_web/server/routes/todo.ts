import { Router, type Request, type Response } from 'express';
import Todo from '../models/todo';
import { authenticate } from '../middleware/auth';

interface TodoBody {
    title: string;
    description?: string;
    dueDate?: string;
    category?: string;
}

const routerTodos = Router();

routerTodos.get('/', authenticate, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const todos = await Todo.find({ user: req.user._id });
        return res.status(200).json({ todos });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to get todos' });
    }
});

routerTodos.post(
    '/',
    authenticate,
    async (req: Request<Record<string, string>, unknown, TodoBody>, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { title, description, dueDate, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        try {
            const newTodo = new Todo({
                title,
                description,
                dueDate,
                category,
                user: req.user._id,
            });

            const savedTodo = await newTodo.save();
            return res.status(201).json(savedTodo);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to create todo' });
        }
    },
);

routerTodos.delete('/:id', authenticate, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or not authorized to delete' });
        }

        return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete todo' });
    }
});

routerTodos.get('/:id', authenticate, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        return res.status(200).json(todo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch todo' });
    }
});

routerTodos.put(
    '/:id',
    authenticate,
    async (req: Request<Record<string, string>, unknown, TodoBody>, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { title, description, dueDate, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        try {
            const updatedTodo = await Todo.findOneAndUpdate(
                { _id: req.params.id, user: req.user._id },
                { title, description, dueDate, category },
                { new: true },
            );

            if (!updatedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            return res.status(200).json(updatedTodo);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to update todo' });
        }
    },
);

export default routerTodos;
