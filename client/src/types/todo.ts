export type TodoCategory = 'Urgent' | 'Non-Urgent' | (string & {});

export interface Todo {
    _id: string;
    title: string;
    description: string;
    dueDate?: string;
    category: TodoCategory;
    completed?: boolean;
    user?: string;
}

