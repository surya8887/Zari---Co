interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
}

export const PageHeader = ({ title, subtitle, description }: PageHeaderProps) => {
  return (
    <div className="text-center mb-8 select-none bg-white border border-slate-100 rounded-3xl py-8 shadow-sm">
      <p className="text-blue-600 font-bold uppercase tracking-[3px] text-[9px] mb-2">
        ✦ {subtitle} ✦
      </p>
      <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 font-semibold tracking-wide">
        {title}
      </h2>
      {description && (
        <p className="text-xs text-slate-400 mt-2">{description}</p>
      )}
    </div>
  );
};
export default PageHeader;
