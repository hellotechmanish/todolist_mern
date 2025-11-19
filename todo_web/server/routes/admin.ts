import { Router, type Request, type Response } from 'express';
import Todo from '../models/todo';
import { authenticate, authorizeAdmin } from '../middleware/auth';

interface AdminTodoBody {
    title?: string;
    description?: string;
    dueDate?: string;
    category?: string;
}

const routerAdmin = Router();

routerAdmin.use(authenticate);

routerAdmin.get('/todos', authorizeAdmin, async (_req: Request, res: Response) => {
    try {
        const todos = await Todo.find();
        return res.status(200).json({ todos });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch todos' });
    }
});

routerAdmin.put(
    '/todos/:id',
    authorizeAdmin,
    async (req: Request<Record<string, string>, unknown, AdminTodoBody>, res: Response) => {
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    description: req.body.description,
                    dueDate: req.body.dueDate,
                    category: req.body.category,
                },
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

routerAdmin.delete('/todos/:id', authorizeAdmin, async (req: Request, res: Response) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete todo' });
    }
});

export default routerAdmin;
