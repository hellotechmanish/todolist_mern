function TodoCard({ todo, onEdit, onDelete }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold">{todo.title}</h3>
            <p className="text-gray-600">{todo.description}</p>
            <div className="flex justify-between mt-4">
                <button onClick={() => onEdit(todo)} className="text-indigo-600">Edit</button>
                <button onClick={() => onDelete(todo._id)} className="text-red-600">Delete</button>
            </div>
        </div>
    );
}

export default TodoCard;
