import React from "react";
import { Star } from "lucide-react";

interface ReviewItemProps {
  rating: number;
  text: string;
  author?: string;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  rating,
  text,
  author,
}) => {
  return (
    <div className="space-y-2 border-b border-border/50 pb-4 last:border-0 last:pb-0">
      {/* 5 gold stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < rating ? "fill-primary text-primary" : "text-muted"} 
          />
        ))}
      </div>
      
      {/* Testimonial text block */}
      <p className="text-xs text-muted-foreground leading-relaxed italic">
        "{text}"
      </p>
      
      {/* Author name if present */}
      {author && (
        <p className="text-[10px] text-primary/75 tracking-wider uppercase font-semibold">
          — {author}
        </p>
      )}
    </div>
  );
};
