import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/useProductStore';
import MegaMenuColumn from './MegaMenuColumn';
import MegaMenuPromoCard from './MegaMenuPromoCard';

interface MegaMenuProps {
  category: string;
  onClose: () => void;
}

interface MenuConfig {
  popularTypes: string[];
  prices: { label: string; maxPrice: number }[];
  metalsStones: string[];
  promo: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
  };
}

const CATEGORY_CONFIGS: Record<string, MenuConfig> = {
  Rings: {
    popularTypes: ['Engagement', 'Couple Bands', 'Office Wear', 'Stackable', 'Solitaire', 'Cocktail', 'For Men', 'For Gift'],
    prices: [
      { label: 'Under ₹20,000', maxPrice: 20000 },
      { label: 'Under ₹50,000', maxPrice: 50000 },
      { label: 'Under ₹1,00,000', maxPrice: 100000 },
      { label: 'Under ₹2,00,000', maxPrice: 200000 },
      { label: 'Show All Prices', maxPrice: 300000 },
    ],
    metalsStones: ['Diamond', 'Gold', 'Silver', 'Platinum', 'Rose Gold'],
    promo: {
      title: 'The Eternity Solitaire',
      subtitle: 'Brilliant-cut 18K solid yellow gold',
      image: '/images/gold_diamond_ring.png',
      cta: 'View Rings Catalog',
    },
  },
  Earrings: {
    popularTypes: ['Jhumkas', 'Studs', 'Drops', 'Hoops', 'Chandeliers', 'Daily Wear', 'Party Wear'],
    prices: [
      { label: 'Under ₹20,000', maxPrice: 20000 },
      { label: 'Under ₹50,000', maxPrice: 50000 },
      { label: 'Under ₹1,00,000', maxPrice: 100000 },
      { label: 'Show All Prices', maxPrice: 300000 },
    ],
    metalsStones: ['Diamond', 'Gold', 'Silver', 'Rose Gold'],
    promo: {
      title: 'Royal Drop Earrings',
      subtitle: 'Luxury 18K white gold certified diamonds',
      image: '/images/gold_drop_earrings.png',
      cta: 'View Earrings Catalog',
    },
  },
  Pendants: {
    popularTypes: ['Heart Motifs', 'Floral Shapes', 'Religious Symbols', 'Alphabet Initials', 'Solitaires'],
    prices: [
      { label: 'Under ₹20,000', maxPrice: 20000 },
      { label: 'Under ₹50,000', maxPrice: 50000 },
      { label: 'Show All Prices', maxPrice: 300000 },
    ],
    metalsStones: ['Diamond', 'Gold', 'Platinum'],
    promo: {
      title: 'Classic Alphabet Pendant',
      subtitle: 'Initials hand-carved in solid gold',
      image: '/images/gold_necklace.png',
      cta: 'View Pendants Catalog',
    },
  },
  Bangles: {
    popularTypes: ['Kadas', 'Round Bangles', 'Flexible Bracelets', 'Heritage Kada'],
    prices: [
      { label: 'Under ₹50,000', maxPrice: 50000 },
      { label: 'Under ₹1,00,000', maxPrice: 100000 },
      { label: 'Show All Prices', maxPrice: 300000 },
    ],
    metalsStones: ['Diamond', 'Gold', 'Rose Gold', 'Platinum'],
    promo: {
      title: 'Heritage Bridal Kada',
      subtitle: 'Intricate 22K yellow gold engravings',
      image: '/images/gold_bangles.png',
      cta: 'View Bangles Catalog',
    },
  },
  Gifts: {
    popularTypes: ['For Her', 'For Him', 'For Kids', 'Anniversary Gold', 'Wedding Shagun'],
    prices: [
      { label: 'Under ₹10,000', maxPrice: 10000 },
      { label: 'Under ₹30,000', maxPrice: 30000 },
      { label: 'Show All Prices', maxPrice: 300000 },
    ],
    metalsStones: ['Diamond', 'Gold Coins', 'Silver Presets'],
    promo: {
      title: 'The Gift of Sovereignty',
      subtitle: 'Certified pure gold & silver coins',
      image: '/images/luxury_jewelry_model.png',
      cta: 'Explore Gifting',
    },
  },
};

export const MegaMenu = ({ category, onClose }: MegaMenuProps) => {
  const navigate = useNavigate();
  const { setBulkFilters, resetFilters } = useProductStore();

  const config = CATEGORY_CONFIGS[category];
  if (!config) return null;

  const handleTypeClick = (type: string) => {
    resetFilters();
    setBulkFilters({
      category,
      priceRange: [0, 300000],
      productTypes: [type],
      metals: [],
      genders: [],
      offers: [],
      occasions: [],
      styles: [],
      designs: [],
    });
    navigate('/products');
    onClose();
  };

  const handlePriceClick = (maxPrice: number) => {
    resetFilters();
    setBulkFilters({
      category,
      priceRange: [0, maxPrice],
      productTypes: [],
      metals: [],
      genders: [],
      offers: [],
      occasions: [],
      styles: [],
      designs: [],
    });
    navigate('/products');
    onClose();
  };

  const handleMetalClick = (metal: string) => {
    resetFilters();
    setBulkFilters({
      category,
      priceRange: [0, 300000],
      productTypes: [],
      metals: [metal],
      genders: [],
      offers: [],
      occasions: [],
      styles: [],
      designs: [],
    });
    navigate('/products');
    onClose();
  };

  const handlePromoCtaClick = () => {
    resetFilters();
    setBulkFilters({
      category,
      priceRange: [0, 300000],
      productTypes: [],
      metals: [],
      genders: [],
      offers: [],
      occasions: [],
      styles: [],
      designs: [],
    });
    navigate('/products');
    onClose();
  };

  return (
    <div 
      className="absolute left-0 top-full w-full bg-white/95 backdrop-blur-md shadow-2xl border-t border-slate-100 z-50 animate-fadeIn"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Popular Types */}
        <MegaMenuColumn
          title="Popular Styles"
          items={config.popularTypes.map((type) => ({
            label: type,
            onClick: () => handleTypeClick(type),
          }))}
        />

        {/* Col 2: Price Filters */}
        <MegaMenuColumn
          title="Price Presets"
          items={config.prices.map((p) => ({
            label: p.label,
            onClick: () => handlePriceClick(p.maxPrice),
          }))}
        />

        {/* Col 3: Metals & Stones */}
        <MegaMenuColumn
          title="Metals & Elements"
          items={config.metalsStones.map((m) => ({
            label: m,
            onClick: () => handleMetalClick(m),
          }))}
        />

        {/* Col 4: Promo Showcase Card */}
        <div className="flex justify-center md:justify-end">
          <MegaMenuPromoCard
            title={config.promo.title}
            subtitle={config.promo.subtitle}
            image={config.promo.image}
            cta={config.promo.cta}
            onCtaClick={handlePromoCtaClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
