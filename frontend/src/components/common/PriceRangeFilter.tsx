interface PriceRangeOption {
  label: string;
  value: number;
}

interface PriceRangeFilterProps {
  options: PriceRangeOption[];
  selectedValue: number;
  onChange: (value: number) => void;
}

export const PriceRangeFilter = ({
  options,
  selectedValue,
  onChange,
}: PriceRangeFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`text-left text-[11px] px-3 py-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
            selectedValue === opt.value
              ? 'bg-blue-50/70 text-blue-700 font-semibold border border-blue-200'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
export default PriceRangeFilter;
