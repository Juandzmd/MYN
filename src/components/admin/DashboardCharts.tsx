import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardChartsProps {
    salesData: any[];
    visitsData: any[];
    timeRange: 'daily' | 'weekly' | 'monthly';
    activeTab: 'dashboard' | 'sales' | 'visits';
}

const COLORS = ['#2d6a4f', '#52b788', '#95d5b2', '#d8f3dc'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ salesData, visitsData, timeRange, activeTab }) => {

    const aggregateData = (data: any[], range: 'daily' | 'weekly' | 'monthly', valueKey: string = 'count') => {
        const grouped: { [key: string]: number } = {};

        data.forEach(item => {
            let key: string;
            const date = parseISO(item.created_at);

            if (range === 'daily') {
                key = format(date, 'yyyy-MM-dd');
            } else if (range === 'weekly') {
                key = format(startOfWeek(date, { locale: es }), 'yyyy-MM-dd');
            } else {
                key = format(startOfMonth(date), 'yyyy-MM-dd');
            }

            grouped[key] = (grouped[key] || 0) + (valueKey === 'amount' ? Number(item.amount) : 1);
        });

        return Object.entries(grouped).map(([date, value]) => ({
            date,
            displayDate: range === 'daily'
                ? format(parseISO(date), 'dd MMM', { locale: es })
                : range === 'weekly'
                    ? `S ${format(parseISO(date), 'dd/MM', { locale: es })}`
                    : format(parseISO(date), 'MMM yyyy', { locale: es }),
            value
        })).sort((a, b) => a.date.localeCompare(b.date));
    };

    const productDistribution = [
        { name: 'Kenya Nyeri', value: 35, sales: 15 },
        { name: 'Perú Valle', value: 40, sales: 18 },
        { name: 'Drip Coffee', value: 25, sales: 12 }
    ];

    const aggregatedVisits = aggregateData(visitsData, timeRange);
    const aggregatedSales = aggregateData(salesData, timeRange, 'amount');

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toLocaleString('es-CL')}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const showVisitsChart = activeTab === 'dashboard' || activeTab === 'visits';
    const showSalesCharts = activeTab === 'dashboard' || activeTab === 'sales';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {showVisitsChart && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Visitas {timeRange === 'daily' ? 'Diarias' : timeRange === 'weekly' ? 'Semanales' : 'Mensuales'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={aggregatedVisits}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="displayDate" stroke="#666" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#2d6a4f" radius={[8, 8, 0, 0]} name="Visitas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {showSalesCharts && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Productos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={productDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {productDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any, name: any, props: any) => [`${props.payload.sales} ventas (${value}%)`, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {showSalesCharts && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Tendencia de Ingresos {timeRange === 'daily' ? '(Diario)' : timeRange === 'weekly' ? '(Semanal)' : '(Mensual)'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={aggregatedSales}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="displayDate" stroke="#666" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#666" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} formatter={(value: any) => [`$${value.toLocaleString('es-CL')}`, 'Ingresos']} />
                            <Area type="monotone" dataKey="value" stroke="#2d6a4f" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" name="Ingresos" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default DashboardCharts;
