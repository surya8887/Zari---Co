import Header from '@/components/layout/Header';
import Hero from '@/features/catalog/components/Hero';
import JustIn from '@/features/catalog/components/JustIn';
import FloatingActions from '@/components/common/FloatingActions';
import { ShieldCheck, RefreshCw, Truck, Award, Star } from 'lucide-react';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const XIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c221e]">
      {/* Header with Navigation */}
      <Header />

      <main>
        {/* Main Hero Section */}
        <Hero />

        {/* 1. Shop By Category Circular Section (Tanishq/BlueStone inspired) */}
        <section className="py-16 bg-white select-none">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b7355] font-bold uppercase tracking-[4px] text-[10px] mb-2.5">
                ✨ Curated Designs
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#4e3a24] font-extrabold italic leading-none">
                Shop By Category
              </h3>
              <div className="w-12 h-0.5 bg-[#8b7355]/40 mx-auto mt-3" />
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14">
              {[
                { name: 'Rings', image: '/images/gold_diamond_ring.png' },
                { name: 'Earrings', image: '/images/gold_drop_earrings.png' },
                { name: 'Necklaces', image: '/images/gold_necklace.png' },
                { name: 'Bangles', image: '/images/gold_bangles.png' },
                { name: 'Pendants', image: '/images/gold_necklace.png' },
              ].map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#8b7355]/15 p-1 bg-[#faf9f6] shadow-sm hover:shadow-md hover:border-[#8b7355] transition-all duration-300 transform group-hover:scale-105 overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover rounded-full group-hover:rotate-6 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4e3a24] mt-3 group-hover:text-[#8b7355] transition-colors duration-300">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main 'Just In' Collection Section */}
        <JustIn />

        {/* 2. Brand Heritage Narrative Section */}
        <section className="py-24 bg-gradient-to-b from-[#faf9f6] to-white relative overflow-hidden select-none">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
               style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #8b7355 1px, transparent 0)', backgroundSize: '24px 24px'}}>
          </div>
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <div className="flex justify-center mb-6 text-amber-500/80">
              <Star className="w-4 h-4 fill-current mx-1" />
              <Star className="w-5 h-5 fill-current mx-1 scale-110 -translate-y-0.5 text-amber-500" />
              <Star className="w-4 h-4 fill-current mx-1" />
            </div>
            <p className="text-[#8b7355] font-extrabold uppercase tracking-[5px] text-[10px] mb-3">
              Established 1996
            </p>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#4e3a24] font-extrabold italic mb-6">
              Our Legacy, Your Story
            </h3>
            <div className="w-16 h-px bg-[#8b7355]/50 mx-auto mb-8" />
            <p className="text-sm font-sans tracking-wide text-neutral-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              For over three decades, Znira & Co has stood as a beacon of artisanal excellence and purity. 
              Each creation in our collection is hand-carved by master craftsmen who have kept the age-old heritage 
              of Indian gold smithery alive. 
            </p>
            <p className="text-xs font-serif italic text-[#8b7355] tracking-wider mb-10 block">
              "We do not merely forge gold; we weave memories that remain timeless."
            </p>
            <button className="h-10 border border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white px-8 rounded-full text-[10px] font-bold uppercase tracking-[2.5px] transition-all duration-300 cursor-pointer shadow-sm active:scale-98">
              Discover Our Craft
            </button>
          </div>
        </section>

        {/* 3. The Znira Promise (Trust credentials grid) */}
        <section className="py-16 bg-[#faf9f6] border-t border-b border-[#8b7355]/10 select-none">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-8 h-8 text-[#8b7355]" />,
                  title: '100% Certified Purity',
                  desc: 'Every piece is BIS Hallmarked and backed by international certifications.'
                },
                {
                  icon: <RefreshCw className="w-8 h-8 text-[#8b7355]" />,
                  title: 'Lifetime Buyback',
                  desc: 'Enjoy transparency with our guaranteed buyback values and exchange policies.'
                },
                {
                  icon: <Truck className="w-8 h-8 text-[#8b7355]" />,
                  title: 'Free Insured Delivery',
                  desc: 'Your masterpieces are securely packed, fully insured, and shipped for free.'
                },
                {
                  icon: <Award className="w-8 h-8 text-[#8b7355]" />,
                  title: 'Bespoke Customization',
                  desc: 'Collaborate with our designers to handcraft custom jewelry of your dreams.'
                }
              ].map((p, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#8b7355]/5 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="mb-4 p-3 bg-[#faf9f6] rounded-full border border-[#8b7355]/10">
                    {p.icon}
                  </div>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#4e3a24] mb-2">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 tracking-wide max-w-[200px]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Luxurious, detailed layout) */}
      <footer className="bg-[#1a1210] text-[#faf9f6] border-t border-[#8b7355]/20 pt-16 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 mb-12 items-start">
            {/* Column 1: Brand Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img src="/logo-white.png" alt="Znira & Co" className="h-10 w-auto object-contain" />
              </div>
              <div className="w-10 h-0.5 bg-[#8b7355]/60 my-1" />
              <p className="text-[11px] text-neutral-400 tracking-wider leading-relaxed">
                Creators of fine, hand-crafted artisan jewelry. We deliver brilliance and purity across the globe.
              </p>
              <div className="text-[10px] text-neutral-400 tracking-wide font-sans mt-1 flex flex-col gap-1.5">
                <span>🇮🇳 Proudly Crafted in India</span>
                <span>📞 Helpline: <a href="tel:+918178028397" className="text-amber-200 hover:underline font-bold">+91 8178028397</a></span>
              </div>
            </div>

            {/* Column 2: Collections links */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-amber-100 mb-5">
                Our Collections
              </h4>
              <ul className="flex flex-col gap-3 text-[11px] text-[#e0deda] font-medium tracking-wider">
                <li><a href="#" className="hover:text-amber-200 transition-colors">Znira Gold Collection</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Marquise Solitaires</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Heritage Drop Earrings</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Festive Stacked Bangles</a></li>
              </ul>
            </div>

            {/* Column 3: Trust & Policies */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-amber-100 mb-5">
                Customer Services
              </h4>
              <ul className="flex flex-col gap-3 text-[11px] text-[#e0deda] font-medium tracking-wider">
                <li><a href="#" className="hover:text-amber-200 transition-colors">Lifetime Exchange & Buyback</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Safe & Insured Shipping</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Gold Rate Calculator</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Virtual Consultations</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Social Channels */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[2.5px] text-amber-100 mb-5">
                The Inner Circle
              </h4>
              <p className="text-[11px] text-neutral-400 tracking-wider mb-4 leading-relaxed">
                Subscribe for exclusive launches, collection sneak peeks, and gold rate updates.
              </p>
              <div className="flex h-9 rounded-lg overflow-hidden border border-[#8b7355]/30 mb-5 focus-within:border-amber-300/60 transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#261d1a] border-none text-xs px-3.5 text-white placeholder-neutral-500 focus:outline-none w-full"
                />
                <button className="bg-[#8b7355] hover:bg-[#6e583e] text-white text-[10px] font-extrabold uppercase tracking-widest px-4 transition-colors duration-300 cursor-pointer shrink-0">
                  Join
                </button>
              </div>

              {/* Social Icons Row */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://x.com/znira4o" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700 text-white hover:bg-neutral-700 hover:text-white flex items-center justify-center transition-all duration-300"
                  title="Follow on X"
                >
                  <XIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.youtube.com/@znira001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-300"
                  title="Subscribe on YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.facebook.com/share/18ZHtiKtag/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300"
                  title="Follow on Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.instagram.com/znira.co?igsh=MTBwMGQzdWZ6bzFzYg==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/10 to-rose-500/10 border border-rose-500/30 text-[#e1306c] hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 hover:text-white flex items-center justify-center transition-all duration-300"
                  title="Follow on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#8b7355]/20 mb-8" />

          {/* Sub-Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            <p className="text-[10px] text-neutral-500 tracking-[2px] uppercase">
              © 2026 Znira & Co. Fine Jewelry. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-[10px] text-neutral-400 uppercase tracking-widest">
              <a href="#" className="hover:text-amber-200 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-amber-200 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <FloatingActions />
    </div>
  );
};

export default Home;
