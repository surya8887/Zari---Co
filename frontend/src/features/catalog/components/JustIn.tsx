import { ShoppingCart, Heart, ShieldCheck } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  label: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Starlight Solitaire Ring",
    price: "₹45,000",
    originalPrice: "₹52,000",
    image: "/images/gold_diamond_ring.png",
    category: "Rings",
    label: "Bestseller",
  },
  {
    id: 2,
    name: "Dewdrop Cascade Earrings",
    price: "₹68,000",
    originalPrice: "₹79,000",
    image: "/images/gold_drop_earrings.png",
    category: "Earrings",
    label: "New Launch",
  },
  {
    id: 3,
    name: "Aurelia Marquise Necklace",
    price: "₹2,45,000",
    originalPrice: "₹2,75,000",
    image: "/images/gold_necklace.png",
    category: "Necklaces",
    label: "Heritage",
  },
  {
    id: 4,
    name: "Royal Stacked Bangles",
    price: "₹1,89,000",
    originalPrice: "₹2,10,000",
    image: "/images/gold_bangles.png",
    category: "Bangles",
    label: "Limited",
  },
];

const JustIn = () => {
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
          {PRODUCTS.map((prod) => (
            <div 
              key={prod.id} 
              className="group bg-white border border-[#8b7355]/10 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#8b7355]/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Product Label Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-[#8b7355] text-white text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                  {prod.label}
                </span>
              </div>

              {/* Heart Wishlist Icon */}
              <button className="absolute top-6 right-6 z-10 p-2 bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer">
                <Heart className="w-3.5 h-3.5" />
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
                    {prod.price}
                  </span>
                  <span className="text-neutral-400 text-xs line-through tracking-wider">
                    {prod.originalPrice}
                  </span>
                </div>
              </div>

              {/* Quick Add Button (Luxury overlay effect) */}
              <button className="w-full h-10 mt-5 border border-[#8b7355]/20 hover:border-[#8b7355] hover:bg-[#8b7355] text-[#8b7355] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add To Bag</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JustIn;
