import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Star, ShieldCheck, ShoppingBag, Heart, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { getProductBySlug, selectedProduct, addReview, products, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<string>('Size 12');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'purity'>('details');

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

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8b7355] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const p = selectedProduct;
  const wishlisted = isInWishlist(p.id);

  // Split description if it contains HTML comments from rich text editor
  const desc = p.description || '';
  const hasGiaSpecs = desc.includes('<!--GIA-SPECS-->');
  const hasCareGuides = desc.includes('<!--CARE-GUIDES-->');

  let storyHtml = desc;
  let specsHtml = '';
  let careHtml = '';

  if (hasGiaSpecs && hasCareGuides) {
    const parts = desc.split('<!--GIA-SPECS-->');
    storyHtml = parts[0];
    const rest = parts[1].split('<!--CARE-GUIDES-->');
    specsHtml = rest[0];
    careHtml = rest[1];
  } else if (hasGiaSpecs) {
    const parts = desc.split('<!--GIA-SPECS-->');
    storyHtml = parts[0];
    specsHtml = parts[1];
  } else if (hasCareGuides) {
    const parts = desc.split('<!--CARE-GUIDES-->');
    storyHtml = parts[0];
    careHtml = parts[1];
  }

  // Helper to extract clean text from rich HTML
  const getCleanPreview = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      let text = doc.body.textContent || "";
      const titleLower = p.name.toLowerCase();
      const textLower = text.toLowerCase();
      if (textLower.startsWith(titleLower)) {
        text = text.substring(p.name.length).trim();
      }
      if (text.toLowerCase().startsWith("product story")) {
        text = text.substring("product story".length).trim();
      }
      return text;
    } catch (e) {
      return html.replace(/<[^>]*>/g, ""); // simple fallback
    }
  };

  const storyPreview = getCleanPreview(storyHtml);
  const shortDescription = storyPreview.length > 200 ? storyPreview.slice(0, 197) + '...' : storyPreview;

  const handleAddToBag = () => {
    addItem(p, 1, selectedSize);
    toast.success(`${p.name} added to your bag! ✨`, {
      description: `Size: ${selectedSize} | Free Insured Shipping.`,
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

      <main className="container mx-auto px-6 py-10">
        {/* Back Link */}
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b7355] hover:text-[#6e583e] mb-8 select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Collection
        </Link>

        {/* Core Product Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Image Showcase */}
          <div className="relative select-none">
            {/* Visual Frame */}
            <div className="aspect-square bg-white border border-[#8b7355]/15 rounded-3xl p-6 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/*BIS Hallmark Floating Tag */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-500/20 shadow-md text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
              <div>
                <span className="block text-[7px] text-neutral-400 font-bold tracking-normal uppercase leading-none mb-0.5">Assured Authenticity</span>
                <span>BIS 916 Hallmarked</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Configuration */}
          <div className="flex flex-col justify-start gap-y-6">
            <div>
              {/* Category */}
              <span className="text-xs font-extrabold uppercase tracking-[3px] text-[#8b7355] block mb-2 select-none">
                {p.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-tight mb-4">
                {p.name}
              </h1>

              {/* Stars summary */}
              <div className="flex items-center gap-2 mb-6 select-none">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-[11px] font-extrabold text-neutral-500">
                  {p.rating} Stars ({p.reviewsCount} Customer Reviews)
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">In Stock</span>
              </div>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-4 mb-6">
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
              <p className="text-xs font-sans tracking-wide text-neutral-600 leading-relaxed mb-6">
                {shortDescription}
              </p>

              {/* Sizing matrix if Ring */}
              {(p.category?.toLowerCase() === 'rings' || p.category?.toLowerCase() === 'ring') && (
                <div className="mb-8 select-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24] block mb-3">
                    Select Ring Size
                  </span>
                  <div className="flex gap-2.5">
                    {['Size 10', 'Size 12', 'Size 14', 'Size 16'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
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
            </div>

            {/* Large Buy triggers */}
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
          </div>
        </div>

        {/* Specifications Tab Drawers */}
        <section className="mt-16 bg-white border border-[#8b7355]/10 rounded-3xl p-8 shadow-sm select-none">
          <div className="flex border-b border-neutral-100 gap-8 mb-6 text-xs font-extrabold uppercase tracking-widest">
            {[
              { id: 'details', label: 'Product Details' },
              { id: 'specs', label: 'Specifications' },
              { id: 'purity', label: 'Purity & Certifications' },
            ].map((tb) => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`pb-3 relative cursor-pointer ${
                  activeTab === tb.id ? 'text-[#8b7355]' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {tb.label}
                {activeTab === tb.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8b7355]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content renders */}
          {activeTab === 'details' && (
            <div 
              className="text-xs text-neutral-600 leading-relaxed font-sans max-w-2xl"
              dangerouslySetInnerHTML={{ __html: storyHtml }}
            />
          )}

          {activeTab === 'specs' && (
            specsHtml ? (
              <div 
                className="prose prose-sm max-w-none text-xs font-sans text-neutral-600"
                dangerouslySetInnerHTML={{ __html: specsHtml }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-y-4 max-w-xl text-xs font-sans">
                <div className="text-neutral-400">Unique Sku Code</div>
                <div className="font-semibold text-neutral-800">{p.sku}</div>
                
                <div className="text-neutral-400">Metal Composition</div>
                <div className="font-semibold text-neutral-800">{p.metalType}</div>

                <div className="text-neutral-400">Diamond Carat Weight</div>
                <div className="font-semibold text-neutral-800">{p.diamondWeight}</div>

                <div className="text-neutral-400">Assurance Certificate</div>
                <div className="font-semibold text-neutral-800">{p.certification}</div>
              </div>
            )
          )}

          {activeTab === 'purity' && (
            <div className="text-xs text-neutral-600 leading-relaxed font-sans max-w-2xl">
              {careHtml ? (
                <div 
                  className="prose prose-sm max-w-none text-xs font-sans text-neutral-600"
                  dangerouslySetInnerHTML={{ __html: careHtml }}
                />
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold uppercase tracking-wider text-[#4e3a24] mb-1">
                        BIS 916 Gold Certified
                      </h4>
                      <p>
                        Every gold item is certified and hallmarked by the Bureau of Indian Standards (BIS), assuring 22 Karat or 18 Karat gold purity values.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold uppercase tracking-wider text-[#4e3a24] mb-1">
                        Conflict-Free Natural Diamonds
                      </h4>
                      <p>
                        All diamonds set in Zari & Co creations are strictly conflict-free and natural stones certified by international diamond grading agencies (GIA & SGL).
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Customer Review Section */}
        <section className="mt-12 bg-white border border-[#8b7355]/10 rounded-3xl p-8 shadow-sm">
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
