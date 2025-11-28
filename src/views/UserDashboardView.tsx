import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Coffee, Star, LogOut } from 'lucide-react';

const UserDashboardView: React.FC = () => {
    const { user, profile, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-myn-cream pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif text-myn-dark mb-2">
                            Hola, {profile?.full_name || user?.email?.split('@')[0]}
                        </h1>
                        <p className="text-gray-600">Bienvenido a tu espacio personal del café.</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                    >
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
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
                            <a href="/shop" className="text-myn-primary font-bold hover:underline">Ir a la Tienda</a>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-myn-dark text-white p-8 rounded-2xl shadow-lg md:col-span-3">
                        <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                            <Star className="text-yellow-400" size={24} /> Recomendado para ti
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                                        <img src={`https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=200&q=80`} alt="Coffee" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Etiopía Yirgacheffe</h4>
                                        <p className="text-xs text-gray-300">Notas florales y cítricas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardView;
