// components/LoadingSpinner.tsx
import React from 'react';

type Size = 'small' | 'medium' | 'large';
type Color = 'blue' | 'red' | 'green' | 'gray' | 'orange';

interface LoadingSpinnerProps {
    text?: string;
    size?: Size;
    fullScreen?: boolean;
    color?: Color;
    textColor?: Color;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
   text = 'Загрузка...',
   size = 'medium',
   fullScreen = false,
   color = 'blue',
   textColor = 'gray',
   className = ''
                                                       }) => {
    const sizeStyles: Record<Size, string> = {
        small: 'w-6 h-6 border-2',
        medium: 'w-10 h-10 border-4',
        large: 'w-16 h-16 border-6'
    };

    const colorStyles: Record<Color, string> = {
        blue: 'border-t-blue-700 dark:border-t-blue-400 border-blue-200 dark:border-blue-800',
        orange: 'border-t-orange-700 dark:border-t-orange-400 border-orange-200 dark:border-orange-800',
        red: 'border-t-red-700 dark:border-t-red-400 border-red-200 dark:border-red-800',
        green: 'border-t-green-700 dark:border-t-green-400 border-green-200 dark:border-green-800',
        gray: 'border-t-gray-700 dark:border-t-gray-400 border-gray-200 dark:border-gray-800'
    };

    const textColorStyles: Record<Color, string> = {
        gray: 'text-gray-800 dark:text-gray-200',
        blue: 'border-t-blue-700 dark:border-t-blue-400 border-blue-200 dark:border-blue-800',
        orange: 'text-orange-800 dark:text-orange-200',
        red: 'text-red-800 dark:text-red-200',
        green: 'text-green-800 dark:text-green-200'
    };

    return (
        <div
            className={`
        flex flex-col items-center justify-center gap-4
        ${fullScreen ? 'fixed inset-0 bg-gray-50/90 dark:bg-gray-900/90 z-50' : 'p-8'}
        ${className}
      `}
            role="status"
            aria-live="polite"
        >
            <div
                className={`
          animate-spin rounded-full
          border-solid
          ${sizeStyles[size]}
          ${colorStyles[color]}
        `}
            />
            <span
                className={`
          font-medium text-base text-center
          ${textColorStyles[textColor]}
        `}
            >
        {text}
      </span>
        </div>
    );
};

export default LoadingSpinner;