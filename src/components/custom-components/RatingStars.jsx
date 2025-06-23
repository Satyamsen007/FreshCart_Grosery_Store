import { Star } from 'lucide-react';

const RatingStars = ({ rating, setRating, readonly = false, size = 20 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? undefined : 'button'}
          onClick={() => !readonly && setRating(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          disabled={readonly}
        >
          <Star
            size={size}
            className={`${star <= rating
              ? 'text-[var(--primaryColor)] dark:text-[#FFB74D] fill-current'
              : 'text-gray-300 dark:text-gray-600'
              }`}
          />
        </button>
      ))}
    </div>
  );
}

export default RatingStars