import React from 'react';
import clsx from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
      <div className="relative my-4">
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'block px-3 pt-6 pb-2 w-full text-sm bg-white dark:bg-[black] border border-gray-300 dark:border-gray-700 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-[#8854e0] transition-all',
            'text-gray-900 dark:text-white',
            'peer',
            className
          )}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={inputId}
          className="absolute left-3 top-1 text-gray-500 dark:text-gray-400 text-xs pointer-events-none transition-all duration-200 origin-left transform scale-90 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-4 peer-focus:scale-90 peer-focus:top-2"
        >
          {label}
        </label>
      </div>
    );
  }
);
Input.displayName = 'Input'; 