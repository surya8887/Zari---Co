import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Star, ShieldCheck, ShoppingBag, Heart, ArrowLeft, Send, Sparkles, ClipboardList, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { getProductBySlug, selectedProduct, addReview, products, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<string>('Size 12');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      if (products.length === 0) {
        await fetchProducts();
      }
    };
    loadProduct();
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (products.length > 0 && slug) {
      const p = getProductBySlug(slug);
      if (!p) {
        toast.error("Masterpiece not found!");
        navigate('/products');
      }
    }
  }, [slug, products, getProductBySlug, navigate]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.image);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8b7355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const p = selectedProduct;
  const wishlisted = isInWishlist(p.id);

  // Helper to strip HTML tags for a clean brief description
  const getBriefDescription = (desc: string) => {
    // Get part before any specs separator
    const detailsPart = desc.split(/~GIA-SPECS~|<!--GIA-SPECS-->/)[0] || desc;
    const stripHtml = (html: string) => {
      return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&times;/g, '×')
        .replace(/&amp;/g, '&')
        .trim();
    };
    const cleanText = stripHtml(detailsPart);
    
    // Remove "Product Description" prefix (with/without colon) if present
    let result = cleanText.replace(/^Product Description:?\s*/i, '');
    
    // Find "Key Features" and cut before it if present
    const keyFeaturesIndex = result.search(/Key Features:?/i);
    if (keyFeaturesIndex !== -1) {
      result = result.substring(0, keyFeaturesIndex).trim();
    }
    return result;
  };

  // Helper to remove redundant headers from the parsed sections
  const cleanHtml = (html: string, type: 'details' | 'specs' | 'care') => {
    let cleaned = html.trim();
    cleaned = cleaned.replace(/^(<br\s*\/?>|&nbsp;|\s)+/i, '');
    cleaned = cleaned.replace(/(<br\s*\/?>|&nbsp;|\s)+$/i, '');
    
    if (type === 'details') {
      cleaned = cleaned.replace(/^<h3>Product Description:?<\/h3>/i, '');
      cleaned = cleaned.replace(/^<h2>Product Description:?<\/h2>/i, '');
    } else if (type === 'specs') {
      cleaned = cleaned.replace(/^<p><strong>Specifications:?<\/strong><\/p>/i, '');
      cleaned = cleaned.replace(/^<h2>Specifications:?<\/h2>/i, '');
    } else if (type === 'care') {
      cleaned = cleaned.replace(/^<h2>Care &amp; Preservation Guidance:?<\/h2>/i, '');
      cleaned = cleaned.replace(/^<h2>Care & Preservation Guidance:?<\/h2>/i, '');
    }
    
    cleaned = cleaned.replace(/^(<br\s*\/?>|&nbsp;|\s)+/i, '');
    cleaned = cleaned.replace(/(<br\s*\/?>|&nbsp;|\s)+$/i, '');
    return cleaned;
  };

  // Parse the sections from description
  const parseDescription = (desc: string) => {
    let details = '';
    let specs = '';
    let care = '';

    const parts = desc.split(/~GIA-SPECS~|~CARE-GUIDES~|<!--GIA-SPECS-->|<!--CARE-GUIDES-->/);

    if (parts.length >= 3) {
      details = parts[0] || '';
      specs = parts[1] || '';
      care = parts[2] || '';
    } else if (parts.length === 2) {
      details = parts[0] || '';
      if (desc.includes('GIA-SPECS') || desc.includes('~GIA-SPECS~')) {
        specs = parts[1] || '';
      } else {
        care = parts[1] || '';
      }
    } else {
      details = desc || '';
    }

    return { 
      detailsHtml: cleanHtml(details, 'details'), 
      specsHtml: cleanHtml(specs, 'specs'), 
      careHtml: cleanHtml(care, 'care') 
    };
  };

  const { detailsHtml, specsHtml, careHtml } = parseDescription(p.description);

  const handleAddToBag = () => {
    addItem(p, quantity, selectedSize);
    toast.success(`${p.name} added to your bag! ✨`, {
      description: `Quantity: ${quantity} | Size: ${selectedSize} | Free Insured Shipping.`,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(p);
    const added = isInWishlist(p.id);
    if (!added) {
      toast.success(`Saved ${p.name} to your Wishlist! ❤️`);
    } else {
      toast.info(`Removed ${p.name} from your Wishlist.`);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      toast.warning("Please fill out all review fields.");
      return;
    }

    addReview(p.id, {
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });

    toast.success("Thank you for your valuable feedback! ✦");
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-350">
        {/* Back Link */}
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b7355] hover:text-[#6e583e] mb-8 select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Collection
        </Link>

        {/* Core Product Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Column: Image Showcase */}
          <div className="flex flex-col select-none">
            {/* Visual Frame */}
            <div className="relative aspect-square bg-white border border-[#8b7355]/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={activeImage || p.image}
                alt={p.name}
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              />

              {/* BIS Hallmark Floating Tag */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-500/20 shadow-md text-[9px] sm:text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 scale-90 sm:scale-100 origin-bottom-left select-none">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
                <div>
                  <span className="block text-[7px] text-neutral-400 font-bold tracking-normal uppercase leading-none mb-0.5">Assured Authenticity</span>
                  <span>BIS 916 Hallmarked</span>
                </div>
              </div>
            </div>

            {/* Thumbnails list */}
            {p.images && p.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                {p.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer ${
                      (activeImage || p.image) === img
                        ? 'border-[#8b7355] shadow-sm scale-105 bg-white'
                        : 'border-[#8b7355]/10 hover:border-[#8b7355]/40 bg-white'
                    }`}
                  >
                    <img src={img} alt={`${p.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Order Configuration */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="text-xs font-extrabold uppercase tracking-[3px] text-[#8b7355] block mb-2 select-none">
                {p.category}
              </span>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-tight mb-4">
                {p.name}
              </h1>

              {/* Stars summary */}
              <div className="flex items-center gap-2 mb-6 select-none w-fit bg-white border border-[#8b7355]/10 px-3 py-1.5 rounded-full shadow-sm">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-[11px] font-extrabold text-[#4e3a24]">
                  {p.rating} Stars ({p.reviewsCount} Customer Reviews)
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">In Stock</span>
              </div>

              {/* Pricing Display */}
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-4 mb-6">
                <span className="text-[#8b7355] font-serif font-bold text-3xl">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
                <span className="text-neutral-400 text-sm line-through tracking-wider">
                  ₹{p.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#8b7355] font-extrabold uppercase tracking-wider bg-[#8b7355]/10 px-2.5 py-1 rounded">
                  Save ₹{(p.originalPrice - p.price).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Brief Description */}
              <p className="text-xs font-sans tracking-wide text-neutral-600 leading-relaxed mb-8">
                {getBriefDescription(p.description)}
              </p>

              {/* Quantity Selector & Size Selector */}
              <div className="flex flex-wrap gap-6 mb-8 items-end">
                {/* Sizing matrix if Ring */}
                {p.category === 'Rings' && (
                  <div className="flex-grow min-w-[150px] select-none">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24] block mb-3">
                      Select Ring Size
                    </span>
                    <div className="flex gap-2">
                      {['Size 10', 'Size 12', 'Size 14', 'Size 16'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-2 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-[#8b7355] text-white border-[#8b7355] shadow-sm'
                              : 'bg-white text-neutral-600 border-[#8b7355]/20 hover:border-[#8b7355]/50'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="select-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24] block mb-3">
                    Quantity
                  </span>
                  <div className="flex items-center border border-[#8b7355]/20 bg-white rounded-xl h-10 px-2 gap-3 w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-[#8b7355] hover:bg-[#8b7355]/10 rounded-lg font-bold cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-neutral-800 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#8b7355] hover:bg-[#8b7355]/10 rounded-lg font-bold cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy triggers & Trust Badges */}
            <div>
              <div className="flex gap-4 select-none">
                <button
                  onClick={handleAddToBag}
                  className="flex-grow h-12 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    wishlisted
                      ? 'border-red-500 bg-red-50 text-red-500 shadow-sm'
                      : 'border-[#8b7355]/20 bg-white text-neutral-400 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#8b7355]/15 select-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24]">BIS 916 Gold</span>
                    <span className="text-[9px] text-neutral-400">100% Pure Assured Gold</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24]">GIA Certified</span>
                    <span className="text-[9px] text-neutral-400">Conflict-Free Diamonds</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24]">Insured Shipping</span>
                    <span className="text-[9px] text-neutral-400">Free Home Delivery</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24]">Lifetime Exchange</span>
                    <span className="text-[9px] text-neutral-400">Hassle-Free Buyback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details, Specifications & Care (3-Column Grid) */}
        <section className="mt-12 sm:mt-16 select-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Column 1: Product Details */}
            <div className="bg-gradient-to-br from-white to-[#faf9f6]/30 border border-[#8b7355]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#8b7355]/10 rounded-xl text-[#8b7355]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4e3a24] font-extrabold italic">
                    Product Details
                  </h3>
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">
                    Design & Styling
                  </p>
                </div>
              </div>
              <div className="w-12 h-[1px] bg-[#8b7355]/30 mt-2 mb-6" />
              <div className="prose-jewelry flex-grow">
                {detailsHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: detailsHtml }} />
                ) : (
                  <div className="text-xs text-neutral-600 leading-relaxed font-sans">
                    <p className="mb-4">
                      This fine jewelry creation represents decades of master craftsmanship. Designed for special moments and everyday luxury alike, it blends timeless visual structures with comfortable modern bands.
                    </p>
                    <p>
                      Each piece is securely packed in an elegant velvet-lined Zari & Co. storage vault box, accompanied by lifetime exchange guarantees, Bis Hallmarked certs, and detailed polish guidelines.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Specifications */}
            <div className="bg-gradient-to-br from-white to-[#faf9f6]/30 border border-[#8b7355]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#8b7355]/10 rounded-xl text-[#8b7355]">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4e3a24] font-extrabold italic">
                    Specifications
                  </h3>
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">
                    Material & Metrology
                  </p>
                </div>
              </div>
              <div className="w-12 h-[1px] bg-[#8b7355]/30 mt-2 mb-6" />
              <div className="prose-jewelry flex-grow overflow-x-auto">
                {specsHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: specsHtml }} />
                ) : (
                  <table className="w-full text-left border-collapse my-4 text-xs border border-[#8b7355]/20 rounded-xl overflow-hidden shadow-sm">
                    <tbody>
                      <tr>
                        <td className="font-extrabold uppercase tracking-wider text-[9px] bg-[#faf9f6] text-[#8b7355] px-4 py-3 border-b border-[#8b7355]/20 w-1/3">SKU</td>
                        <td className="px-4 py-3 border-b border-neutral-100 text-[#4e3a24]/80">{p.sku}</td>
                      </tr>
                      <tr>
                        <td className="font-extrabold uppercase tracking-wider text-[9px] bg-[#faf9f6] text-[#8b7355] px-4 py-3 border-b border-[#8b7355]/20">Metal</td>
                        <td className="px-4 py-3 border-b border-neutral-100 text-[#4e3a24]/80">{p.metalType}</td>
                      </tr>
                      <tr>
                        <td className="font-extrabold uppercase tracking-wider text-[9px] bg-[#faf9f6] text-[#8b7355] px-4 py-3 border-b border-[#8b7355]/20">Diamonds</td>
                        <td className="px-4 py-3 border-b border-neutral-100 text-[#4e3a24]/80">{p.diamondWeight}</td>
                      </tr>
                      <tr>
                        <td className="font-extrabold uppercase tracking-wider text-[9px] bg-[#faf9f6] text-[#8b7355] px-4 py-3 border-b border-neutral-100">Certification</td>
                        <td className="px-4 py-3 border-b border-neutral-100 text-[#4e3a24]/80">{p.certification}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Column 3: Care & Preservation */}
            <div className="bg-gradient-to-br from-white to-[#faf9f6]/30 border border-[#8b7355]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#8b7355]/10 rounded-xl text-[#8b7355]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4e3a24] font-extrabold italic">
                    Care & Preservation
                  </h3>
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">
                    Maintenance & Longevity
                  </p>
                </div>
              </div>
              <div className="w-12 h-[1px] bg-[#8b7355]/30 mt-2 mb-6" />
              <div className="prose-jewelry flex-grow">
                {careHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: careHtml }} />
                ) : (
                  <div className="text-xs text-neutral-600 leading-relaxed font-sans">
                    <p className="mb-3 font-semibold text-[#4e3a24]">Preserve the brilliance of your jewelry with proper care:</p>
                    <ul className="list-none pl-0 space-y-2.5">
                      <li className="relative pl-5 text-[#4e3a24]/80">
                        <span className="absolute left-0 top-[1px] text-[#8b7355] text-[9px]">✦</span>
                        Store in a dry, soft-lined jewelry box or pouch.
                      </li>
                      <li className="relative pl-5 text-[#4e3a24]/80">
                        <span className="absolute left-0 top-[1px] text-[#8b7355] text-[9px]">✦</span>
                        Avoid direct contact with perfumes, hairsprays, and lotions.
                      </li>
                      <li className="relative pl-5 text-[#4e3a24]/80">
                        <span className="absolute left-0 top-[1px] text-[#8b7355] text-[9px]">✦</span>
                        Clean gently with a soft microfiber jewelry polishing cloth.
                      </li>
                      <li className="relative pl-5 text-[#4e3a24]/80">
                        <span className="absolute left-0 top-[1px] text-[#8b7355] text-[9px]">✦</span>
                        Remove your jewelry before swimming, bathing, or doing strenuous activities.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Customer Review Section */}
        <section className="mt-10 sm:mt-12 bg-white border border-[#8b7355]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <h3 className="text-lg font-serif text-[#4e3a24] font-extrabold italic mb-6">
            Customer Reviews ({p.reviewsCount})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews list column */}
            <div className="lg:col-span-2 flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin">
              {p.reviews.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-400 italic">
                  Be the first to review this stunning masterpiece!
                </div>
              ) : (
                p.reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-neutral-100 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-800">{rev.userName}</span>
                      <span className="text-[10px] text-neutral-400">{rev.createdAt}</span>
                    </div>
                    <div className="flex text-amber-500 mb-2">
                      {Array.from({ length: rev.rating }).map((_, rIdx) => (
                        <Star key={rIdx} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 font-sans tracking-wide leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form column */}
            <div className="bg-[#faf9f6] border border-[#8b7355]/10 rounded-2xl p-6 h-fit">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] mb-4">
                Write A Review
              </h4>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355]/25"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">
                    Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                  >
                    <option value={5}>5 Stars - Perfect</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 block mb-1.5">
                    Review Comment
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe your review details..."
                    className="w-full bg-white border border-[#8b7355]/20 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355]/25 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-10 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetailPage;
