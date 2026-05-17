import { ArrowRight } from 'lucide-react';

interface MegaMenuPromoCardProps {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  onCtaClick: () => void;
}

export const MegaMenuPromoCard = ({
  title,
  subtitle,
  image,
  cta,
  onCtaClick,
}: MegaMenuPromoCardProps) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between items-center text-center max-w-[240px] select-none hover:shadow-md transition-shadow duration-300">
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-slate-100 bg-white flex items-center justify-center">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
      <div>
        <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-600 block mb-1">
          Featured Collection
        </span>
        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{title}</h4>
        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onCtaClick}
        className="mt-3.5 bg-[#8b7355] hover:bg-[#6e583e] text-white rounded-lg py-1.5 px-4 cursor-pointer text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 focus:outline-none transition-colors"
      >
        <span>{cta}</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
export default MegaMenuPromoCard;
