import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
    text: string;
    className?: string;
}

const Button = ({ text, onClick, type = 'button', className = '' }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;
