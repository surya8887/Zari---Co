import Header from '@/components/layout/Header';
import Hero from '@/features/catalog/components/Hero';
import JustIn from '@/features/catalog/components/JustIn';
import FloatingActions from '@/components/common/FloatingActions';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Navigation */}
      <Header />

      <main>
        {/* Main Hero Section */}
        <Hero />

        {/* 'Just In' Collection Section */}
        <JustIn />

        {/* Additional content could go here (e.g. Collections, Instagram feed) */}
        <section className="py-20 bg-[#f9f7f4]">
            <div className="container mx-auto px-4 text-center">
                <p className="text-[#b09d81] uppercase tracking-[0.3em] text-xs font-bold mb-4">Discover More</p>
                <h3 className="text-3xl font-serif text-[#6d5b43] italic mb-10">Handcrafted with Love</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer (Can be expanded into a full component later) */}
      <footer className="bg-[#6d5b43] text-white py-12">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif italic mb-6">Zari & Co</h2>
            <p className="text-xs opacity-60 tracking-widest uppercase">© 2026 Zari & Co. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <FloatingActions />
    </div>
  );
};

export default Home;
