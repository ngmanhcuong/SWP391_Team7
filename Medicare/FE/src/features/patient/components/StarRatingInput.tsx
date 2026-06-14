import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  label?: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  size = 22,
  label,
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-[#191c1e]">{label}</p>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayValue;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003d9b]/30"
              aria-label={`${star} sao`}
            >
              <Star
                size={size}
                className={filled ? 'fill-amber-400 text-amber-400' : 'text-[#c3c6d6]'}
              />
            </button>
          );
        })}
        {value > 0 && (
          <span className="ml-2 text-sm font-semibold text-amber-600">{value}/5</span>
        )}
      </div>
    </div>
  );
};

export default StarRatingInput;
