import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ForgotPasswordView: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}#/reset-password`,
            });

            if (error) throw error;

            showToast('✅ Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        } catch (error: any) {
            console.error('Reset password error:', error);
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-myn-dark py-12 px-4 relative overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1447933601403-0c60ef473b0d?auto=format&fit=crop&w=1600&q=80"
                    className="w-full h-full object-cover opacity-20"
                    alt="Coffee beans"
                />
            </div>

            <div className="max-w-md w-full bg-white relative z-10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-myn-primary p-8 text-center text-white">
                    <h2 className="font-serif text-2xl mb-2">Recuperar Contraseña</h2>
                    <p className="text-myn-light opacity-90">Ingresa tu correo para recibir instrucciones</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-myn-dark text-white font-bold uppercase tracking-wider hover:bg-myn-primary transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Enviar Correo'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-myn-primary hover:text-myn-dark font-medium text-sm transition-colors flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordView;
