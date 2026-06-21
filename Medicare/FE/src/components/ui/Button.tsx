import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants: Record<string, string> = {
    primary: 'bg-[#2563eb] text-white border-[#2563eb] hover:bg-[#1d4ed8] focus:ring-[#2563eb] active:scale-[0.98] shadow-sm shadow-blue-500/25',
    secondary: 'bg-[#10b981] text-white border-[#10b981] hover:bg-[#059669] focus:ring-[#10b981]',
    outline: 'bg-transparent text-[#2563eb] border-[#2563eb] hover:bg-[#eff6ff] focus:ring-[#2563eb]',
    ghost: 'bg-transparent text-[#374151] border-transparent hover:bg-[#f3f4f6] focus:ring-gray-300',
    danger: 'bg-[#ef4444] text-white border-[#ef4444] hover:bg-[#dc2626] focus:ring-[#ef4444]',
  };

  const sizes: Record<string, string> = {
    sm: 'text-sm px-3 py-1.5 rounded-lg',
    md: 'text-sm px-5 py-2.5 rounded-xl',
    lg: 'text-base px-7 py-3.5 rounded-xl',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
