import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DashboardCharts from '../components/admin/DashboardCharts';
import { LayoutDashboard, ShoppingBag, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminView: React.FC = () => {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'visits'>('dashboard');
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    // Data states
    const [salesData, setSalesData] = useState<any[]>([]);
    const [visitsData, setVisitsData] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Sales
            const { data: sales, error: salesError } = await supabase
                .from('sales')
                .select('*')
                .order('created_at', { ascending: true });

            if (salesError) throw salesError;
            setSalesData(sales || []);

            // Fetch Visits
            const { data: visits, error: visitsError } = await supabase
                .from('site_visits')
                .select('*')
                .order('created_at', { ascending: true });

            if (visitsError) throw visitsError;

            const processedVisits = processVisitsData(visits || [], timeRange);
            setVisitsData(processedVisits);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to group visits
    const processVisitsData = (data: any[], range: string) => {
        return data.map(v => ({
            created_at: v.created_at,
            count: 1
        }));
    };

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-myn-dark text-white hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-serif font-bold">MYN Admin</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-myn-primary' : 'hover:bg-white/10'}`}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sales' ? 'bg-myn-primary' : 'hover:bg-white/10'}`}
                    >
                        <ShoppingBag size={20} /> Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('visits')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'visits' ? 'bg-myn-primary' : 'hover:bg-white/10'}`}
                    >
                        <Users size={20} /> Visitas
                    </button>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={signOut} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {activeTab === 'dashboard' && 'Resumen General'}
                        {activeTab === 'sales' && 'Reporte de Ventas'}
                        {activeTab === 'visits' && 'Tráfico Web'}
                    </h2>

                    {/* Time Range Selector */}
                    <div className="flex bg-white rounded-lg shadow-sm p-1">
                        {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeRange === range ? 'bg-myn-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {range === 'daily' && 'Diario'}
                                {range === 'weekly' && 'Semanal'}
                                {range === 'monthly' && 'Mensual'}
                            </button>
                        ))}
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myn-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Ventas Totales</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    ${salesData.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString('es-CL')}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Visitas Totales</div>
                                <div className="text-3xl font-bold text-gray-900">{visitsData.length}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Conversión</div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {visitsData.length > 0 ? ((salesData.length / visitsData.length) * 100).toFixed(1) : 0}%
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <DashboardCharts salesData={salesData} visitsData={visitsData} timeRange={timeRange} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminView;
