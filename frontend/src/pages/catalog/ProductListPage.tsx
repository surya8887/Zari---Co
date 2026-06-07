import { useEffect, useState } from 'react';
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
import PaginationWrapper from '@/components/common/PaginationWrapper';

import { SlidersHorizontal, X } from 'lucide-react';
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
    fetchProducts,
    isLoading,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Luxury editorial header title */}
        <PageHeader
          subtitle="Premium Natural Jewels"
          title="The BlueStone Inspired Collection"
          description="Pure diamonds, gold certifications, and timeless contemporary styles."
        />

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
                  { label: 'Under ₹1,000,000', value: 100000 },
                  { label: 'Under ₹2,000,000', value: 200000 },
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
                options={['Earrings', 'Rings', 'Necklaces', 'Bracelets', 'Bangles', 'Pendants', 'Chains']}
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

            {/* DRY PaginationWrapper component */}
            <PaginationWrapper
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;
