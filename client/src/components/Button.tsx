import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'normal' | 'pill';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      rounded = 'normal',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'btn-custom';
    const variantClass = `btn-custom-${variant}-${color}`;
    const sizeClass = `btn-custom-${size}`;
    const roundedClass = rounded === 'pill' ? 'rounded-pill' : '';

    const combinedClasses = [baseClass, variantClass, sizeClass, roundedClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
