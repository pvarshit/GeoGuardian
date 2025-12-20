import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface FilterOption {
    label: string;
    checked: boolean;
    count?: number;
}



export default function SidebarFilterCard() {
    const [dataTypes, setDataTypes] = useState<FilterOption[]>([
        { label: 'Air Quality', checked: true, count: 12 },
        { label: 'Water Quality', checked: true, count: 5 },
        { label: 'Industrial Emissions', checked: false, count: 3 },
        { label: 'Citizen Reports', checked: true, count: 8 },
    ]);

    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-brand-dark/50 border border-white/10 rounded-xl overflow-hidden">
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2 text-white font-semibold">
                    <Filter className="w-4 h-4 text-brand-secondary" />
                    <span>Data Layers</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>

            <div className={clsx("transition-all duration-300 ease-in-out px-4 pb-4 space-y-3", isOpen ? "block" : "hidden")}>
                {dataTypes.map((opt, idx) => (
                    <label key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={opt.checked}
                                onChange={() => {
                                    const newTypes = [...dataTypes];
                                    newTypes[idx].checked = !newTypes[idx].checked;
                                    setDataTypes(newTypes);
                                }}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-brand-primary focus:ring-brand-primary focus:ring-offset-gray-900 transition duration-150 ease-in-out"
                            />
                            <span className="text-sm text-gray-300 group-hover:text-white">{opt.label}</span>
                        </div>
                        {opt.count && (
                            <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
                                {opt.count}
                            </span>
                        )}
                    </label>
                ))}

                <div className="pt-4 border-t border-white/10 mt-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wilder mb-2 block">
                        Metric
                    </label>
                    <select className="w-full bg-gray-900 border border-white/10 text-gray-300 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5">
                        <option>PM2.5 (µg/m³)</option>
                        <option>AQI (Index)</option>
                        <option>NO2 (ppb)</option>
                        <option>CO2 (ppm)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
