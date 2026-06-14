const Card = ({ children, className = '', hover = false, padding = 'md' }) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md' : ''} ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
