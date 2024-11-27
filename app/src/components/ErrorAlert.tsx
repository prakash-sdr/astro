import React from 'react';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 text-red-600 bg-red-100 p-3 rounded flex justify-between items-center">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800 font-bold px-2"
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};

export default ErrorAlert;
