
const Hero = () => {
  return (
    <section className="relative w-full h-[550px] overflow-hidden">
      {/* Background with Teal/Cyan Gradient to mimic the image */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#004e5d] via-[#005a6b] to-[#004e5d]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}>
        </div>
      </div>

      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10 text-white">
        {/* Logo Text on Side */}
        <div className="absolute top-12 right-12 text-right opacity-80">
          <h2 className="text-6xl font-serif tracking-tighter">ZARI</h2>
          <p className="text-sm tracking-[0.3em] font-sans -mt-2">& CO</p>
        </div>

        {/* Council Badge (as seen in image) */}
        <div className="absolute top-12 left-12">
            <div className="border border-white/30 p-2 text-[8px] uppercase tracking-widest font-light leading-relaxed">
                Only <br /> <span className="text-sm font-serif">NATURAL</span> <br /> DIAMONDS <br /> <span className="opacity-60">Natural Diamond Council</span>
            </div>
        </div>

        {/* Central Content */}
        <div className="text-center">
          <h2 className="text-[100px] font-serif italic leading-none mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Novante
          </h2>
          <p className="text-2xl font-light tracking-wide mb-10 opacity-90 italic">
            Nostalgia in every curve.
          </p>
          <button className="bg-white text-[#004e5d] px-10 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#b09d81] hover:text-white transition-all duration-300 transform hover:scale-105">
            Shop Now
          </button>
        </div>

        {/* Carousel Indicators (as seen in image) */}
        <div className="absolute bottom-8 flex gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-white scale-125' : 'bg-white/30'}`}></div>
            ))}
        </div>
      </div>

      {/* Decorative Jewel Elements (Mocking the necklace/ring in the image) */}
      <div className="absolute left-0 top-0 h-full w-1/3 opacity-40 pointer-events-none">
        <div className="absolute top-[20%] -left-20 w-80 h-80 rounded-full border-[1px] border-white/20 rotate-45"></div>
        <div className="absolute top-[30%] -left-10 w-60 h-60 rounded-full border-[1px] border-white/10 -rotate-12"></div>
      </div>
    </section>
  );
};

export default Hero;
