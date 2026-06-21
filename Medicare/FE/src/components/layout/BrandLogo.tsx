import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  to?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  to = '/',
  variant = 'dark',
  compact = false,
  className = '',
}) => {
  const isLight = variant === 'light';

  return (
    <Link to={to} className={`group flex items-center gap-3 flex-shrink-0 ${className}`}>
      <div
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 ${
          isLight
            ? 'w-9 h-9 rounded-[12px] bg-white shadow-md shadow-black/5'
            : 'w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#06b6d4] shadow-lg shadow-blue-500/30 ring-1 ring-white/25'
        }`}
      >
        {!isLight && (
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
        )}
        <svg viewBox="0 0 24 24" className="relative w-[22px] h-[22px]" fill="none">
          <path
            d="M9.4 4.6h5.2a.8.8 0 0 1 .8.8v3.2h3.2a.8.8 0 0 1 .8.8v5.2a.8.8 0 0 1-.8.8h-3.2v3.2a.8.8 0 0 1-.8.8H9.4a.8.8 0 0 1-.8-.8v-3.2H5.4a.8.8 0 0 1-.8-.8V9.4a.8.8 0 0 1 .8-.8h3.2V5.4a.8.8 0 0 1 .8-.8Z"
            fill={isLight ? '#2563eb' : 'white'}
            fillOpacity={isLight ? '0.12' : '0.18'}
          />
          <path
            d="M4 13h3.4l1.3 3.4L11 8l1.7 4.4 1-2.4H20"
            stroke={isLight ? '#2563eb' : 'white'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {!compact && (
        <span className={`flex flex-col leading-tight ${isLight ? 'text-white' : ''}`}>
          <span className={`font-bold tracking-tight text-[15px] ${isLight ? 'text-white' : 'text-slate-900'}`}>
            MediCare
            <span className={isLight ? 'text-white/90' : 'text-[#2563eb]'}> AI</span>
          </span>
          <span className={`text-[10.5px] font-medium tracking-wide uppercase ${isLight ? 'text-white/70' : 'text-slate-400'}`}>
            Clinic Management
          </span>
        </span>
      )}
    </Link>
  );
};

export default BrandLogo;
