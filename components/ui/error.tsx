import React from 'react';

interface ErrorMessageProps {
  message: string;
  type: 'error' | 'warning' | 'success';
  onClose?: () => void;
}

function ErrorMessage({ message, type = 'error', onClose }: ErrorMessageProps) {
  const alertClasses = {
    error: 'bg-red-100 border border-red-400 text-red-700',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
    success: 'bg-green-100 border border-green-400 text-green-700',
  };

  const alertClass = alertClasses[type] || alertClasses.error;

  return (
    <div
      className={`p-4 rounded ${alertClass} mb-4 fixed top-0 left-0 right-0 z-1000`} // Измененные стили
      role="alert"
    >
      <div className="flex">
        <div>
          {type === 'error' && <ErrorIcon className="h-6 w-6 mr-2" />}
          {type === 'warning' && <WarningIcon className="h-6 w-6 mr-2" />}
          {type === 'success' && <SuccessIcon className="h-6 w-6 mr-2" />}
        </div>
        <div>
          <p className="font-bold">
            {type === 'error' ? 'Ошибка' : type === 'warning' ? 'Предупреждение' : 'Успех'}
          </p>
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            className="ml-auto -mx-1.5 -my-1.5 bg-transparent hover:bg-red-200 rounded-lg focus:ring-2 focus:ring-red-100 p-1.5 inline-flex items-center justify-center"
            onClick={onClose}
            type="button" // Добавлено для корректности JSX
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Типизация для иконок
interface IconProps {
  className?: string;
}

const ErrorIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const WarningIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4.07A8 8 0 0112 17a8 8 0 016.938-4.07m0 0A7 7 0 0012 10a7 7 0 00-6.938 4.07m0 0A6 6 0 0112 11a6 6 0 016.938-4.07m0 0A5 5 0 0012 12a5 5 0 00-6.938 4.07m0 0A4 4 0 0112 13a4 4 0 016.938-4.07m0 0A3 3 0 0012 14a3 3 0 00-6.938 4.07"
    ></path>
  </svg>
);

const SuccessIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export default ErrorMessage;