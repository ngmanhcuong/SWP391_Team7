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
    <Link to={to} className={`flex items-center gap-2.5 flex-shrink-0 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-lg ${
          isLight ? 'w-8 h-8 bg-white' : 'w-9 h-9 bg-[#1a56db]'
        }`}
      >
        <svg viewBox="0 0 24 24" className={isLight ? 'w-5 h-5' : 'w-5 h-5'} fill="none">
          <path
            d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"
            fill={isLight ? '#1a56db' : 'white'}
          />
        </svg>
      </div>
      {!compact && (
        <span
          className={`font-bold tracking-tight ${isLight ? 'text-white text-lg' : 'text-[#1a56db] text-base'}`}
          style={{ fontFamily: 'Lexend' }}
        >
          MediCare AI Clinic
        </span>
      )}
    </Link>
  );
};

export default BrandLogo;
