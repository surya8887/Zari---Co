import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/useProductStore';
import MegaMenu from './MegaMenu';

export const CategoryNav = () => {
  const navigate = useNavigate();
  const { categories: dbCategories, fetchCategories, setCategory, resetFilters } = useProductStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatCategoryName = (name: string) => {
    if (!name) return '';
    const clean = name.trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  };

  // Extract top-level categories dynamically strictly from backend API response
  const rawCategories = dbCategories.length > 0
    ? dbCategories.filter(c => !c.parentId && !(c as any).parent_id).map(c => formatCategoryName(c.name))
    : dbCategories.map(c => formatCategoryName(c.name));

  const categories = Array.from(new Set(rawCategories));

  const handleCategoryClick = (cat: string) => {
    resetFilters();
    setCategory(cat);
    navigate('/products');
    setActiveCategory(null);
  };

  return (
    <nav 
      className="bg-white border-b border-neutral-100 shadow-sm relative select-none"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <ul className="flex items-center justify-start md:justify-center gap-8 lg:gap-12 py-3.5 text-[11px] font-extrabold uppercase tracking-[2.5px] text-[#4e3a24] overflow-x-auto whitespace-nowrap scrollbar-none px-2 md:px-0">
          {categories.map((item) => {
            const isHovered = activeCategory === item;

            return (
              <li 
                key={item} 
                className="relative group"
                onMouseEnter={() => setActiveCategory(item)}
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
      {activeCategory && (
        <MegaMenu 
          category={activeCategory} 
          onClose={() => setActiveCategory(null)} 
        />
      )}
    </nav>
  );
};

export default CategoryNav;
