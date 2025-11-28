import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import DashboardCharts from '../components/admin/DashboardCharts';
import ProductManagement from '../components/admin/ProductManagement';
import { LayoutDashboard, ShoppingBag, Users, LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminView: React.FC = () => {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'visits' | 'products'>('dashboard');
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
        if (activeTab !== 'products') {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [timeRange, activeTab]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-myn-dark to-myn-primary text-white hidden md:flex flex-col shadow-xl">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-serif font-bold">MYN Admin</h1>
                    <p className="text-sm text-myn-light/80 mt-1">Panel de Administración</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard'
                                ? 'bg-white/20 shadow-lg'
                                : 'hover:bg-white/10'
                            }`}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'sales'
                                ? 'bg-white/20 shadow-lg'
                                : 'hover:bg-white/10'
                            }`}
                    >
                        <ShoppingBag size={20} /> Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('visits')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'visits'
                                ? 'bg-white/20 shadow-lg'
                                : 'hover:bg-white/10'
                            }`}
                    >
                        <Users size={20} /> Visitas
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'products'
                                ? 'bg-white/20 shadow-lg'
                                : 'hover:bg-white/10'
                            }`}
                    >
                        <Package size={20} /> Productos
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
                    >
                        <Home size={18} /> Volver a la Tienda
                    </Link>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
                    >
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {activeTab === 'dashboard' && 'Resumen General'}
                            {activeTab === 'sales' && 'Reporte de Ventas'}
                            {activeTab === 'visits' && 'Tráfico Web'}
                            {activeTab === 'products' && 'Gestión de Productos'}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {activeTab === 'products'
                                ? 'Administra tu catálogo de productos'
                                : 'Métricas y estadísticas'}
                        </p>
                    </div>

                    {/* Time Range Selector - Hide for products tab */}
                    {activeTab !== 'products' && (
                        <div className="flex bg-white rounded-lg shadow-sm p-1">
                            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeRange === range
                                            ? 'bg-myn-primary text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {range === 'daily' && 'Diario'}
                                    {range === 'weekly' && 'Semanal'}
                                    {range === 'monthly' && 'Mensual'}
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                {/* Content */}
                {activeTab === 'products' ? (
                    <ProductManagement />
                ) : loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myn-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
                                    Ventas Totales
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    ${salesData.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString('es-CL')}
                                </div>
                                <div className="text-xs text-green-600 mt-2 font-medium">
                                    {salesData.length} transacciones
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
                                    Visitas Totales
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{visitsData.length}</div>
                                <div className="text-xs text-blue-600 mt-2 font-medium">
                                    Este período
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
                                    Conversión
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {visitsData.length > 0
                                        ? ((salesData.length / visitsData.length) * 100).toFixed(1)
                                        : 0}
                                    %
                                </div>
                                <div className="text-xs text-purple-600 mt-2 font-medium">
                                    Tasa de conversión
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
