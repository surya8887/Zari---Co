import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/useProductStore';
import MegaMenu from './MegaMenu';

export const CategoryNav = () => {
  const navigate = useNavigate();
  const { setCategory, resetFilters } = useProductStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    'Rings', 
    'Earrings', 
    'Pendants', 
    'Bangles', 
    'Gifts', 
    'Collections', 
    'Try At Home', 
    'Bespoke', 
    '10+1 Plan'
  ];

  const megaMenuCategories = ['Rings', 'Earrings', 'Pendants', 'Bangles', 'Gifts'];

  const handleCategoryClick = (cat: string) => {
    resetFilters();
    if (megaMenuCategories.includes(cat)) {
      setCategory(cat);
    } else {
      setCategory('All');
    }
    navigate('/products');
    setActiveCategory(null);
  };

  return (
    <nav 
      className="bg-white border-b border-neutral-100 shadow-sm relative select-none"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="container mx-auto px-6">
        <ul className="flex items-center justify-center gap-8 lg:gap-12 py-3.5 text-[11px] font-extrabold uppercase tracking-[2.5px] text-[#4e3a24] overflow-x-auto whitespace-nowrap scrollbar-none">
          {categories.map((item) => {
            const hasMegaMenu = megaMenuCategories.includes(item);
            const isHovered = activeCategory === item;

            return (
              <li 
                key={item} 
                className="relative group"
                onMouseEnter={() => {
                  if (hasMegaMenu) {
                    setActiveCategory(item);
                  } else {
                    setActiveCategory(null);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => handleCategoryClick(item)}
                  className={`hover:text-[#8b7355] transition-colors duration-300 block cursor-pointer bg-transparent border-none font-extrabold text-[11px] uppercase tracking-[2.5px] ${
                    isHovered ? 'text-[#8b7355]' : 'text-[#4e3a24]'
                  }`}
                >
                  {item}
                </button>
                <span 
                  className={`absolute -bottom-3.5 left-0 h-[2.5px] bg-[#8b7355] transition-all duration-300 ${
                    isHovered ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} 
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Render the dropdown MegaMenu overlay absolutely positioned beneath the navbar */}
      {activeCategory && megaMenuCategories.includes(activeCategory) && (
        <MegaMenu 
          category={activeCategory} 
          onClose={() => setActiveCategory(null)} 
        />
      )}
    </nav>
  );
};

export default CategoryNav;
