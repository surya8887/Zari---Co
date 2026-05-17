import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useProductStore } from '@/store/useProductStore';
import type { Product } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, ShoppingBag, SlidersHorizontal, ShieldCheck, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
  const {
    filteredProducts,
    filters,
    pagination,
    setCategory,
    setSort,
    setPriceRange,
    setPage,
    resetFilters,
  } = useProductStore();

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Reset filters on first mount to have a clean state
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  const handleAddToBag = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to your bag! ✨`, {
      description: "BIS Hallmarked & fully insured.",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    const added = isInWishlist(product.id);
    if (!added) {
      toast.success(`Saved ${product.name} to your Wishlist! ❤️`);
    } else {
      toast.info(`Removed ${product.name} from your Wishlist.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Page Editorial Header */}
        <div className="text-center mb-12 select-none">
          <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-[10px] mb-2.5">
            ✦ Timeless Craftsmanship ✦
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
            The Zari Fine Collection
          </h2>
          <div className="w-12 h-0.5 bg-[#8b7355]/40 mx-auto mt-4" />
        </div>

        {/* Sidebar Filters & Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 1. Filter Sidebar Pane */}
          <div className="bg-white border border-[#8b7355]/15 rounded-2xl p-6 shadow-sm h-fit select-none lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b7355]" />
                Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold uppercase tracking-wider text-[#8b7355] hover:text-[#6e583e] transition-colors cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Category Selector */}
            <div className="mb-6">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#4e3a24] mb-3">
                Category
              </h4>
              <div className="flex flex-col gap-2">
                {['All', 'Rings', 'Earrings', 'Pendants', 'Bangles', 'Gifts'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      filters.category === cat
                        ? 'bg-[#8b7355] text-white border-[#8b7355] font-semibold'
                        : 'bg-[#faf9f6] text-neutral-600 border-transparent hover:border-[#8b7355]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="mb-6">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#4e3a24] mb-3">
                Sort By
              </h4>
              <select
                value={filters.sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-lg p-2 text-xs text-neutral-700 focus:outline-none focus:border-[#8b7355]"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Price Range Filter Slider */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#4e3a24] mb-3">
                Price Range
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPriceRange([0, 50000])}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex-1 text-center cursor-pointer ${
                      filters.priceRange[1] === 50000
                        ? 'bg-[#8b7355]/10 text-[#8b7355] border-[#8b7355]'
                        : 'bg-[#faf9f6] text-neutral-500 border-neutral-100'
                    }`}
                  >
                    Under 50k
                  </button>
                  <button
                    onClick={() => setPriceRange([0, 150000])}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex-1 text-center cursor-pointer ${
                      filters.priceRange[1] === 150000
                        ? 'bg-[#8b7355]/10 text-[#8b7355] border-[#8b7355]'
                        : 'bg-[#faf9f6] text-neutral-500 border-neutral-100'
                    }`}
                  >
                    Under 1.5L
                  </button>
                </div>
                <button
                  onClick={() => setPriceRange([0, 300000])}
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border text-center cursor-pointer ${
                    filters.priceRange[1] === 300000
                      ? 'bg-[#8b7355]/10 text-[#8b7355] border-[#8b7355]'
                      : 'bg-[#faf9f6] text-neutral-500 border-neutral-100'
                  }`}
                >
                  Show All Prices
                </button>
              </div>
            </div>
          </div>

          {/* 2. Products Grid Panel */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white border border-neutral-100 rounded-2xl py-24 px-6 text-center shadow-sm select-none">
                <SlidersHorizontal className="w-12 h-12 text-[#8b7355]/30 mb-4" />
                <h3 className="text-base font-extrabold uppercase tracking-widest text-[#4e3a24] mb-2">
                  No Masterpieces Found
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-6">
                  We couldn't find matching jewelry. Try adjusting your category or resetting the filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="h-9 bg-[#8b7355] hover:bg-[#6e583e] text-white px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Result Statistics */}
                <div className="flex items-center justify-between mb-6 text-[10px] uppercase tracking-widest font-extrabold text-neutral-400 select-none px-1">
                  <span>Showing {filteredProducts.length} Exquisite Items</span>
                  <span>Page {pagination.page} of {pagination.totalPages}</span>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => {
                    const wishlisted = isInWishlist(prod.id);
                    return (
                      <Link
                        key={prod.id}
                        to={`/products/${prod.slug}`}
                        className="group bg-white border border-[#8b7355]/10 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-[#8b7355]/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
                      >
                        {/* Wishlist toggle */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, prod)}
                          className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-red-500'
                            }`}
                          />
                        </button>

                        {/* Image Frame */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#faf9f6] mb-5 border border-[#8b7355]/5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors duration-500" />
                          
                          {/* bis Hallmark */}
                          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-emerald-500/20 text-[7px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            <span>BIS Certified</span>
                          </div>
                        </div>

                        {/* Product details */}
                        <div className="text-center flex flex-col items-center px-1">
                          <span className="text-[9px] uppercase tracking-[2px] font-extrabold text-[#8b7355] mb-1.5">
                            {prod.category}
                          </span>
                          <h3 className="text-xs font-semibold text-neutral-800 tracking-wide line-clamp-1 group-hover:text-[#8b7355] transition-colors duration-300">
                            {prod.name}
                          </h3>
                          
                          {/* Rating stars */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex text-amber-500">
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </div>
                            <span className="text-[9px] font-bold text-neutral-500 mt-0.5">
                              {prod.rating} ({prod.reviewsCount})
                            </span>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="text-[#8b7355] font-serif font-bold text-sm">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-neutral-400 text-[10px] line-through tracking-wider">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Action CTA */}
                        <button
                          onClick={(e) => handleAddToBag(e, prod)}
                          className="w-full h-9 mt-5 border border-[#8b7355]/20 hover:border-[#8b7355] hover:bg-[#8b7355] text-[#8b7355] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Paginated Controls (shadcn styled) */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 select-none">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="h-9 px-4 rounded-lg border border-[#8b7355]/20 text-neutral-500 hover:border-[#8b7355] text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200"
                >
                  Prev
                </button>

                {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pagination.page === pNum
                        ? 'bg-[#8b7355] text-white border-transparent'
                        : 'border border-neutral-100 hover:border-[#8b7355]/30 text-neutral-600'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="h-9 px-4 rounded-lg border border-[#8b7355]/20 text-neutral-500 hover:border-[#8b7355] text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;
