import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendIsGood?: boolean;
  valueSize?: 'normal' | 'large';
}

export function MetricsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendIsGood = false,
  valueSize = 'normal' 
}: MetricsCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className={`font-semibold text-white mt-1 ${valueSize === 'large' ? 'text-4xl' : 'text-2xl'}`}>
            {value}
          </p>
        </div>
        <div className="text-blue-400">{icon}</div>
      </div>
      {trend !== undefined && (
        <div className={`mt-2 text-sm ${trend < 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend < 0 ? '↓' : '↑'} {Math.abs(trend)}% from yesterday
        </div>
      )}
    </GlassCard>
  );
}