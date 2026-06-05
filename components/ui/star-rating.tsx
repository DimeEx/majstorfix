"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readOnly = false, size = 20 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = readOnly ? value : (hovered || value);

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? "img" : "radiogroup"} aria-label={readOnly ? `Оценка: ${value} од 5` : "Изберете оценка"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange?.(star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer"} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm p-0.5`}
          aria-label={`${star} ѕвезда${star !== 1 ? "и" : ""}`}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= displayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
      {!readOnly && value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value} од 5
        </span>
      )}
    </div>
  );
}
