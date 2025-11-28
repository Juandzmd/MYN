import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getRegions, getCommunesByRegion, Region, Commune } from '../services/chileanAddressService';

const LoginView: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Multi-step form for registration
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Login fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Registration fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
    const [streetAddress, setStreetAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const regions = getRegions();
    const communes = selectedRegion ? getCommunesByRegion(selectedRegion.code) : [];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });
            if (error) throw error;
            showToast('✅ ¡Bienvenido de nuevo!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Auth error:', error);
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            showToast('❌ Las contraseñas no coinciden');
            return;
        }

        if (password.length < 8) {
            showToast('❌ La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (!selectedRegion || !selectedCommune) {
            showToast('❌ Debe seleccionar región y comuna');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone,
                        region: selectedRegion.name,
                        commune: selectedCommune.name,
                        street_address: streetAddress,
                        avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
                    }
                }
            });
            if (error) throw error;
            showToast('✅ Registro exitoso. ¡Bienvenido!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Auth error:', error);
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!firstName || !lastName || !email || !phone)) {
            showToast('❌ Complete todos los campos');
            return;
        }
        if (step === 2 && (!selectedRegion || !selectedCommune || !streetAddress)) {
            showToast('❌ Complete todos los campos de dirección');
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

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
                        {isLogin ? 'Iniciar Sesión' : `Crear Cuenta ${!isLogin ? `(Paso ${step}/3)` : ''}`}
                    </h2>
                    <p className="text-myn-light opacity-90">Únete a la comunidad de Myn Coffee Roasters</p>
                </div>

                <div className="p-8">
                    {isLogin ? (
                        // Login Form
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
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
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
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
                                {loading ? <Loader2 className="animate-spin" /> : 'Ingresar'}
                            </button>
                        </form>
                    ) : (
                        // Registration Multi-Step Form
                        <form onSubmit={step === 3 ? handleRegister : (e) => { e.preventDefault(); nextStep(); }} className="space-y-5">
                            {step === 1 && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
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
                                                    required
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
                                                required
                                            />
                                        </div>
                                    </div>

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
                                        <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Teléfono</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                                placeholder="+56 9 1234 5678"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Región</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <select
                                                value={selectedRegion?.code || ''}
                                                onChange={(e) => {
                                                    const region = regions.find(r => r.code === e.target.value);
                                                    setSelectedRegion(region || null);
                                                    setSelectedCommune(null);
                                                }}
                                                className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                                required
                                            >
                                                <option value="">Selecciona una región</option>
                                                {regions.map(region => (
                                                    <option key={region.code} value={region.code}>{region.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Comuna</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <select
                                                value={selectedCommune?.code || ''}
                                                onChange={(e) => {
                                                    const commune = communes.find(c => c.code === e.target.value);
                                                    setSelectedCommune(commune || null);
                                                }}
                                                className="w-full pl-10 p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                                disabled={!selectedRegion}
                                                required
                                            >
                                                <option value="">Selecciona una comuna</option>
                                                {communes.map(commune => (
                                                    <option key={commune.code} value={commune.code}>{commune.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Calle y Número</label>
                                        <input
                                            type="text"
                                            value={streetAddress}
                                            onChange={(e) => setStreetAddress(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors"
                                            placeholder="Av. Libertador 123, Depto 4B"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
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
                                                minLength={8}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Confirmar Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`w-full pl-10 p-3 bg-gray-50 border-b-2 ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-myn-primary outline-none transition-colors`}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        {password && confirmPassword && password !== confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3">
                                {step > 1 && !isLogin && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={18} /> Atrás
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`${step > 1 && !isLogin ? 'flex-1' : 'w-full'} py-4 bg-myn-dark text-white font-bold uppercase tracking-wider hover:bg-myn-primary transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-70`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        step === 3 ? 'Registrarse' : (
                                            <>Siguiente <ArrowRight size={18} /></>
                                        )
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setStep(1);
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
