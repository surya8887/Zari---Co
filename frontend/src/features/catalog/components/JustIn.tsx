import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck } from "lucide-react";
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

const JustIn = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Display the first 4 products from the database catalog
  const displayProducts = products.slice(0, 4);

  const handleAddToBag = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(prod, 1);
    toast.success(`${prod.name} added to your bag! ✨`, {
      description: "BIS Hallmarked conflict-free diamond.",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(prod);
    if (!isInWishlist(prod.id)) {
      toast.success(`Saved ${prod.name} to your Wishlist! ❤️`);
    } else {
      toast.info(`Removed ${prod.name} from your Wishlist.`);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <section className="py-20 bg-[#faf9f6]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-neutral-500 animate-pulse text-sm font-semibold tracking-widest">
            LOADING LATEST MASTERPIECES...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#faf9f6]">
      <div className="container mx-auto px-6">
        {/* Elegant Section Title */}
        <div className="text-center mb-16 select-none">
          <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-xs mb-3">
            ✨ Luxury Additions
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
            Just In: The Latest Masterpieces
          </h2>
          <div className="w-16 h-0.5 bg-[#8b7355]/40 mx-auto mt-4" />
          <p className="text-xs text-neutral-500 tracking-wider max-w-md mx-auto mt-3">
            Explore our newly arrived, hand-crafted diamond and gold creations, designed with unmatched precision.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((prod) => {
            const isWish = isInWishlist(prod.id);
            const label = prod.offers?.[0] || "New Launch";

            return (
              <Link 
                to={`/products/${prod.slug}`}
                key={prod.id} 
                className="group bg-white border border-[#8b7355]/10 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#8b7355]/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Product Label Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-[#8b7355] text-white text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                    {label}
                  </span>
                </div>

                {/* Heart Wishlist Icon */}
                <button 
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, prod)}
                  className="absolute top-6 right-6 z-10 p-2 bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer animate-none"
                >
                  <Heart className={`w-3.5 h-3.5 transition-colors ${isWish ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`} />
                </button>

                {/* Product Image Frame */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#faf9f6] mb-5 border border-[#8b7355]/5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors duration-500" />
                  
                  {/* Certified Hallmark Seal Overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-emerald-500/20 text-[7px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    <span>BIS Hallmarked</span>
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="text-center flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-[2px] font-extrabold text-[#8b7355] mb-1.5">
                    {prod.category}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-800 tracking-wide line-clamp-1 group-hover:text-[#8b7355] transition-colors duration-300">
                    {prod.name}
                  </h3>
                  
                  {/* Price Display */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#8b7355] font-serif font-bold text-base">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-neutral-400 text-xs line-through tracking-wider">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quick Add Button (Luxury overlay effect) */}
                <button 
                  type="button"
                  onClick={(e) => handleAddToBag(e, prod)}
                  className="w-full h-10 mt-5 border border-[#8b7355]/20 hover:border-[#8b7355] hover:bg-[#8b7355] text-[#8b7355] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add To Bag</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JustIn;
