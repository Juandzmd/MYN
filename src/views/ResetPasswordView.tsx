import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ResetPasswordView: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        // Check if we have a session (Supabase automatically logs in the user via the magic link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                showToast('❌ Enlace inválido o expirado. Por favor solicita uno nuevo.');
                navigate('/forgot-password');
            }
        };
        checkSession();
    }, [navigate, showToast]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showToast('❌ Las contraseñas no coinciden');
            return;
        }

        if (password.length < 8) {
            showToast('❌ La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            showToast('✅ Contraseña actualizada correctamente');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Update password error:', error);
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-myn-dark py-12 px-4 relative overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"
                    className="w-full h-full object-cover opacity-20"
                    alt="Coffee cup"
                />
            </div>

            <div className="max-w-md w-full bg-white relative z-10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-myn-primary p-8 text-center text-white">
                    <h2 className="font-serif text-2xl mb-2">Nueva Contraseña</h2>
                    <p className="text-myn-light opacity-90">Ingresa tu nueva contraseña segura</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-myn-dark text-white font-bold uppercase tracking-wider hover:bg-myn-primary transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Actualizar Contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordView;
