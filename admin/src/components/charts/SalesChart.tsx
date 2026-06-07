import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DataPoint {
  day: string;
  revenue: number;
  orders: number;
}

const chartData: DataPoint[] = [
  { day: "Mon", revenue: 5000, orders: 3000 },
  { day: "Tue", revenue: 15000, orders: 8000 },
  { day: "Wed", revenue: 12000, orders: 13000 },
  { day: "Thu", revenue: 22000, orders: 17000 },
  { day: "Fri", revenue: 19000, orders: 16000 },
  { day: "Sat", revenue: 24000, orders: 20000 },
  { day: "Sun", revenue: 28450, orders: 25000 },
];

export const SalesChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 250;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const maxVal = 30000;

  // Calculate coordinates
  const points = chartData.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (chartData.length - 1);
    const yRev = paddingTop + chartHeight - (d.revenue / maxVal) * chartHeight;
    const yOrd = paddingTop + chartHeight - (d.orders / maxVal) * chartHeight;
    return { x, yRev, yOrd };
  });

  // SVG Paths
  const revenueLinePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yRev}`).join(" ");
  const ordersLinePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yOrd}`).join(" ");

  const revenueAreaPath = `
    ${revenueLinePath} 
    L ${points[points.length - 1].x} ${paddingTop + chartHeight} 
    L ${points[0].x} ${paddingTop + chartHeight} Z
  `;

  const ordersAreaPath = `
    ${ordersLinePath} 
    L ${points[points.length - 1].x} ${paddingTop + chartHeight} 
    L ${points[0].x} ${paddingTop + chartHeight} Z
  `;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find closest index
    const relativeX = x - paddingLeft;
    const step = chartWidth / (chartData.length - 1);
    let closestIndex = Math.round(relativeX / step);
    closestIndex = Math.max(0, Math.min(chartData.length - 1, closestIndex));

    setHoveredIndex(closestIndex);
    setMousePos({ x, y });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs relative">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground tracking-wide">Sales Overview</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Revenue vs. Time, Last 7 Days</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {/* Legend indicator */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
              Orders
            </span>
          </div>
          {/* Filter dropdown */}
          <button className="flex items-center gap-1 border border-border bg-secondary/30 text-foreground px-3 py-1.5 rounded-md hover:bg-secondary/60 transition-colors">
            Mon-Sun <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Gold Area Gradient */}
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
            {/* Blue Area Gradient */}
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Y-Ticks */}
          {[0, 10000, 20000, 30000].map((val, i) => {
            const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
            return (
              <g key={i}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={svgWidth - paddingRight} 
                  y2={y} 
                  className="stroke-border/40 stroke-1" 
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 12} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="fill-muted-foreground text-[10px] font-medium"
                >
                  {val === 0 ? "$0" : `$${val / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Fill Areas */}
          <path d={ordersAreaPath} fill="url(#blueGradient)" />
          <path d={revenueAreaPath} fill="url(#goldGradient)" />

          {/* Line Paths */}
          <path d={ordersLinePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <path d={revenueLinePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Grid X-Ticks */}
          {chartData.map((d, i) => {
            const p = points[i];
            return (
              <text 
                key={i} 
                x={p.x} 
                y={svgHeight - paddingBottom + 20} 
                textAnchor="middle" 
                className="fill-muted-foreground text-[10px] font-medium"
              >
                {d.day}
              </text>
            );
          })}

          {/* Interactive Dotted Line & Hover Dots */}
          {hoveredIndex !== null && (
            <g>
              <line 
                x1={points[hoveredIndex].x} 
                y1={paddingTop} 
                x2={points[hoveredIndex].x} 
                y2={paddingTop + chartHeight} 
                className="stroke-primary/40 stroke-1"
                strokeDasharray="3 3"
              />
              {/* Blue line point dot */}
              <circle 
                cx={points[hoveredIndex].x} 
                cy={points[hoveredIndex].yOrd} 
                r="6" 
                className="fill-[#090a0f] stroke-blue-500 stroke-2"
              />
              <circle 
                cx={points[hoveredIndex].x} 
                cy={points[hoveredIndex].yOrd} 
                r="3" 
                className="fill-blue-500"
              />
              {/* Gold line point dot */}
              <circle 
                cx={points[hoveredIndex].x} 
                cy={points[hoveredIndex].yRev} 
                r="6" 
                className="fill-[#090a0f] stroke-primary stroke-2"
              />
              <circle 
                cx={points[hoveredIndex].x} 
                cy={points[hoveredIndex].yRev} 
                r="3" 
                className="fill-primary"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && (
          <div 
            className="absolute bg-card border border-border rounded-lg p-3 shadow-lg pointer-events-none text-xs space-y-1.5 z-10 min-w-32 transition-all duration-75"
            style={{ 
              left: `${mousePos.x + 15}px`, 
              top: `${mousePos.y - 45}px`,
              transform: "translate(-5%, -50%)"
            }}
          >
            <p className="font-semibold text-foreground border-b border-border/50 pb-1 mb-1 uppercase tracking-wider text-[10px] text-muted-foreground">
              {chartData[hoveredIndex].day} Details
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block" />
                Revenue:
              </span>
              <span className="font-bold text-foreground">
                ${chartData[hoveredIndex].revenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" />
                Orders:
              </span>
              <span className="font-bold text-foreground">
                {chartData[hoveredIndex].orders.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
