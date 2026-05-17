interface MegaMenuColumnProps {
  title: string;
  items: { label: string; onClick: () => void }[];
}

export const MegaMenuColumn = ({ title, items }: MegaMenuColumnProps) => {
  return (
    <div className="flex flex-col gap-3 select-none">
      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#8b7355] border-b border-slate-100 pb-2">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={item.onClick}
              className="text-left text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer focus:outline-none"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MegaMenuColumn;
