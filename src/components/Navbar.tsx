import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    const { itemCount, openCart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/shop', label: 'Tienda' },
        { path: '/subscription', label: 'Suscripción' },
        { path: '/wholesale', label: 'Mayorista' },
        { path: '/guides', label: 'Guías' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-myn-cream/95 shadow-md py-3' : 'bg-myn-cream py-4 md:py-5'} ${scrolled && !isOpen ? 'backdrop-blur-md' : ''}`}>
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-myn-dark z-50 relative">
                    MYN<span className="text-myn-primary">.</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-myn-primary ${isActive(link.path) ? 'text-myn-primary' : 'text-myn-dark/80'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l border-myn-dark/10">
                        <Link to={user ? "/dashboard" : "/login"} className="text-myn-dark hover:text-myn-primary transition-colors relative group">
                            <User size={20} />
                            {user && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>}
                        </Link>
                        <button
                            onClick={openCart}
                            className="relative p-2 hover:bg-myn-sand/30 rounded-lg transition-colors"
                        >
                            <ShoppingBag size={22} className="text-myn-dark" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-myn-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 text-myn-dark p-1 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-myn-cream/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                    <div className="flex flex-col items-center gap-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-2xl font-serif font-bold text-myn-dark hover:text-myn-primary transition-all transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex gap-6 mt-4">
                            <Link to={user ? "/dashboard" : "/login"} onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-2 text-myn-dark">
                                <User size={24} />
                                <span className="text-xs uppercase tracking-widest">{user ? 'Mi Cuenta' : 'Login'}</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    openCart();
                                }}
                                className="flex flex-col items-center gap-2 text-myn-dark cursor-pointer"
                            >
                                <div className="relative">
                                    <ShoppingBag size={24} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-myn-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {itemCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs uppercase tracking-widest">Carrito</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;