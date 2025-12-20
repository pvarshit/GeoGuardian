import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
    };
    icon?: React.ReactNode;
}

export default function MetricCard({ title, value, unit, trend, icon }: MetricCardProps) {
    return (
        <div className="bg-brand-dark border border-white/10 rounded-xl p-6 shadow-sm hover:border-brand-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h4>
                {icon && <div className="text-brand-secondary">{icon}</div>}
            </div>

            <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-heading font-bold text-white">{value}</span>
                {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
            </div>

            {trend && (
                <div className={clsx("flex items-center mt-2 text-xs font-medium", {
                    'text-emerald-400': trend.direction === 'neutral' || (trend.direction === 'down' && title.includes('PM')), // Low pollution is good
                    'text-red-400': trend.direction === 'up' && title.includes('PM'), // High pollution is bad
                    'text-brand-accent': trend.direction === 'up' && !title.includes('PM'), // Context dependent
                })}>
                    {trend.direction === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> :
                        trend.direction === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> :
                            <Minus className="w-3 h-3 mr-1" />}

                    <span>{trend.value}% vs last week</span>
                </div>
            )}
        </div>
    );
}
