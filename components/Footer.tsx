import React from 'react';
import { ViewState } from '../types';
import { Leaf, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
    setView: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => (
    <footer className="bg-myn-dark text-white pt-16 md:pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16 text-center md:text-left">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2 mb-6 text-myn-primary">
                    <Leaf size={24} />
                    <span className="text-2xl font-serif font-bold text-white">Myn.</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs md:max-w-none">
                    Tostaduría de especialidad enfocada en la trazabilidad, la calidad y el respeto por el origen natural del grano.
                </p>
            </div>

            {/* Navigation */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-myn-primary">Explorar</h4>
                <ul className="space-y-3 text-sm text-gray-400 flex flex-col items-center md:items-start">
                    <li><button onClick={() => setView('shop')} className="hover:text-white transition-colors">Tienda Online</button></li>
                    <li><button onClick={() => setView('subscription')} className="hover:text-white transition-colors">Club de Suscripción</button></li>
                    <li><button onClick={() => setView('wholesale')} className="hover:text-white transition-colors">Venta Mayorista</button></li>
                    <li><button onClick={() => setView('guides')} className="hover:text-white transition-colors">Escuela de Café</button></li>
                </ul>
            </div>

            {/* Contact */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-myn-primary">Contacto</h4>
                <ul className="space-y-3 text-sm text-gray-400 flex flex-col items-center md:items-start">
                    <li className="flex items-center gap-2"><Mail size={14} /> hola@myncoffee.cl</li>
                    <li className="flex items-center gap-2"><Phone size={14} /> +56 9 1234 5678</li>
                    <li className="flex items-center gap-2"><MapPin size={14} /> Santiago, Chile</li>
                    <li className="pt-2 text-white opacity-50 hover:opacity-100 cursor-pointer flex items-center gap-2 transition-opacity">
                        <Instagram size={16} /> @myncoffeeroasters
                    </li>
                </ul>
            </div>

            {/* Payments */}
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-myn-primary">Pagos Seguros</h4>
                <div className="bg-white p-3 inline-block rounded-lg shadow-lg mb-4">
                    <span className="text-myn-dark font-bold text-sm tracking-tighter">Transbank</span>
                    <span className="text-red-600 font-bold text-sm ml-1">Webpay</span>
                </div>
                <p className="text-xs text-gray-500 max-w-xs">Tus transacciones están protegidas con encriptación SSL de nivel bancario.</p>
            </div>
        </div>
        
        <div className="text-center text-gray-600 text-xs pt-8 border-t border-white/5">
            &copy; {new Date().getFullYear()} Myn Coffee Roasters. Diseñado con <span className="text-myn-primary">♥</span> y cafeína.
        </div>
    </footer>
);

export default Footer;