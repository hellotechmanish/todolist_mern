function Input({ type, name, placeholder, value, onChange, required = true }) {
    return (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-600">{placeholder}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}

export default Input;
