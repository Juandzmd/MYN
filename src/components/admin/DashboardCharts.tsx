import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardChartsProps {
    salesData: any[];
    visitsData: any[];
    timeRange: 'daily' | 'weekly' | 'monthly';
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ salesData, visitsData, timeRange }) => {

    // Helper to format dates based on range
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (timeRange === 'daily') return format(date, 'HH:mm', { locale: es });
        if (timeRange === 'weekly') return format(date, 'EEEE', { locale: es }); // Day name
        return format(date, 'dd/MM', { locale: es });
    };

    // Process data for charts (grouping would typically happen here or in parent)
    // For this demo, we assume data is already somewhat ready or we map it directly
    const processedSales = salesData.map(item => ({
        ...item,
        formattedDate: formatDate(item.created_at),
    }));

    const processedVisits = visitsData.map(item => ({
        ...item,
        formattedDate: formatDate(item.created_at),
    }));

    return (
        <div className="space-y-8">
            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-myn-dark mb-4">Ventas ({timeRange})</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedSales}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="formattedDate" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`$${value}`, 'Ventas']}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#2d6a4f" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Visits Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-myn-dark mb-4">Visitas al Sitio</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedVisits}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="formattedDate" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" fill="#9c6644" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
