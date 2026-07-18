import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ShieldCheck, Star } from 'lucide-react';
import type { Product } from '@/store/useProductStore';

interface ProductCardProps {
  product: Product;
  onAddToBag: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard = ({
  product,
  onAddToBag,
  onToggleWishlist,
  isWishlisted,
}: ProductCardProps) => {
  const handleAddToBagClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToBag(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white border border-[#8b7355]/10 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#8b7355]/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Wishlist toggle */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-6 right-6 z-10 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#8b7355]/10"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-red-500'
          }`}
        />
      </button>

      {/* Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#faf9f6] mb-5 border border-[#8b7355]/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors duration-500" />
        
        {/* BIS Hallmark */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded border border-emerald-500/20 text-[7px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>BIS 916 Assured</span>
        </div>
      </div>

      {/* Details */}
      <div className="text-center flex flex-col items-center px-1">
        <span className="text-[9px] uppercase tracking-[2px] font-extrabold text-[#8b7355] mb-1.5">
          {product.metal} • {product.productType}
        </span>
        <h3 className="text-xs font-semibold text-neutral-800 tracking-wide line-clamp-1 group-hover:text-[#8b7355] transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Stars */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex text-amber-400">
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>
          <span className="text-[9px] font-bold text-neutral-500 mt-0.5">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-[#8b7355] font-serif font-bold text-sm">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-neutral-400 text-[10px] line-through tracking-wider">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Add to Bag trigger */}
      <button
        onClick={handleAddToBagClick}
        className="w-full h-9 mt-5 border border-[#8b7355]/20 hover:border-[#8b7355] bg-[#8b7355]/5 hover:bg-[#8b7355] text-[#8b7355] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
      >
        <ShoppingBag className="w-3 h-3" />
        <span>Add to Bag</span>
      </button>
    </Link>
  );
};
export default ProductCard;
