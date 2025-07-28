import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
};

const base =
  'px-4 py-2 rounded-md font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-300';

const variants = {
  primary:
    'bg-[#8854e0] text-white hover:bg-[#8854e0] active:bg-[#8854e0] shadow-sm',
  secondary:
    'bg-[#8854e0] text-[#8854e0] hover:bg-[#8854e0] active:bg-[#8854e0] border border-gray-300',
  ghost:
    'bg-transparent text-[#8854e0] hover:bg-[#8854e0] active:bg-[#8854e0]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button'; 