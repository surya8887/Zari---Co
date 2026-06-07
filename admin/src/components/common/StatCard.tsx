import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  iconBgClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  iconBgClass,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(197,168,128,0.05)] hover:-translate-y-0.5 group">
      <div className="flex items-center gap-4">
        {/* Rounded metallic tinted icon container */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${iconBgClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">{title}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground transition-all group-hover:text-primary-foreground">{value}</span>
            {trend && (
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-0.5 select-none">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
