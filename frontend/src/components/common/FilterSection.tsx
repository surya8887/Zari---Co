import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isLast?: boolean;
}

export const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
  isLast = false,
}: FilterSectionProps) => {
  return (
    <div className={`py-3.5 ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 cursor-pointer focus:outline-none"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && <div className="mt-3 animate-fadeIn">{children}</div>}
    </div>
  );
};
export default FilterSection;
