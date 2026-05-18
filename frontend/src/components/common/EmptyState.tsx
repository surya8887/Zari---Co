import { SlidersHorizontal } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon = <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-4 animate-pulse" />,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl py-24 px-6 text-center shadow-sm select-none">
      {icon}
      <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-700 mb-2">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer shadow-md active:scale-95 focus:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
export default EmptyState;
