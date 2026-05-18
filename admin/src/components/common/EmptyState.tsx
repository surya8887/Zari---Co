import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border/80 bg-[#101216]/40 rounded-xl backdrop-blur-xs space-y-4 max-w-lg mx-auto py-16 animate-in fade-in duration-200">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary/30 text-muted-foreground border border-border/50 shadow-xs mb-1">
        {icon || <FolderOpen size={24} className="opacity-60" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-foreground tracking-wide uppercase">{title}</h4>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 bg-primary text-[#090a0f] px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-xs select-none active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
export default EmptyState;
