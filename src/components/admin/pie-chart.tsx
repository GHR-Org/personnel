import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PieChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
}

// Palette de couleurs Horizon UI avec dégradés
const colorPalette = [
  {
    primary: "#3b82f6",
    secondary: "#1d4ed8",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
  },
  {
    primary: "#8b5cf6", 
    secondary: "#7c3aed",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
  },
  {
    primary: "#ec4899",
    secondary: "#db2777", 
    gradient: "linear-gradient(135deg, #ec4899, #db2777)"
  },
  {
    primary: "#10b981",
    secondary: "#059669",
    gradient: "linear-gradient(135deg, #10b981, #059669)"
  },
  {
    primary: "#f59e0b",
    secondary: "#d97706",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
  },
  {
    primary: "#ef4444",
    secondary: "#dc2626",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
  }
];

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const radius = 80;
  const cx = 100;
  const cy = 100;

  const getColor = (i: number) => {
    return data[i].color || colorPalette[i % colorPalette.length];
  };

  const slices = data.map((d, i) => {
    const value = d.value;
    const startAngle = (cumulative / total) * 2 * Math.PI;
    const endAngle = ((cumulative + value) / total) * 2 * Math.PI;
    cumulative += value;
    
    const x1 = cx + radius * Math.sin(startAngle);
    const y1 = cy - radius * Math.cos(startAngle);
    const x2 = cx + radius * Math.sin(endAngle);
    const y2 = cy - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    const isHovered = hoveredIndex === i;
    const currentColor = getColor(i);
    const scale = isHovered ? 1.05 : 1;
    const opacity = isHovered ? 1 : 0.8;

    return (
      <g key={i}>
        <defs>
          <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentColor.primary} stopOpacity={opacity} />
            <stop offset="100%" stopColor={currentColor.secondary} stopOpacity={opacity} />
          </linearGradient>
          <filter id={`glow-${i}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          d={pathData}
          fill={`url(#gradient-${i})`}
          stroke="#ffffff"
          strokeWidth={2}
          filter={isHovered ? `url(#glow-${i})` : "none"}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      </g>
    );
  });

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-0 shadow-2xl">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div 
            className="relative transition-all duration-1000 ease-out"
            style={{ 
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? 'scale(1)' : 'scale(0.8)' 
            }}
          >
            <svg width={200} height={200} viewBox="0 0 200 200" className="drop-shadow-2xl">
              {slices}
              
              {/* Centre du graphique avec total */}
              <circle
                cx={cx}
                cy={cy}
                r={25}
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              />
              <text
                x={cx}
                y={cy - 5}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {total}
              </text>
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="10"
              >
                Total
              </text>
            </svg>
          </div>
          
          {/* Légende moderne */}
          <div className="mt-6 grid grid-cols-1 gap-3 w-full max-w-xs">
            {data.map((d, i) => {
              const currentColor = getColor(i);
              const percentage = ((d.value / total) * 100).toFixed(1);
              const isHovered = hoveredIndex === i;
              
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isHovered 
                      ? 'scale-105 shadow-lg' 
                      : 'hover:scale-102'
                  }`}
                  style={{
                    background: isHovered 
                      ? `linear-gradient(135deg, ${currentColor.primary}20, ${currentColor.secondary}20)`
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isHovered ? currentColor.primary : 'rgba(255,255,255,0.1)',
                    boxShadow: isHovered ? `0 0 20px ${currentColor.primary}30` : 'none'
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full relative"
                      style={{
                        background: currentColor.gradient,
                        boxShadow: `0 0 8px ${currentColor.primary}60`
                      }}
                    >
                      {isHovered && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{ background: currentColor.primary }}
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{d.label}</div>
                      <div className="text-white/60 text-xs">{d.value} établissements</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 