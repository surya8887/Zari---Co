const Hero = () => {
  return (
    <section className="relative w-full h-[620px] overflow-hidden select-none bg-neutral-950">
      {/* Background Image Campaign Banner */}
      <div className="absolute inset-0">
        <img
          src="/images/luxury_jewelry_model.png"
          alt="Zari & Co Luxury Campaign"
          className="w-full h-full object-cover object-top opacity-90 scale-100 hover:scale-[1.02] transition-transform duration-[12000ms] ease-out"
        />
        {/* Soft elegant shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/20 to-transparent md:bg-gradient-to-r md:from-neutral-950/60 md:via-neutral-950/10 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/30" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative z-10 text-white">
        {/* Diamond Council Authenticity Stamp (Top Left) */}
        <div className="absolute top-10 left-6 lg:left-12 hidden sm:block">
          <div className="border border-white/20 hover:border-amber-200/40 p-2.5 bg-black/35 backdrop-blur-sm text-[8px] uppercase tracking-[2px] font-semibold leading-relaxed transition-all duration-300 rounded shadow-md">
            🛡️ Certified <br /> 
            <span className="text-amber-200 font-serif font-bold text-[10px] tracking-[1.5px]">NATURAL</span> <br /> 
            DIAMONDS <br /> 
            <span className="opacity-40 text-[7px] tracking-normal font-sans font-light">Natural Diamond Council</span>
          </div>
        </div>

        {/* Brand Text Overlay (Top Right) */}
        <div className="absolute top-10 right-6 lg:right-12 text-right opacity-80 hidden md:block select-none">
          <h2 className="text-4xl font-serif tracking-[0.2em] text-amber-100 font-extrabold uppercase">ZARI</h2>
          <p className="text-[9px] tracking-[0.4em] text-neutral-300 uppercase -mt-1 font-bold">& CO</p>
        </div>

        {/* Central Left Content Card (Luxury Glassmorphism with gold border) */}
        <div className="max-w-md bg-neutral-950/45 backdrop-blur-md p-8 sm:p-10 border border-[#8b7355]/30 rounded-2xl shadow-2xl shadow-black/40 text-left animate-in fade-in slide-in-from-left-6 duration-1000 mt-12 md:mt-0">
          <p className="text-amber-200 font-bold uppercase tracking-[4px] text-[10px] mb-3">
            ✨ Exquisite Launch
          </p>
          <div className="w-12 h-px bg-[#8b7355]/60 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-serif italic text-white font-extrabold leading-none mb-4">
            Aurelia
          </h2>
          <p className="text-sm font-sans tracking-wider text-neutral-200 mb-2 leading-relaxed">
            Crafted for the modern muse. Introducing hand-crafted diamonds set in 18k solid gold.
          </p>
          <p className="text-xs font-serif italic text-amber-200/80 tracking-wide mb-8">
            "Nostalgia and elegance in every single curve."
          </p>
          <button className="bg-amber-100 hover:bg-[#8b7355] text-[#003844] hover:text-white px-10 h-11 rounded-full text-xs font-bold uppercase tracking-[2.5px] transition-all duration-300 transform active:scale-95 shadow-lg shadow-[#8b7355]/20 hover:shadow-xl cursor-pointer">
            Explore Collection
          </button>
        </div>

        {/* Carousel Indicators (Tanishq/BlueStone style) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`w-2.5 h-1 rounded-full transition-all duration-300 ${
                i === 1 ? 'bg-amber-200 w-6 shadow-md shadow-amber-200/40' : 'bg-white/30 hover:bg-white/60'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
