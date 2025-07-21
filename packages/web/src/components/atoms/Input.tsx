import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  placeholder,
  disabled = false,
  readOnly = false,
  error = false,
  inputSize = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg',
  }[inputSize];

  const classes = [
    'w-full rounded-lg border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'placeholder:text-muted-foreground',
    sizeClasses,
    error
      ? 'border-error bg-error/5 focus:ring-error/20 focus:border-error'
      : 'border-border bg-input-background focus:ring-design-primary/20 focus:border-design-primary',
    disabled || readOnly
      ? 'opacity-50 cursor-not-allowed bg-muted'
      : 'hover:border-design-primary/50',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      className={classes}
      {...props}
    />
  );
};

export default Input;
