import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating,
  size = 16,
  showValue = true,
}) => (
  <div className="inline-flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[#c3c6d6]'}
      />
    ))}
    {showValue && (
      <span className="ml-1 text-sm font-semibold text-[#191c1e]">{rating.toFixed(1)}</span>
    )}
  </div>
);

export default StarRatingDisplay;
