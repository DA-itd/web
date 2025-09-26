
import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error';
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const baseClasses = "p-4 rounded-md flex justify-between items-center";
    const typeClasses = {
        success: "bg-green-100 border border-green-400 text-green-700",
        error: "bg-red-100 border border-red-400 text-red-700"
    };

    if (!message) return null;

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <p>{message}</p>
            {onClose && (
                 <button onClick={onClose} className="ml-4 font-bold text-xl">&times;</button>
            )}
        </div>
    );
};

export default Alert;
