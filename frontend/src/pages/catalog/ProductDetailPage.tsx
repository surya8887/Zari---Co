import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Star, ShieldCheck, ShoppingBag, Heart, Send, Video, MapPin, Truck, ChevronDown, ChevronUp, RotateCcw, Check, PhoneCall, Award } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { getProductBySlug, selectedProduct, addReview, products, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<string>('Size 12');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'purity'>('details');

  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [metalColor, setMetalColor] = useState('18K Yellow Gold');
  const [diamondPurity, setDiamondPurity] = useState('VVS1 (E-F Color)');
  const [bookingName, setBookingName] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6 || !/^\d+$/.test(pincode)) {
      toast.warning("Please enter a valid 6-digit Pincode.");
      return;
    }
    setIsCheckingPincode(true);
    setDeliveryMessage('');
    setTimeout(() => {
      setIsCheckingPincode(false);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', dateOptions);
      setDeliveryMessage(`✦ Estimated Delivery by ${formattedDate} | Free Insured Shipping`);
      toast.success("Pincode verified! Delivery date estimated. 🚚");
    }, 800);
  };

  const handleBookVideoCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingTime) {
      toast.warning("Please specify both name and slot preference.");
      return;
    }
    setIsBooked(true);
    toast.success("Video Call Scheduled! We will contact you soon. ✦");
  };

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

  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (p) {
      setActiveImage(p.image);
    }
  }, [p]);

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
        {/* Breadcrumbs Trail */}
        <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#8b7355]/60 mb-6 select-none">
          <Link to="/" className="hover:text-[#8b7355]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#8b7355]">Jewellery</Link>
          <span>/</span>
          <Link to={`/products`} className="hover:text-[#8b7355]">{p.category}</Link>
          <span>/</span>
          <span className="text-[#8b7355] truncate max-w-[150px]">{p.name}</span>
        </div>

        {/* Core Product Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Image Showcase & Trust Marks */}
          <div className="relative select-none">
            {/* Visual Frame */}
            <div className="relative aspect-square bg-white border border-[#8b7355]/15 rounded-3xl p-6 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={activeImage || p.image}
                alt={p.name}
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              />

              {/* BIS Hallmark Floating Tag inside image frame */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-500/20 shadow-md text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                <div>
                  <span className="block text-[7px] text-neutral-400 font-bold tracking-normal uppercase leading-none mb-0.5">Assured Authenticity</span>
                  <span>BIS 916 Hallmarked</span>
                </div>
              </div>
            </div>

            {/* Alternative Product Photos Gallery */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1 select-none">
              {p.images && p.images.map((imgUrl, idx) => {
                const isSelected = activeImage === imgUrl;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border bg-white cursor-pointer transition-all duration-200 flex-shrink-0 p-1 ${
                      isSelected
                        ? 'border-[#8b7355] shadow-[0_0_8px_rgba(139,115,85,0.25)] scale-[1.03]'
                        : 'border-[#8b7355]/15 hover:border-[#8b7355]/50'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Alternative photo ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </button>
                );
              })}

              {/* BlueStone-Style Mock VIDEO Play Card */}
              <button
                onClick={() => setIsVideoOpen(true)}
                className="w-16 h-16 rounded-2xl border border-[#8b7355]/15 bg-neutral-50 hover:bg-[#8b7355]/5 cursor-pointer transition-all duration-200 flex-shrink-0 flex flex-col items-center justify-center gap-1 p-1 text-[#8b7355]"
              >
                <Video className="w-5 h-5 animate-pulse" />
                <span className="text-[8px] font-extrabold uppercase tracking-widest">VIDEO</span>
              </button>
            </div>

            {/* BlueStone-Style Certified Trust Logos */}
            <div className="mt-6 pt-4 border-t border-[#8b7355]/10 flex items-center justify-between select-none">
              <span className="text-[8px] font-extrabold tracking-widest uppercase text-neutral-400">Certified By:</span>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-extrabold text-[#4e3a24] tracking-tighter leading-none">BIS</span>
                  <span className="text-[6px] uppercase tracking-widest text-[#8b7355] font-bold">Hallmark</span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-extrabold text-[#4e3a24] tracking-tighter leading-none">SGL</span>
                  <span className="text-[6px] uppercase tracking-widest text-[#8b7355] font-bold">Labs</span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-extrabold text-[#4e3a24] tracking-tighter leading-none">GSI</span>
                  <span className="text-[6px] uppercase tracking-widest text-[#8b7355] font-bold">Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Configuration */}
          <div className="flex flex-col justify-start gap-y-6">
            <div>
              {/* Category / Collection */}
              <span className="text-xs font-extrabold uppercase tracking-[3px] text-[#8b7355] block mb-2 select-none">
                From {p.category} Collection
              </span>

              {/* Title */}
              <h1 className="text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-tight mb-2">
                {p.name}
              </h1>

              {/* Stars summary */}
              <div className="flex items-center gap-2 mb-4 select-none">
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
              <div className="mb-4">
                <div className="flex items-baseline gap-4 mb-0.5">
                  <span className="text-[#8b7355] font-serif font-bold text-3xl">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-neutral-400 text-sm line-through tracking-wider">
                    ₹{p.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#8b7355] font-extrabold uppercase tracking-wider bg-[#8b7355]/10 px-2.5 py-1 rounded">
                    Save ₹{(p.originalPrice - p.price).toLocaleString('en-IN')} (20% OFF)
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 block select-none">MRP incl. of all taxes</span>
              </div>

              {/* Promo Offer Banner */}
              <div className="flex items-center gap-2 bg-[#8b7355]/5 border border-[#8b7355]/15 p-3 rounded-xl mb-4 select-none animate-pulse">
                <Award className="w-4 h-4 text-[#8b7355] flex-shrink-0" />
                <span className="text-[9px] text-[#4e3a24] font-extrabold uppercase tracking-wide">
                  10% OFF on Making Charges: Use code <strong className="text-[#8b7355]">SUMMER10</strong> | Free Insured Shipping
                </span>
              </div>

              {/* Video Call Scheduler Trigger */}
              <div className="flex items-center gap-2 text-xs mb-4 select-none">
                <Video className="w-4 h-4 text-[#8b7355]" />
                <span className="text-neutral-600 font-sans">Want to view live on call?</span>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="font-extrabold text-[#8b7355] hover:text-[#6e583e] uppercase tracking-wider underline cursor-pointer"
                >
                  Book Free Session Now
                </button>
              </div>

              {/* Brief Description */}
              <p className="text-xs font-sans tracking-wide text-neutral-500 leading-relaxed mb-6 border-b border-neutral-100 pb-4">
                Diamond and gold {p.category.toLowerCase()} design in {p.metalType} featuring {p.diamondWeight} diamonds.
              </p>

              {/* Interactive Pincode Delivery Check */}
              <div className="mb-6 select-none bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#4e3a24] block mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8b7355]" />
                  Delivery & Store Availability
                </label>
                <form onSubmit={handleCheckPincode} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-grow bg-white border border-[#8b7355]/20 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                  />
                  <button
                    type="submit"
                    disabled={isCheckingPincode}
                    className="px-4 bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingPincode ? 'Checking...' : 'Verify'}
                  </button>
                </form>
                {deliveryMessage ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold mt-1.5 bg-emerald-50 p-2 rounded-lg border border-emerald-500/10">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                    <span>{deliveryMessage}</span>
                  </div>
                ) : (
                  <span className="text-[9px] text-neutral-400">Provide pincode for insured delivery dates & store trails!</span>
                )}
              </div>

              {/* Customize Accordion Section */}
              <div className="mb-6 border border-[#8b7355]/15 rounded-2xl overflow-hidden select-none bg-white">
                <button
                  onClick={() => setIsCustomOpen(!isCustomOpen)}
                  className="w-full flex items-center justify-between p-4 font-bold text-xs uppercase tracking-wider text-[#4e3a24] hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#8b7355]" />
                    Customize This Design
                  </span>
                  {isCustomOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {isCustomOpen && (
                  <div className="p-4 border-t border-neutral-100 bg-[#faf9f6] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">Gold Purity & Color</span>
                      <div className="flex gap-1.5">
                        {['18K Yellow Gold', '18K Rose Gold', '18K White Gold'].map((clr) => (
                          <button
                            key={clr}
                            type="button"
                            onClick={() => setMetalColor(clr)}
                            className={`flex-grow py-2 text-[9px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                              metalColor === clr
                                ? 'bg-[#8b7355] text-white border-[#8b7355] shadow-sm'
                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            {clr.replace("18K ", "")}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">Diamond Grade & Purity</span>
                      <div className="flex gap-1.5">
                        {['VVS1 (E-F Color)', 'VS1 (G-H Color)'].map((prt) => (
                          <button
                            key={prt}
                            type="button"
                            onClick={() => setDiamondPurity(prt)}
                            className={`flex-grow py-2 text-[9px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                              diamondPurity === prt
                                ? 'bg-[#8b7355] text-white border-[#8b7355] shadow-sm'
                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            {prt.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sizing dropdown select */}
              {(p.category?.toLowerCase() === 'rings' || p.category?.toLowerCase() === 'ring') && (
                <div className="mb-6 select-none">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4e3a24]">
                      Select Ring Size
                    </span>
                    <a href="#size-chart" className="text-[8px] uppercase tracking-wider text-[#8b7355] underline font-bold">Size Guide</a>
                  </div>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white border border-[#8b7355]/20 rounded-xl p-3 text-xs font-bold text-neutral-700 focus:outline-none focus:border-[#8b7355]"
                  >
                    {['Size 10', 'Size 12', 'Size 14', 'Size 16'].map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* BlueStone-Style Action Buttons Buy triggers */}
            <div className="flex flex-col md:flex-row gap-4 select-none">
              <button
                onClick={handleAddToBag}
                className="flex-grow h-12 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>BUY NOW</span>
              </button>

              <button
                onClick={() => toast.info("Launching the 10+1 Golden Monthly Plan! Pay monthly and receive a free golden installment. ✦")}
                className="flex-grow h-12 bg-white border border-[#8b7355] hover:bg-[#8b7355]/5 text-[#8b7355] rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <Award className="w-4 h-4 text-[#8b7355]" />
                <span>10+1 MONTHLY PLAN</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                  wishlisted
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-sm'
                    : 'border-[#8b7355]/20 bg-white text-neutral-400 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* BlueStone-Style Three Luxury Brand Promises */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#8b7355]/10 select-none">
              <div className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <RotateCcw className="w-4 h-4 text-[#8b7355] mb-1.5" />
                <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-[#4e3a24] leading-tight">30 Day Returnable</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <RotateCcw className="w-4 h-4 text-[#8b7355] mb-1.5" />
                <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-[#4e3a24] leading-tight">Lifetime Exchange</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <Award className="w-4 h-4 text-[#8b7355] mb-1.5" />
                <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-[#4e3a24] leading-tight">Certified Jewellery</span>
              </div>
            </div>

            {/* Helpline / Question note */}
            <span className="text-[8.5px] font-bold text-neutral-400 text-center select-none block mt-2">
              Any Questions? Please feel free to reach our luxury advisors at: <strong className="text-[#8b7355]">1800 419 0066</strong>
            </span>
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
              className="prose prose-sm max-w-none text-xs font-sans text-neutral-600 leading-relaxed max-w-2xl"
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

      {/* BlueStone-Style Video Showcase & Live Advisor Booking Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full border border-[#8b7355]/20 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setIsVideoOpen(false); setIsBooked(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#8b7355]/15 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-all cursor-pointer font-bold text-sm"
            >
              ✕
            </button>
            
            <h3 className="text-lg font-serif text-[#4e3a24] font-extrabold italic mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#8b7355]" />
              Experience Zari & Co Masterpieces
            </h3>

            {/* Simulated Live Video Player */}
            <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="z-20 text-center text-white px-6">
                <PhoneCall className="w-10 h-10 text-[#8b7355] mx-auto mb-2 animate-bounce" />
                <span className="text-[10px] font-extrabold tracking-widest uppercase block mb-1">Live Advisor Showcase</span>
                <p className="text-[10.5px] text-neutral-300 max-w-xs mx-auto">
                  Our diamond advisors will showcase {p.name} live in pristine showroom light to examine clarity and cut.
                </p>
              </div>
              <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[7px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 animate-pulse">
                <span className="w-1 h-1 bg-white rounded-full" />
                LIVE SHOWROOM
              </div>
            </div>

            {/* Video Call Booking Form */}
            {!isBooked ? (
              <form onSubmit={handleBookVideoCall} className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4e3a24] block">Schedule A Free Live Video Call</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[7px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Enter name" 
                      className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-xl p-3 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[7px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">Preferred Slot</label>
                    <select 
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-[#faf9f6] border border-[#8b7355]/20 rounded-xl p-3 text-xs text-neutral-800 focus:outline-none focus:border-[#8b7355]"
                    >
                      <option value="">Select a time</option>
                      <option value="slot-1">Today: 4:30 PM - 5:30 PM</option>
                      <option value="slot-2">Tomorrow: 11:30 AM - 12:30 PM</option>
                      <option value="slot-3">Tomorrow: 3:30 PM - 4:30 PM</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full h-11 bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Confirm Live Appointment
                </button>
              </form>
            ) : (
              <div className="text-center py-6 animate-in fade-in duration-200">
                <Check className="w-12 h-12 text-emerald-600 mx-auto mb-2 bg-emerald-50 rounded-full p-2 border border-emerald-500/25" />
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 mb-1">Call Scheduled Successfully!</h4>
                <p className="text-[10px] text-neutral-500 max-w-sm mx-auto mb-4">
                  Thank you, {bookingName}. A luxury diamond advisor has reserved your slot and will connect with you via WhatsApp/Zoom at the specified time!
                </p>
                <button 
                  onClick={() => { setIsVideoOpen(false); setIsBooked(false); }}
                  className="px-6 py-2 border border-[#8b7355]/20 text-[#8b7355] hover:bg-[#faf9f6] text-[9px] font-extrabold uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
