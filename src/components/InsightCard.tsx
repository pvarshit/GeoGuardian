import { clsx } from 'clsx';
import { type Insight } from '../mock/insights';

interface InsightCardProps {
    insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
    return (
        <div className="group relative bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className={clsx("absolute left-0 top-0 bottom-0 w-1 rounded-l-lg", {
                'bg-red-500': insight.severity === 'High',
                'bg-brand-accent': insight.severity === 'Medium',
                'bg-emerald-500': insight.severity === 'Low',
            })} />

            <div className="pl-3">
                <div className="flex items-start justify-between mb-1">
                    <h5 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                        {insight.title}
                    </h5>
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full border", {
                        'border-red-500/30 text-red-400 bg-red-500/10': insight.severity === 'High',
                        'border-brand-accent/30 text-brand-accent bg-brand-accent/10': insight.severity === 'Medium',
                        'border-emerald-500/30 text-emerald-400 bg-emerald-500/10': insight.severity === 'Low',
                    })}>
                        {insight.severity}
                    </span>
                </div>

                <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                    {insight.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                    <span>{insight.sourceAgent}</span>
                    <span>{insight.timestamp}</span>
                </div>
            </div>
        </div>
    );
}
