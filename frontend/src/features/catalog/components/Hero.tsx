import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[640px] lg:h-[680px] overflow-hidden select-none bg-neutral-950 flex items-center">
      {/* Background Image Campaign Banner */}
      <div className="absolute inset-0">
        <img
          src="/images/luxury_jewelry_model.png"
          alt="Znira & Co Luxury Campaign"
          className="w-full h-full object-cover object-top opacity-85 scale-100 hover:scale-[1.03] transition-transform duration-[12000ms] ease-out"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/40 to-transparent md:bg-gradient-to-r md:from-neutral-950/75 md:via-neutral-950/20 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/40" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative z-10 text-white py-12 md:py-0">
        {/* Diamond Council Authenticity Stamp (Top Left) */}
        <div className="absolute top-10 left-6 lg:left-12 hidden sm:block">
          <div className="border border-amber-200/20 hover:border-amber-300/40 p-3 bg-black/40 backdrop-blur-md text-[8px] uppercase tracking-[2px] font-semibold leading-relaxed transition-all duration-300 rounded-2xl shadow-xl">
            <div className="flex items-center gap-1.5 text-amber-200 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="font-serif font-bold text-[10px] tracking-[1.5px]">CERTIFIED NATURAL</span>
            </div>
            <span className="text-white/80 block font-bold">100% BIS 916 HALLMARKED</span>
            <span className="opacity-50 text-[7px] tracking-normal font-sans block mt-0.5">Natural Diamond Council</span>
          </div>
        </div>

        {/* Brand Logo Overlay (Top Right) */}
        <div className="absolute top-10 right-6 lg:right-12 text-right opacity-95 hidden md:block select-none">
          <img src="/logo-white.png" alt="Znira & Co" className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Central Left Content Card (Luxury Glassmorphism with gold border) */}
        <div className="max-w-lg bg-neutral-950/55 backdrop-blur-xl p-8 sm:p-11 border border-amber-300/20 rounded-3xl shadow-2xl shadow-black/60 text-left animate-in fade-in slide-in-from-left-6 duration-1000 mt-10 md:mt-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-200 font-bold uppercase tracking-[3px] text-[9px] mb-4 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Exquisite New Launch</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif italic text-white font-extrabold leading-tight mb-4 tracking-wide">
            Znira <span className="gold-gradient-text not-italic">Signature</span>
          </h2>
          <p className="text-sm font-sans tracking-wide text-neutral-200 mb-3 leading-relaxed">
            Crafted for the modern muse. Introducing hand-carved natural solitaire diamonds set in solid 18k gold.
          </p>
          <p className="text-xs font-serif italic text-amber-200/90 tracking-wider mb-8 block border-l-2 border-amber-400/40 pl-3">
            "Nostalgia and timeless brilliance woven in every single curve."
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 hover:from-amber-200 hover:to-amber-400 text-[#2c1d11] px-9 h-12 rounded-full text-xs font-bold uppercase tracking-[2.5px] transition-all duration-300 transform active:scale-95 shadow-lg shadow-amber-400/15 hover:shadow-amber-400/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Indicators (Tanishq/BlueStone style) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3.5 select-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                i === 1 ? 'bg-amber-300 w-8 shadow-md shadow-amber-300/50' : 'bg-white/30 w-3 hover:bg-white/60'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
