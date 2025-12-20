export default function ChartPlaceholder({ title }: { title: string }) {
    return (
        <div className="w-full h-64 bg-brand-dark/50 border border-white/10 rounded-xl p-4 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>

            <div className="flex-1 flex items-end justify-between space-x-2 px-2">
                {/* Fake Bars */}
                {[30, 45, 25, 60, 75, 50, 65, 40, 55, 70, 45, 35].map((h, i) => (
                    <div
                        key={i}
                        className="w-full bg-brand-primary/20 hover:bg-brand-primary/50 transition-colors rounded-t-sm relative group"
                        style={{ height: `${h}%` }}
                    >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-xs text-white px-2 py-1 rounded">
                            {h}
                        </div>
                    </div>
                ))}
            </div>

            {/* X-axis */}
            <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
            </div>
        </div>
    );
}
