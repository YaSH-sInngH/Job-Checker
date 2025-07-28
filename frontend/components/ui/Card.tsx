import React from 'react';
import clsx from 'clsx';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6',
        'transition-shadow duration-150 hover:shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card'; 