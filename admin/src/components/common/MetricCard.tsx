import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  iconBgClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon,
  iconBgClass,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(197,168,128,0.05)]">
      <div className="flex items-center gap-4">
        {/* Rounded metallic tinted icon container */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
            {trend && (
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
