import React, { useEffect, useState } from 'react';
import { getAvatarUrl } from '../../utils/avatar';
import { getUserInitials } from '../../utils/userDisplay';

// Badge
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md';
}
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'sm' }) => {
  const variants: Record<string, string> = {
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'} ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, padding = 'md' }) => {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

// Avatar
interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ src, name = '', size = 'md', className = '' }) => {
  const sizes: Record<string, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };
  const resolvedSrc = getAvatarUrl(src);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [resolvedSrc]);

  const initials = getUserInitials(name);

  if (resolvedSrc && !imgError) {
    return (
      <img
        src={resolvedSrc}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold flex-shrink-0 ${className}`}>
      {initials || '?'}
    </div>
  );
};

// Spinner
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ size = 'md', color = '#1a56db' }) => {
  const sizes = { sm: 16, md: 24, lg: 36 };
  const s = sizes[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

// Divider
export const Divider: React.FC<{ label?: string; className?: string }> = ({ label, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-gray-200" />
    {label && <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{label}</span>}
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

// Toggle
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:ring-offset-2 ${checked ? 'bg-[#1a56db]' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// HealthScoreBadge
export const HealthScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: `${color}15` }}>
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 94} 94`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold" style={{ color }}>{score}</span>
      </div>
      <div>
        <div className="text-xs font-semibold" style={{ color }}>AI Health Score</div>
      </div>
    </div>
  );
};
