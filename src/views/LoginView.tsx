import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LoginView: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // Login Logic
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                showToast('✅ ¡Bienvenido de nuevo!');
                navigate('/dashboard');
            } else {
                // Register Logic
                if (!firstName || !lastName) {
                    showToast('❌ Por favor ingresa tu nombre y apellido');
                    setLoading(false);
                    return;
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            full_name: `${firstName} ${lastName}`,
                            avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
                        }
                    }
                });
                if (error) throw error;
                showToast('✅ Registro exitoso. ¡Bienvenido!');
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-myn-dark py-12 px-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1600&q=80"
                    className="w-full h-full object-cover opacity-20"
                    alt="Coffee background"
                />
            </div>

            <div className="max-w-md w-full bg-white relative z-10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-myn-primary p-8 text-center text-white">
                    <h2 className="font-serif text-3xl mb-2">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-myn-light opacity-90">Únete a la comunidad de Myn Coffee Roasters</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Nombre</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                            placeholder="Juan"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                        placeholder="Pérez"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Correo Electrónico</label>
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

                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-myn-dark text-white font-bold uppercase tracking-wider hover:bg-myn-primary transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Ingresar' : 'Registrarse')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                // Clear form if switching, or keep email? Let's keep email/pass for UX if they made a mistake
                            }}
                            className="text-myn-primary hover:text-myn-dark font-medium text-sm transition-colors"
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;