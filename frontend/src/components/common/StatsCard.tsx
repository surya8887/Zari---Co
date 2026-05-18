interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export const StatsCard = ({ title, value, description }: StatsCardProps) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm select-none">
      <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">
        {title}
      </span>
      <span className="text-xl font-bold font-serif text-slate-800">
        {value}
      </span>
      {description && (
        <span className="text-[10px] font-bold text-slate-500 line-clamp-1 block mt-1">
          {description}
        </span>
      )}
    </div>
  );
};
export default StatsCard;
