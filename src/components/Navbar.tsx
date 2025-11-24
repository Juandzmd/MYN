import React, { useState, useEffect } from 'react';
import { ViewState, NavLink } from '../types';
import { Leaf, ShoppingCart, Menu, X } from 'lucide-react';

interface NavbarProps {
    setView: (view: ViewState) => void;
    cartCount: number;
    currentView: ViewState;
}

const navLinks: NavLink[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'shop', label: 'Tienda' },
    { id: 'subscription', label: 'Suscripción' },
    { id: 'wholesale', label: 'Mayorista' },
    { id: 'guides', label: 'Guías' },
];

const Navbar: React.FC<NavbarProps> = ({ setView, cartCount, currentView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isOpen ? 'bg-myn-cream py-3' : (scrolled ? 'bg-myn-cream/95 shadow-md py-3 backdrop-blur-md' : 'bg-myn-cream py-4 md:py-5')}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer gap-2 group z-50" onClick={() => { setView('home'); setIsOpen(false); }}>
                        <div className="text-myn-primary transform transition-transform group-hover:scale-110">
                            <Leaf size={24} className="md:w-6 md:h-6 w-5 h-5" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl md:text-2xl font-serif font-bold text-myn-dark tracking-wide">MYN</span>
                            <span className="text-[8px] md:text-[10px] font-medium text-myn-primary uppercase tracking-[0.3em]">Coffee</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map(link => (
                            <button
                                key={link.id}
                                onClick={() => setView(link.id)}
                                className={`text-sm uppercase tracking-wider transition-all hover:text-myn-primary relative py-1
                                ${currentView === link.id ? 'text-myn-dark font-bold' : 'text-gray-500'}`}
                            >
                                {link.label}
                                {currentView === link.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-myn-primary animate-fade-in"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-3 md:space-x-4 z-50">
                        <button className="relative p-2 text-myn-dark hover:text-myn-primary transition-colors group">
                            <ShoppingCart size={24} className="md:w-6 md:h-6 w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-myn-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button className="md:hidden p-2 text-myn-dark hover:text-myn-primary transition-colors focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-myn-cream z-40 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="space-y-6 text-center">
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => { setView(link.id); setIsOpen(false); }}
                            className={`block text-2xl font-serif font-bold transition-colors
                            ${currentView === link.id ? 'text-myn-primary' : 'text-myn-dark hover:text-myn-primary'}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
                
                <div className="absolute bottom-10 text-center">
                     <p className="text-myn-primary text-xs font-bold uppercase tracking-widest">Myn Coffee Roasters</p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;