import React, { useState, useRef } from 'react';
import { Coffee, Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useToast } from '../context/ToastContext';

const WholesaleView: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        user_name: '',
        user_company: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // NOTE: Service ID is missing. Using 'service_default' as placeholder.
        // User needs to replace this with their actual Service ID from EmailJS.
        const SERVICE_ID = 'service_41vkz2w';
        const TEMPLATE_ID = 'template_ulifsik';
        const PUBLIC_KEY = 'AetaTgfeC5F32gOkA';

        if (!formData.user_name || !formData.message) {
            showToast('❌ Por favor completa los campos requeridos');
            setLoading(false);
            return;
        }

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current!, PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
                showToast('✅ ¡Mensaje enviado con éxito!');
                setFormData({ user_name: '', user_company: '', message: '' });
            }, (error) => {
                console.log(error.text);
                showToast('❌ Error al enviar. Intenta nuevamente.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-myn-dark py-12 md:py-20 px-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80"
                    className="w-full h-full object-cover opacity-10"
                    alt="Coffee texture"
                />
            </div>

            <div className="max-w-3xl w-full bg-white relative z-10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up my-4 md:my-0">
                <div className="bg-myn-primary p-8 md:p-10 md:w-1/3 flex flex-col justify-between text-white">
                    <div>
                        <h3 className="font-serif text-2xl mb-4">Socios de Café</h3>
                        <p className="text-myn-light text-sm opacity-90 leading-relaxed">Ofrecemos precios competitivos, capacitación y equipamiento para tu negocio.</p>
                    </div>
                    <div className="mt-8 md:mt-10">
                        <div className="mb-2"><Coffee size={32} /></div>
                        <p className="font-bold text-sm">Más de 50 cafeterías confían en Myn.</p>
                    </div>
                </div>

                <div className="p-8 md:p-10 md:w-2/3">
                    <h2 className="text-2xl font-serif text-myn-dark mb-6">Cotiza con nosotros</h2>
                    <form ref={form} className="space-y-5" onSubmit={sendEmail}>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Nombre de contacto</label>
                            <input
                                type="text"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors placeholder-gray-300"
                                placeholder="Ej. Juan Pérez"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Nombre Cafetería / Empresa</label>
                            <input
                                type="text"
                                name="user_company"
                                value={formData.user_company}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors placeholder-gray-300"
                                placeholder="Ej. Café Central"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Mensaje</label>
                            <textarea
                                name="message"
                                rows={3}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-myn-primary outline-none transition-colors placeholder-gray-300 resize-none"
                                placeholder="Cuéntanos sobre tu proyecto..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-myn-dark text-white font-bold uppercase tracking-wider hover:bg-myn-primary transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Enviando...
                                </>
                            ) : (
                                <>
                                    Enviar Solicitud <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WholesaleView;