import { useState } from 'react';
import Navbar from '../components/Navbar';
import ChartPlaceholder from '../components/ChartPlaceholder';
import DataTable from '../components/DataTable';
import { MOCK_READINGS } from '../mock/readings';
import { Search } from 'lucide-react';

export default function Explorer() {
    const [filterType, setFilterType] = useState('All');

    const columns = [
        { header: 'ID', accessor: 'id' as const, className: 'font-mono text-gray-500' },
        { header: 'Sensor ID', accessor: 'sensorId' as const, className: 'font-mono text-brand-secondary' },
        { header: 'Metric', accessor: 'metric' as const, className: 'font-bold' },
        {
            header: 'Value',
            accessor: (item: any) => <span>{item.value} <span className="text-xs text-gray-500">{item.unit}</span></span>
        },
        { header: 'Timestamp', accessor: 'timestamp' as const, className: 'text-gray-400' },
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-primary/30 pt-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-white mb-2">Data Explorer</h1>
                        <p className="text-gray-400">Deep dive into historical sensor readings and raw data logs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search Sensor ID..."
                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-brand-primary outline-none"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 px-4 py-2 focus:ring-1 focus:ring-brand-primary"
                        >
                            <option>All Sources</option>
                            <option>Air Sensors</option>
                            <option>Water Monitory</option>
                            <option>Industrial</option>
                        </select>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ChartPlaceholder title="Aggregate PM2.5 Trends (Last 24h)" />
                    </div>
                    <div className="lg:col-span-1">
                        <ChartPlaceholder title="Report Frequency Analysis" />
                    </div>
                </div>

                {/* Data Table */}
                <div>
                    <h2 className="text-lg font-heading font-semibold text-white mb-4">Raw Data Logs</h2>
                    <DataTable
                        data={MOCK_READINGS}
                        columns={columns}
                        onNext={() => { }}
                        onPrev={() => { }}
                    />
                </div>

            </div>
        </div>
    );
}
