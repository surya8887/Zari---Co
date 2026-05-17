import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useProductStore } from '@/store/useProductStore';
import type { Product } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, ShoppingBag, SlidersHorizontal, ShieldCheck, Star, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    filteredProducts,
    filters,
    pagination,
    toggleFilter,
    setBulkFilters,
    setSort,
    setPriceRange,
    setPage,
    resetFilters,
  } = useProductStore();

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Accordion Expand/Collapse States
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    type: true,
    metal: true,
    gender: true,
    offers: false,
    occasion: false,
    style: false,
    design: false,
  });

  const toggleSection = (sec: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // 1. Initial Load: Read URL query parameters to rehydrate Zustand filter states
  useEffect(() => {
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const metals = searchParams.get('metals')?.split(',').filter(Boolean) || [];
    const genders = searchParams.get('genders')?.split(',').filter(Boolean) || [];
    const offers = searchParams.get('offers')?.split(',').filter(Boolean) || [];
    const occasions = searchParams.get('occasions')?.split(',').filter(Boolean) || [];
    const styles = searchParams.get('styles')?.split(',').filter(Boolean) || [];
    const designs = searchParams.get('designs')?.split(',').filter(Boolean) || [];
    const category = searchParams.get('category') || 'All';
    const maxPrice = Number(searchParams.get('maxPrice')) || 300000;

    setBulkFilters({
      category,
      priceRange: [0, maxPrice],
      productTypes: types,
      metals,
      genders,
      offers,
      occasions,
      styles,
      designs,
    });
  }, []);

  // 2. State Change: Write updated Zustand filter states to browser history URL params
  useEffect(() => {
    const params: Record<string, string> = {};

    if (filters.productTypes.length > 0) params.types = filters.productTypes.join(',');
    if (filters.metals.length > 0) params.metals = filters.metals.join(',');
    if (filters.genders.length > 0) params.genders = filters.genders.join(',');
    if (filters.offers.length > 0) params.offers = filters.offers.join(',');
    if (filters.occasions.length > 0) params.occasions = filters.occasions.join(',');
    if (filters.styles.length > 0) params.styles = filters.styles.join(',');
    if (filters.designs.length > 0) params.designs = filters.designs.join(',');
    if (filters.category !== 'All') params.category = filters.category;
    if (filters.priceRange[1] !== 300000) params.maxPrice = String(filters.priceRange[1]);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleAddToBag = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to your bag! ✨`, {
      description: "BIS Hallmarked conflict-free diamond.",
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

  const activeFiltersCount = 
    filters.productTypes.length +
    filters.metals.length +
    filters.genders.length +
    filters.offers.length +
    filters.occasions.length +
    filters.styles.length +
    filters.designs.length +
    (filters.priceRange[1] !== 300000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* BlueStone Editorial Title bar */}
        <div className="text-center mb-8 select-none bg-white border border-slate-100 rounded-3xl py-8 shadow-sm">
          <p className="text-blue-600 font-bold uppercase tracking-[3px] text-[9px] mb-2">
            ✦ Premium Natural Jewels ✦
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 font-semibold tracking-wide">
            The BlueStone Inspired Collection
          </h2>
          <p className="text-xs text-slate-400 mt-2">Pure diamonds, gold certifications, and timeless contemporary styles.</p>
        </div>

        {/* Filters and catalog grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 1. Sidebar Advanced Filters */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm h-fit select-none lg:sticky lg:top-28 max-h-[80vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                Refine Search ({activeFiltersCount})
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Price section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Price Range</span>
                {expandedSections.price ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.price && (
                <div className="flex flex-col gap-2 mt-3.5">
                  {[
                    { label: 'Under ₹20,000', value: 20000 },
                    { label: 'Under ₹50,000', value: 50000 },
                    { label: 'Under ₹1,000,000', value: 100000 },
                    { label: 'Under ₹2,000,000', value: 200000 },
                    { label: 'Show All Prices', value: 300000 },
                  ].map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => setPriceRange([0, pr.value])}
                      className={`text-left text-[11px] px-3 py-2 rounded-xl transition-all cursor-pointer ${
                        filters.priceRange[1] === pr.value
                          ? 'bg-blue-50/70 text-blue-700 font-semibold border border-blue-200'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100/50'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Type section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('type')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Product Type</span>
                {expandedSections.type ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.type && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Earrings', 'Rings', 'Necklaces', 'Bracelets', 'Bangles', 'Pendants', 'Chains'].map((type) => {
                    const checked = filters.productTypes.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('productTypes', type)}
                          className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{type}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Metal section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('metal')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Metal Type</span>
                {expandedSections.metal ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.metal && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Gold', 'Diamond', 'Silver', 'Platinum', 'Rose Gold'].map((met) => {
                    const checked = filters.metals.includes(met);
                    return (
                      <label key={met} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('metals', met)}
                          className="rounded text-blue-600 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{met}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Gender section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('gender')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Gender Preset</span>
                {expandedSections.gender ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.gender && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Women', 'Men', 'Kids', 'Unisex'].map((gen) => {
                    const checked = filters.genders.includes(gen);
                    return (
                      <label key={gen} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('genders', gen)}
                          className="rounded text-blue-600 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{gen}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Offers section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('offers')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Exclusive Offers</span>
                {expandedSections.offers ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.offers && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Discount', 'New Arrival', 'Best Seller', 'Ready to Ship'].map((off) => {
                    const checked = filters.offers.includes(off);
                    return (
                      <label key={off} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('offers', off)}
                          className="rounded text-blue-600 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{off}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Occasion section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('occasion')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Occasions</span>
                {expandedSections.occasion ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.occasion && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Wedding', 'Daily Wear', 'Party Wear', 'Gifting', 'Engagement', 'Anniversary'].map((occ) => {
                    const checked = filters.occasions.includes(occ);
                    return (
                      <label key={occ} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('occasions', occ)}
                          className="rounded text-blue-600 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{occ}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Style section Accordion */}
            <div className="border-b border-slate-100 py-3.5">
              <button
                onClick={() => toggleSection('style')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Design Styles</span>
                {expandedSections.style ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.style && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Classic', 'Modern', 'Traditional', 'Minimal', 'Luxury'].map((sty) => {
                    const checked = filters.styles.includes(sty);
                    return (
                      <label key={sty} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('styles', sty)}
                          className="rounded text-blue-600 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{sty}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Design patterns section Accordion */}
            <div className="py-3.5">
              <button
                onClick={() => toggleSection('design')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer"
              >
                <span>Patterns / Motifs</span>
                {expandedSections.design ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedSections.design && (
                <div className="flex flex-col gap-2 mt-3">
                  {['Solitaire', 'Floral', 'Geometric', 'Heart', 'Pearl', 'Gemstone'].map((des) => {
                    const checked = filters.designs.includes(des);
                    return (
                      <label key={des} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter('designs', des)}
                          className="rounded text-blue-600 accent-blue-600 w-3.5 h-3.5 border-slate-300"
                        />
                        <span>{des}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. Main Products Catalog Grid */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              {/* Dynamic Active Filters Pills Listing */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm select-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 self-center mr-1">Active Refinements:</span>
                  
                  {filters.priceRange[1] !== 300000 && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>Under ₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
                      <button onClick={() => setPriceRange([0, 300000])} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  )}

                  {filters.productTypes.map((type) => (
                    <span key={type} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{type}</span>
                      <button onClick={() => toggleFilter('productTypes', type)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.metals.map((met) => (
                    <span key={met} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{met}</span>
                      <button onClick={() => toggleFilter('metals', met)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.genders.map((gen) => (
                    <span key={gen} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{gen}</span>
                      <button onClick={() => toggleFilter('genders', gen)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.offers.map((off) => (
                    <span key={off} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{off}</span>
                      <button onClick={() => toggleFilter('offers', off)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.occasions.map((occ) => (
                    <span key={occ} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{occ}</span>
                      <button onClick={() => toggleFilter('occasions', occ)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.styles.map((sty) => (
                    <span key={sty} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{sty}</span>
                      <button onClick={() => toggleFilter('styles', sty)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.designs.map((des) => (
                    <span key={des} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                      <span>{des}</span>
                      <button onClick={() => toggleFilter('designs', des)} className="cursor-pointer hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Sorting and result statistics */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm select-none">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Showing {filteredProducts.length} masterpieces found
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sort By:</span>
                  <select
                    onChange={(e) => setSort(e.target.value as any)}
                    value={filters.sort}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="newest">New Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Customer Rated</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl py-24 px-6 text-center shadow-sm select-none">
                  <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-4 animate-pulse" />
                  <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-700 mb-2">
                    No Matching Jewelry Found
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
                    Try adjusting your filters or resetting refinement parameters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer shadow-md active:scale-95"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                /* Product Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => {
                    const wishlisted = isInWishlist(prod.id);
                    return (
                      <Link
                        key={prod.id}
                        to={`/products/${prod.slug}`}
                        className="group bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
                      >
                        {/* Wishlist toggle */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, prod)}
                          className="absolute top-6 right-6 z-10 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-100"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'
                            }`}
                          />
                        </button>

                        {/* Image Frame */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 mb-5 border border-slate-100/50">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors duration-500" />
                          
                          {/* BIS Hallmark */}
                          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded border border-emerald-500/20 text-[7px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>BIS 916 Assured</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="text-center flex flex-col items-center px-1">
                          <span className="text-[9px] uppercase tracking-[2px] font-extrabold text-blue-600 mb-1.5">
                            {prod.metal} • {prod.productType}
                          </span>
                          <h3 className="text-xs font-semibold text-slate-800 tracking-wide line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                            {prod.name}
                          </h3>
                          
                          {/* Stars */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex text-amber-400">
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 mt-0.5">
                              {prod.rating} ({prod.reviewsCount})
                            </span>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="text-slate-800 font-serif font-bold text-sm">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-slate-400 text-[10px] line-through tracking-wider">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Add to Bag trigger */}
                        <button
                          onClick={(e) => handleAddToBag(e, prod)}
                          className="w-full h-9 mt-5 border border-blue-200 hover:border-blue-600 bg-blue-50/40 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 select-none">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="h-9 px-4 rounded-xl border border-slate-200 text-slate-500 hover:border-blue-600 text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200"
                >
                  Prev
                </button>

                {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pagination.page === pNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-100 hover:border-blue-600/30 text-slate-600'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="h-9 px-4 rounded-xl border border-slate-200 text-slate-500 hover:border-blue-600 text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200"
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
