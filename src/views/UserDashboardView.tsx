import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Coffee, Star, LogOut, LayoutDashboard, User, Edit2, Save, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';
import { getRegions, getCommunesByRegion, Region, Commune } from '../services/chileanAddressService';

const UserDashboardView: React.FC = () => {
    const { user, profile, isAdmin, signOut, refreshProfile } = useAuth();
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        phone: '',
        street_address: '',
        region: '',
        commune: ''
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    // Address selectors state
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
    const regions = getRegions();
    const communes = selectedRegion ? getCommunesByRegion(selectedRegion.code) : [];

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

    // FORCE RELOAD PROFILE ON MOUNT TO ENSURE FRESH DATA
    useEffect(() => {
        if (user?.id) {
            refreshProfile();
        }
    }, [user?.id]);

    useEffect(() => {
        if (profile) {
            setEditForm({
                phone: profile.phone || '',
                street_address: profile.street_address || '',
                region: profile.region || '',
                commune: profile.commune || ''
            });

            // Set initial region/commune for selectors if they exist
            if (profile.region) {
                const reg = regions.find(r => r.name === profile.region);
                if (reg) {
                    setSelectedRegion(reg);
                    // If commune also exists, set it (need to wait for communes to update or pass manually)
                    if (profile.commune) {
                        const comms = getCommunesByRegion(reg.code);
                        const com = comms.find(c => c.name === profile.commune);
                        if (com) setSelectedCommune(com);
                    }
                }
            }
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updates = {
                id: user?.id,
                updated_at: new Date(),
                phone: editForm.phone,
                street_address: editForm.street_address,
                region: selectedRegion?.name || editForm.region,
                commune: selectedCommune?.name || editForm.commune
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            showToast('✅ Perfil actualizado correctamente');
            setIsEditing(false);
            // Force reload profile context
            await refreshProfile();
        } catch (error: any) {
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const regionCode = e.target.value;
        const region = regions.find(r => r.code === regionCode);
        setSelectedRegion(region || null);
        setSelectedCommune(null);
        setEditForm({ ...editForm, region: region?.name || '' });
    };

    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communeCode = e.target.value;
        const commune = communes.find(c => c.code === communeCode);
        setSelectedCommune(commune || null);
        setEditForm({ ...editForm, commune: commune?.name || '' });
    };

    return (
        <div className="min-h-screen bg-myn-cream pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-serif text-myn-dark">
                                Hola, {profile?.first_name || profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                            </h1>
                            {isAdmin && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600">Bienvenido a tu espacio personal del café.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Profile Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-bold text-myn-dark flex items-center gap-2">
                                <User className="text-myn-primary" size={20} /> Tu Perfil
                            </h3>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm text-myn-primary font-bold hover:underline flex items-center gap-1"
                                >
                                    <Edit2 size={14} /> Editar
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Teléfono</label>
                                    <input 
                                        type="text" 
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded focus:border-myn-primary outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Región</label>
                                    <select 
                                        value={selectedRegion?.code || ''}
                                        onChange={handleRegionChange}
                                        className="w-full p-2 border border-gray-200 rounded focus:border-myn-primary outline-none text-sm bg-white"
                                    >
                                        <option value="">Seleccionar Región</option>
                                        {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Comuna</label>
                                    <select 
                                        value={selectedCommune?.code || ''}
                                        onChange={handleCommuneChange}
                                        disabled={!selectedRegion}
                                        className="w-full p-2 border border-gray-200 rounded focus:border-myn-primary outline-none text-sm bg-white disabled:bg-gray-100"
                                    >
                                        <option value="">Seleccionar Comuna</option>
                                        {communes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Dirección</label>
                                    <input 
                                        type="text" 
                                        value={editForm.street_address}
                                        onChange={(e) => setEditForm({...editForm, street_address: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded focus:border-myn-primary outline-none text-sm"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="flex-1 bg-myn-dark text-white py-2 rounded text-sm font-bold flex items-center justify-center gap-1"
                                    >
                                        <Save size={14} /> Guardar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm font-bold flex items-center justify-center gap-1"
                                    >
                                        <X size={14} /> Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Nombre</p>
                                    <p className="font-medium text-gray-800">
                                        {profile?.first_name && profile?.last_name 
                                            ? `${profile.first_name} ${profile.last_name}` 
                                            : profile?.full_name || 'Usuario'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                    <p className="font-medium text-gray-800">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Teléfono</p>
                                    <p className="font-medium text-gray-800">{profile?.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Dirección</p>
                                    <p className="font-medium text-gray-800">
                                        {profile?.street_address ? profile.street_address : '-'}
                                    </p>
                                    {profile?.region && (
                                        <p className="text-xs text-gray-500">
                                            {profile.commune ? `${profile.commune}, ` : ''}{profile.region}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <Link 
                                        to="/reset-password" 
                                        className="w-full py-2 border border-myn-primary text-myn-primary rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-myn-primary hover:text-white transition-colors"
                                    >
                                        <Lock size={14} /> Cambiar Contraseña
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subscription Status */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow lg:col-span-2">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Coffee size={100} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-myn-dark mb-4 flex items-center gap-2">
                                    <Coffee className="text-myn-primary" size={20} /> Tu Suscripción
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-6 text-center mb-4 border border-dashed border-gray-200">
                                    <span className="text-gray-400 font-medium block mb-2">No tienes una suscripción activa</span>
                                    <p className="text-sm text-gray-500">Suscríbete y recibe café fresco todos los meses con un 10% de descuento.</p>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto px-6 py-3 bg-myn-primary text-white rounded-lg font-bold hover:bg-myn-dark transition-colors self-start">
                                Explorar Planes
                            </button>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-3">
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
                    <div className="bg-myn-dark text-white p-8 rounded-2xl shadow-lg lg:col-span-3">
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
    );
};

export default UserDashboardView;