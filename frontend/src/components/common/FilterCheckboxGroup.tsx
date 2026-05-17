interface FilterCheckboxGroupProps {
  options: string[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

export const FilterCheckboxGroup = ({
  options,
  selectedValues,
  onChange,
}: FilterCheckboxGroupProps) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const checked = selectedValues.includes(option);
        return (
          <label
            key={option}
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(option)}
              className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600 w-3.5 h-3.5 border-slate-300 cursor-pointer"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
};
export default FilterCheckboxGroup;
