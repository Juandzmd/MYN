import React from 'react';
import { Check } from 'lucide-react';

const SubscriptionView: React.FC = () => (
    <div className="bg-myn-cream py-12 md:py-20 px-4 animate-fade-in min-h-screen">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
                <span className="inline-block px-4 py-1 rounded-full bg-myn-light text-myn-dark text-xs font-bold uppercase tracking-widest mb-4">Club Myn</span>
                <h2 className="text-4xl md:text-6xl font-serif text-myn-dark mb-4 md:mb-6">Nunca te quedes sin café</h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
                    Recibe lo mejor de nuestras fincas asociadas directamente en tu puerta. Frescura garantizada, sin permanencia.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Plan Basic */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <h3 className="font-serif text-2xl text-myn-dark mb-2">Explorador</h3>
                    <p className="text-gray-400 text-sm mb-6">Ideal para fines de semana</p>
                    <div className="text-3xl font-bold text-myn-dark mb-8">$18.990<span className="text-sm font-normal text-gray-400">/mes</span></div>
                    <button className="w-full py-4 border-2 border-myn-dark text-myn-dark font-bold uppercase tracking-wider text-xs hover:bg-myn-dark hover:text-white transition-colors rounded-lg mb-8">
                        Seleccionar
                    </button>
                    <ul className="text-sm text-gray-600 space-y-4">
                        <li className="flex items-center gap-3"><Check size={16} className="text-myn-primary" /> 2 Bolsas (500g total)</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-myn-primary" /> Origen Rotativo</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-myn-primary" /> Envío Stgo Incluido</li>
                    </ul>
                </div>

                {/* Plan Featured */}
                <div className="bg-myn-dark p-10 rounded-2xl shadow-2xl transform md:-translate-y-4 relative overflow-hidden text-white my-4 md:my-0 ring-4 ring-myn-light/20 md:ring-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-myn-primary rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <h3 className="font-serif text-3xl mb-2">Aficionado</h3>
                    <p className="text-myn-light text-sm mb-6">El favorito de la casa</p>
                    <div className="text-4xl font-bold mb-8">$34.990<span className="text-sm font-normal text-gray-400">/mes</span></div>
                    <button className="w-full py-4 bg-myn-primary hover:bg-white hover:text-myn-dark text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-lg mb-8 shadow-lg">
                        Seleccionar
                    </button>
                    <ul className="text-sm text-gray-300 space-y-4">
                        <li className="flex items-center gap-3"><span className="bg-white text-myn-dark rounded-full p-0.5"><Check size={12} /></span> 4 Bolsas (1kg total)</li>
                        <li className="flex items-center gap-3"><span className="bg-white text-myn-dark rounded-full p-0.5"><Check size={12} /></span> Acceso a Microlotes</li>
                        <li className="flex items-center gap-3"><span className="bg-white text-myn-dark rounded-full p-0.5"><Check size={12} /></span> Regalo Sorpresa Trimestral</li>
                    </ul>
                </div>

                {/* Plan Pro */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <h3 className="font-serif text-2xl text-myn-dark mb-2">Familia / Oficina</h3>
                    <p className="text-gray-400 text-sm mb-6">Energía para todos</p>
                    <div className="text-3xl font-bold text-myn-dark mb-8">$65.990<span className="text-sm font-normal text-gray-400">/mes</span></div>
                    <button className="w-full py-4 border-2 border-myn-dark text-myn-dark font-bold uppercase tracking-wider text-xs hover:bg-myn-dark hover:text-white transition-colors rounded-lg mb-8">
                        Seleccionar
                    </button>
                    <ul className="text-sm text-gray-600 space-y-4">
                        <li className="flex items-center gap-3"><Check size={16} className="text-myn-primary" /> 2 Kilos de Café</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-myn-primary" /> Descuento en Accesorios</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-myn-primary" /> Asesoría Barista</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default SubscriptionView;