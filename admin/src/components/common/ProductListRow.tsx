import React from "react";

interface ProductListRowProps {
  rank: number;
  image: string;
  name: string;
  salesDetail?: string;
  revenue: string;
}

export const ProductListRow: React.FC<ProductListRowProps> = ({
  rank,
  image,
  name,
  salesDetail,
  revenue,
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Gold index badge */}
        <div className="w-6 h-6 rounded-md bg-[#241e17] border border-[#3b3227] flex items-center justify-center text-xs font-semibold text-[#c5a880]">
          {rank}
        </div>
        
        {/* Square jewelry photo thumbnail */}
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-lg object-cover border border-border"
        />
        
        {/* Name and details */}
        <div>
          <h4 className="text-sm font-semibold text-foreground tracking-wide">{name}</h4>
          {salesDetail && (
            <p className="text-xs text-muted-foreground mt-0.5">{salesDetail}</p>
          )}
        </div>
      </div>
      
      {/* Revenue label */}
      <div className="text-right">
        <span className="text-xs font-medium text-muted-foreground uppercase block tracking-wider">Revenue</span>
        <span className="text-sm font-semibold text-foreground">{revenue}</span>
      </div>
    </div>
  );
};
