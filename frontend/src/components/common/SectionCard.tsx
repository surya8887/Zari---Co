interface SectionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const SectionCard = ({ title, action, children }: SectionCardProps) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-5 select-none">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
};
export default SectionCard;
