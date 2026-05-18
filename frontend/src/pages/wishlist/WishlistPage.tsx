import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/store/useProductStore';

const WishlistPage = () => {
  const { items, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToBag = (product: Product) => {
    // Add item to bag
    addItem(product, 1);
    
    // Remove item from wishlist
    toggleWishlist(product);

    toast.success(`Moved ${product.name} to your Shopping Bag! ✦`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Editorial Header */}
        <div className="text-center mb-12 select-none">
          <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-[10px] mb-2.5">
            ✦ Your Saved Vault ✦
          </p>
          <h2 className="text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
            Your Wishlist
          </h2>
          <div className="w-12 h-0.5 bg-[#8b7355]/40 mx-auto mt-4" />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-neutral-100 rounded-3xl py-20 px-6 text-center shadow-sm select-none">
            <Heart className="w-16 h-16 text-red-200 mb-4 animate-pulse" />
            <h3 className="text-base font-extrabold uppercase tracking-widest text-[#4e3a24] mb-2">
              Your Wishlist Is Empty
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              You haven't saved any masterpieces to your private vault yet.
            </p>
            <Link
              to="/products"
              className="h-10 bg-[#8b7355] hover:bg-[#6e583e] text-white px-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto select-none">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((prod) => (
                <div 
                  key={prod.id}
                  className="group bg-white border border-[#8b7355]/10 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#8b7355]/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Delete button */}
                  <button
                    onClick={() => {
                      toggleWishlist(prod);
                      toast.info(`Removed ${prod.name} from wishlist.`);
                    }}
                    className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-neutral-400 hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Image gallery */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#faf9f6] mb-5 border border-[#8b7355]/5">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="text-center flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-[2px] font-extrabold text-[#8b7355] mb-1.5">
                      {prod.category}
                    </span>
                    <h3 className="text-xs font-semibold text-neutral-800 tracking-wide line-clamp-1 group-hover:text-[#8b7355] transition-colors duration-300">
                      {prod.name}
                    </h3>
                    
                    {/* Prices */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[#8b7355] font-serif font-bold text-xs">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-neutral-400 text-[10px] line-through tracking-wider">
                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Move to bag Action */}
                  <button
                    onClick={() => handleMoveToBag(prod)}
                    className="w-full h-9 mt-5 border border-[#8b7355]/20 hover:border-[#8b7355] hover:bg-[#8b7355] text-[#8b7355] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move To Bag</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
