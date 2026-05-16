const JustIn = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-[#6d5b43] italic">
          Just In: The Latest from Zari & Co
        </h2>
        <div className="w-24 h-[1px] bg-[#b09d81] mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="group cursor-pointer">
            <div className="relative aspect-square bg-[#f9f7f4] mb-4 overflow-hidden rounded-lg">
              {/* Placeholder for Jewelry Item */}
              <div className="absolute inset-0 flex items-center justify-center text-[#b09d81] opacity-20">
                <span className="text-xs uppercase tracking-widest font-bold">Jewelry Item</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider group-hover:text-[#b09d81] transition-colors">
                Diamond Pendant {item}
              </h3>
              <p className="text-[#b09d81] font-serif mt-1">₹ 45,000</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JustIn;
