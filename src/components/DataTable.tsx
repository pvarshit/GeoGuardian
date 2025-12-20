import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onNext?: () => void;
    onPrev?: () => void;
    page?: number;
}

export default function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onNext,
    onPrev,
    page = 1
}: DataTableProps<T>) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-brand-dark/30 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase tracking-wider text-xs font-semibold">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={clsx("px-6 py-4", col.className)}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className={clsx("px-6 py-4", col.className)}>
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(item)
                                            : (item[col.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 italic">
                                    No data available found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
                <span className="text-xs text-gray-500">
                    Showing page {page}
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={onPrev}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onNext}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
