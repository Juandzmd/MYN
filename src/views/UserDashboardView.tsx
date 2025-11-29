import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Coffee, Star, LogOut, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Product } from '../types';

const UserDashboardView: React.FC = () => {
    const { user, profile, isAdmin, signOut } = useAuth();
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(3);

            if (error) {
                console.error('Error fetching recommendations:', error);
            } else if (data) {
                setRecommendedProducts(data as Product[]);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div className="min-h-screen bg-myn-cream pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-serif text-myn-dark">
                                Hola, {profile?.first_name || user?.email?.split('@')[0]}
                            </h1>
                            {isAdmin && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600">Bienvenido a tu espacio personal del café.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="px-4 py-2 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors shadow-sm font-medium flex items-center gap-2"
                            >
                                <LayoutDashboard size={18} /> Panel Admin
                            </Link>
                        )}
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                        >
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Subscription Status */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Coffee size={100} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-myn-dark mb-4 flex items-center gap-2">
                                <Coffee className="text-myn-primary" size={20} /> Tu Suscripción
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
                                <span className="text-gray-400 font-medium">No tienes una suscripción activa</span>
                            </div>
                            <button className="w-full py-3 bg-myn-primary text-white rounded-lg font-bold hover:bg-myn-dark transition-colors">
                                Explorar Planes
                            </button>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                        <h3 className="text-lg font-bold text-myn-dark mb-6 flex items-center gap-2">
                            <ShoppingBag className="text-myn-primary" size={20} /> Historial de Pedidos
                        </h3>

                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Aún no has realizado pedidos</p>
                            <p className="text-sm text-gray-400 mb-4">¡Descubre nuestros orígenes únicos!</p>
                            <Link to="/shop" className="text-myn-primary font-bold hover:underline">Ir a la Tienda</Link>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-myn-dark text-white p-8 rounded-2xl shadow-lg md:col-span-3">
                        <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                            <Star className="text-yellow-400" size={24} /> Recomendado para ti
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recommendedProducts.map((product) => (
                                <div key={product.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{product.name}</h4>
                                        <p className="text-xs text-gray-300">{product.origin} - {(product.tags || [])[0]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div >
    );
};

export default UserDashboardView;
