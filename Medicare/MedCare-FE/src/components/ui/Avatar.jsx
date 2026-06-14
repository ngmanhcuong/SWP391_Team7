const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

const Avatar = ({ name, src, size = 'md', className = '' }) => {
  const initials = name
    ?.split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white ${sizes[size]} ${className}`}
    >
      {initials || '?'}
    </div>
  );
};

export default Avatar;
