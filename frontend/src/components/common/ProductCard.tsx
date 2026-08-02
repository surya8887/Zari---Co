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

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white border border-[#8b7355]/15 rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:shadow-[#8b7355]/10 hover:border-[#8b7355]/40 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Wishlist toggle */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-5 right-5 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:scale-110 active:scale-90 transition-all cursor-pointer border border-[#8b7355]/15"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-neutral-400 hover:text-red-500'
          }`}
        />
      </button>

      {/* Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#faf9f6] mb-4 border border-[#8b7355]/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#8b7355] text-white text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* BIS Hallmark */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/20 text-[7px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>BIS 916 Assured</span>
        </div>
      </div>

      {/* Details */}
      <div className="text-center flex flex-col items-center px-1">
        <span className="text-[9px] uppercase tracking-[2.5px] font-extrabold text-[#8b7355] mb-1">
          {product.metal} • {product.productType}
        </span>
        <h3 className="text-xs font-bold text-neutral-800 tracking-wide line-clamp-1 group-hover:text-[#8b7355] transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Stars */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex text-amber-400">
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-[9.5px] font-bold text-neutral-500 mt-0.5">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#8b7355] font-serif font-extrabold text-base">
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
        className="w-full h-9.5 mt-4 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-xl text-[9.5px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#8b7355]/15 active:scale-[0.97]"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Add to Bag</span>
      </button>
    </Link>
  );
};
export default ProductCard;
