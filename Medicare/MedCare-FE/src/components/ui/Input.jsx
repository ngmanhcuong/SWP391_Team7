const Input = ({
  label,
  error,
  hint,
  leftIcon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 ${leftIcon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
};

export default Input;
