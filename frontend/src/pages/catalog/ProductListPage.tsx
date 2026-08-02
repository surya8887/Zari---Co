import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useProductStore } from '@/store/useProductStore';
import type { Product } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

// DRY Extracted Reusable Components
import PageHeader from '@/components/common/PageHeader';
import FilterSection from '@/components/common/FilterSection';
import FilterCheckboxGroup from '@/components/common/FilterCheckboxGroup';
import PriceRangeFilter from '@/components/common/PriceRangeFilter';
import ProductCard from '@/components/common/ProductCard';
import EmptyState from '@/components/common/EmptyState';

import { SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    filteredProducts,
    filters,
    pagination,
    categories,
    toggleFilter,
    setBulkFilters,
    setSort,
    setPriceRange,
    setPage,
    resetFilters,
    fetchProducts,
    isLoading,
  } = useProductStore();

  const dynamicProductTypes = categories.length > 0
    ? Array.from(new Set(categories.map(c => c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase())))
    : ['Earrings', 'Rings', 'Necklaces', 'Bracelets', 'Bangles', 'Pendants', 'Chains'];

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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMore = pagination.page < pagination.totalPages;

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(pagination.page + 1);
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    const currentSentinel = observerRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isLoading, pagination.page, setPage]);

  const handleAddToBag = (product: Product) => {
    addItem(product, 1);
    toast.success(`${product.name} added to your bag! ✨`, {
      description: "BIS Hallmarked conflict-free diamond.",
    });
  };

  const handleToggleWishlist = (product: Product) => {
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

  const renderFiltersContent = () => (
    <>
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 mb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b7355]" />
          Refine Search ({activeFiltersCount})
        </span>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold uppercase tracking-wider text-[#8b7355] hover:text-[#6e583e] transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price section accordion */}
      <FilterSection
        title="Price Range"
        isOpen={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <PriceRangeFilter
          selectedValue={filters.priceRange[1]}
          onChange={(val) => setPriceRange([0, val])}
          options={[
            { label: 'Under ₹20,000', value: 20000 },
            { label: 'Under ₹50,000', value: 50000 },
            { label: 'Under ₹100,000', value: 100000 },
            { label: 'Under ₹200,000', value: 200000 },
            { label: 'Show All Prices', value: 300000 },
          ]}
        />
      </FilterSection>

      {/* Product Type section accordion */}
      <FilterSection
        title="Product Type"
        isOpen={expandedSections.type}
        onToggle={() => toggleSection('type')}
      >
        <FilterCheckboxGroup
          options={dynamicProductTypes}
          selectedValues={filters.productTypes}
          onChange={(val) => toggleFilter('productTypes', val)}
        />
      </FilterSection>

      {/* Metal section accordion */}
      <FilterSection
        title="Metal Type"
        isOpen={expandedSections.metal}
        onToggle={() => toggleSection('metal')}
      >
        <FilterCheckboxGroup
          options={['Gold', 'Diamond', 'Silver', 'Platinum', 'Rose Gold']}
          selectedValues={filters.metals}
          onChange={(val) => toggleFilter('metals', val)}
        />
      </FilterSection>

      {/* Gender preset accordion */}
      <FilterSection
        title="Gender Preset"
        isOpen={expandedSections.gender}
        onToggle={() => toggleSection('gender')}
      >
        <FilterCheckboxGroup
          options={['Women', 'Men', 'Kids', 'Unisex']}
          selectedValues={filters.genders}
          onChange={(val) => toggleFilter('genders', val)}
        />
      </FilterSection>

      {/* Offers accordion */}
      <FilterSection
        title="Exclusive Offers"
        isOpen={expandedSections.offers}
        onToggle={() => toggleSection('offers')}
      >
        <FilterCheckboxGroup
          options={['Discount', 'New Arrival', 'Best Seller', 'Ready to Ship']}
          selectedValues={filters.offers}
          onChange={(val) => toggleFilter('offers', val)}
        />
      </FilterSection>

      {/* Occasions accordion */}
      <FilterSection
        title="Occasions"
        isOpen={expandedSections.occasion}
        onToggle={() => toggleSection('occasion')}
      >
        <FilterCheckboxGroup
          options={['Wedding', 'Daily Wear', 'Party Wear', 'Gifting', 'Engagement', 'Anniversary']}
          selectedValues={filters.occasions}
          onChange={(val) => toggleFilter('occasions', val)}
        />
      </FilterSection>

      {/* Styles accordion */}
      <FilterSection
        title="Design Styles"
        isOpen={expandedSections.style}
        onToggle={() => toggleSection('style')}
      >
        <FilterCheckboxGroup
          options={['Classic', 'Modern', 'Traditional', 'Minimal', 'Luxury']}
          selectedValues={filters.styles}
          onChange={(val) => toggleFilter('styles', val)}
        />
      </FilterSection>

      {/* Design patterns/motifs accordion */}
      <FilterSection
        title="Patterns / Motifs"
        isOpen={expandedSections.design}
        onToggle={() => toggleSection('design')}
        isLast
      >
        <FilterCheckboxGroup
          options={['Solitaire', 'Floral', 'Geometric', 'Heart', 'Pearl', 'Gemstone']}
          selectedValues={filters.designs}
          onChange={(val) => toggleFilter('designs', val)}
        />
      </FilterSection>
    </>
  );

  const getHeaderDetails = () => {
    switch (filters.category.toLowerCase()) {
      case 'all':
        return {
          subtitle: "Premium Natural Jewels",
          title: "The Znira & Co. Masterpiece Collection",
          description: "Explore our complete range of certified conflict-free diamonds and gold jewelry."
        };
      case 'collections':
        return {
          subtitle: "Editorial Showcase",
          title: "Our Exclusive Signature Collections",
          description: "Discover curated, themed masterpieces designed for your life's special milestones."
        };
      case 'try at home':
        return {
          subtitle: "Znira & Co. Comfort Service",
          title: "Select & Try At Home",
          description: "Shortlist your favorite designs and our consultants will bring them to your doorstep for a free trial."
        };
      case 'bespoke':
        return {
          subtitle: "Custom Craftsmanship",
          title: "Bespoke Custom Jewelry",
          description: "Collaborate with our master craftsmen to create unique, hand-engraved jewelry designed for you."
        };
      case '10+1 plan':
        return {
          subtitle: "Investment Savings Scheme",
          title: "The 10+1 Jeweller Purchase Plan",
          description: "Save monthly for 10 months and get the 11th installment free on Znira & Co. Start today."
        };
      default:
        return {
          subtitle: "Exquisite Designs",
          title: `${filters.category} Collection`,
          description: `Handcrafted premium certified ${filters.category.toLowerCase()} styled for contemporary luxury.`
        };
    }
  };

  const headerDetails = getHeaderDetails();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Luxury editorial header title */}
        <PageHeader
          subtitle={headerDetails.subtitle}
          title={headerDetails.title}
          description={headerDetails.description}
        />

        {/* Dynamic Promotional/Marketing service banners for non-categories */}
        {filters.category.toLowerCase() === 'try at home' && (
          <div className="mb-8 bg-gradient-to-r from-[#8b7355]/10 via-[#8b7355]/5 to-transparent border border-[#8b7355]/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm select-none">
            <div className="flex-grow space-y-3 text-center md:text-left">
              <span className="inline-block bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Luxury Doorstep Service
              </span>
              <h3 className="text-xl font-serif font-semibold text-[#4e3a24]">Try Before You Buy</h3>
              <p className="text-xs text-[#6e583e] max-w-2xl leading-relaxed">
                Shortlist your favorite jewelry pieces online, and our expert jewelry consultants will bring them to the comfort of your home for a private viewing. 100% free, secure, and with no obligation to purchase.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4e3a24] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b7355]" />
                  1. Shortlist Items
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4e3a24] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b7355]" />
                  2. Select Time Slot
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4e3a24] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b7355]" />
                  3. Try at Home
                </div>
              </div>
            </div>
            <button className="flex-shrink-0 bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
              Book Home Trial
            </button>
          </div>
        )}

        {filters.category.toLowerCase() === 'bespoke' && (
          <div className="mb-8 bg-gradient-to-r from-[#8b7355]/15 via-[#8b7355]/5 to-transparent border border-[#8b7355]/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm select-none">
            <div className="flex-grow space-y-3 text-center md:text-left">
              <span className="inline-block bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Custom Jewelry Atelier
              </span>
              <h3 className="text-xl font-serif font-semibold text-[#4e3a24]">Craft Your Dream Jewelry</h3>
              <p className="text-xs text-[#6e583e] max-w-2xl leading-relaxed">
                Work directly with our master craftsmen and award-winning designers to bring your unique vision to life. From initial sketch to certified final masterpiece, we customize every detail.
              </p>
            </div>
            <button className="flex-shrink-0 bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
              Consult a Designer
            </button>
          </div>
        )}

        {filters.category.toLowerCase() === '10+1 plan' && (
          <div className="mb-8 bg-gradient-to-r from-[#8b7355]/10 via-[#8b7355]/5 to-transparent border border-[#8b7355]/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm select-none">
            <div className="flex-grow space-y-3 text-center md:text-left">
              <span className="inline-block bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Savings & Purchase Plan
              </span>
              <h3 className="text-xl font-serif font-semibold text-[#4e3a24]">The Znira & Co. 10+1 Scheme</h3>
              <p className="text-xs text-[#6e583e] max-w-2xl leading-relaxed">
                Pay 10 monthly installments towards your favorite gold or diamond jewelry, and we will contribute the 11th installment for free. Start planning for your wedding or anniversary today.
              </p>
            </div>
            <button className="flex-shrink-0 bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
              Enroll / Calculate
            </button>
          </div>
        )}

        {/* Mobile Filters Trigger */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full h-11 bg-white border border-[#8b7355]/20 rounded-xl text-xs font-bold uppercase tracking-widest text-[#8b7355] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all hover:bg-[#faf9f6]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Refine Collection ({activeFiltersCount})</span>
          </button>
        </div>

        {/* Filters and catalog grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 1. Sidebar Advanced Filters (Desktop) */}
          <div className="hidden lg:block bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm h-fit select-none lg:sticky lg:top-28 max-h-[80vh] overflow-y-auto scrollbar-thin">
            {renderFiltersContent()}
          </div>

          {/* 2. Main Products Catalog Grid */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              {/* Dynamic Active Filters Pills Listing */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm select-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e3a24]/50 self-center mr-1">Active Refinements:</span>
                  
                  {filters.priceRange[1] !== 300000 && (
                    <span className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>Under ₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
                      <button onClick={() => setPriceRange([0, 300000])} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  )}
 
                  {filters.productTypes.map((type) => (
                    <span key={type} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{type}</span>
                      <button onClick={() => toggleFilter('productTypes', type)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
 
                  {filters.metals.map((met) => (
                    <span key={met} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{met}</span>
                      <button onClick={() => toggleFilter('metals', met)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
 
                  {filters.genders.map((gen) => (
                    <span key={gen} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{gen}</span>
                      <button onClick={() => toggleFilter('genders', gen)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
 
                  {filters.offers.map((off) => (
                    <span key={off} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{off}</span>
                      <button onClick={() => toggleFilter('offers', off)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
 
                  {filters.occasions.map((occ) => (
                    <span key={occ} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{occ}</span>
                      <button onClick={() => toggleFilter('occasions', occ)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
 
                  {filters.styles.map((sty) => (
                    <span key={sty} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{sty}</span>
                      <button onClick={() => toggleFilter('styles', sty)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
 
                  {filters.designs.map((des) => (
                    <span key={des} className="inline-flex items-center gap-1 bg-[#8b7355]/10 text-[#8b7355] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8b7355]/20">
                      <span>{des}</span>
                      <button onClick={() => toggleFilter('designs', des)} className="cursor-pointer hover:text-[#6e583e]"><X className="w-3 h-3" /></button>
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

              {isLoading ? (
                /* Premium Skeleton Loading State */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm animate-pulse">
                      <div className="aspect-square bg-slate-100 rounded-2xl mb-4" />
                      <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
                      <div className="flex justify-between items-center mt-6">
                        <div className="h-5 bg-slate-100 rounded w-1/3" />
                        <div className="h-9 bg-slate-100 rounded-xl w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                /* DRY Empty State component */
                <EmptyState
                  title="No Matching Jewelry Found"
                  description="Try adjusting your filters or resetting refinement parameters."
                  onAction={resetFilters}
                  actionLabel="Reset Filters"
                />
              ) : (
                /* Product Grid using DRY ProductCard */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToBag={handleAddToBag}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={isInWishlist(prod.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Infinite Scroll Sentinel / Loaded State */}
            {hasMore ? (
              <div 
                ref={observerRef} 
                className="py-12 flex justify-center items-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#8b7355]/20 border-t-[#8b7355] rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b7355]/60 animate-pulse">
                    Loading more masterpieces...
                  </p>
                </div>
              </div>
            ) : (
              filteredProducts.length > 0 && (
                <div className="py-16 text-center select-none">
                  <div className="w-16 h-0.5 bg-[#8b7355]/25 mx-auto mb-3" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    You have viewed all {filteredProducts.length} masterpieces
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8b7355]" />
                Filters & Refinements
              </span>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 -mr-2 text-neutral-500 hover:text-neutral-800 focus:outline-none cursor-pointer"
                aria-label="Close Filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filters Scroll Area */}
            <div className="flex-grow overflow-y-auto p-5 select-none scrollbar-thin bg-white">
              {renderFiltersContent()}
            </div>
            
            {/* Drawer Actions */}
            <div className="p-5 border-t border-neutral-100 bg-[#faf9f6] flex gap-3">
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 h-10 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 h-10 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
