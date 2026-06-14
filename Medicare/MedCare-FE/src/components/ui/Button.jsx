const variants = {
  primary:
    'bg-[#1a56db] text-white border-[#1a56db] hover:bg-[#1342a8] focus:ring-[#1a56db] active:scale-[0.98]',
  secondary:
    'bg-[#10b981] text-white border-[#10b981] hover:bg-[#059669] focus:ring-[#10b981]',
  outline:
    'bg-transparent text-[#1a56db] border-[#1a56db] hover:bg-[#e8f0fe] focus:ring-[#1a56db]',
  ghost:
    'bg-transparent text-[#374151] border-transparent hover:bg-gray-100 focus:ring-gray-300',
  danger:
    'bg-[#ef4444] text-white border-[#ef4444] hover:bg-[#dc2626] focus:ring-[#ef4444]',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-xl',
  lg: 'text-base px-7 py-3.5 rounded-xl',
  icon: 'p-2 rounded-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
