
import React from 'react';
import { ViewState, Product } from '../types';
import { PRODUCTS } from '../constants';
import CoffeeQuiz from '../components/CoffeeQuiz';
import { Star, ArrowRight, ShoppingCart } from 'lucide-react';

interface HomeViewProps {
    setView: (view: ViewState) => void;
    addToCart: (product: Product) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setView, addToCart }) => {
    const featuredProducts = PRODUCTS.slice(0, 3);

    return (
        <div className="pb-10 md:pb-20 animate-fade-in">
            {/* Hero Section Natural */}
            <div className="relative min-h-[85vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-myn-dark py-20 md:py-0">
                
                {/* Background Image - Absolute Positioning */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://i.imgur.com/1oKaPmJ.png" 
                        className="w-full h-full object-cover opacity-80" 
                        alt="Myn Coffee Roasters Banner" 
                    />
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-myn-dark/95"></div>
                </div>

                {/* Content - Relative Positioning to sit on top */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col justify-center h-full">
                    <div className="animate-fade-in-up">
                        <p className="text-myn-light tracking-[0.3em] uppercase text-[10px] md:text-sm font-bold mb-4 md:mb-6 flex items-center justify-center gap-3">
                            <span className="w-6 md:w-8 h-[1px] bg-myn-light"></span>
                            Somos MyN Coffee Roasters
                            <span className="w-6 md:w-8 h-[1px] bg-myn-light"></span>
                        </p>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-2xl">
                            Tostaduría <br /><span className="text-myn-light italic font-light">Artesanal</span>
                        </h1>
                        <p className="text-base md:text-xl text-gray-100 font-light mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md px-4">
                            Preparado por personas, para personas como Tú. <br className="hidden md:block" />
                            Ofrecemos café de especialidad de origen.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
                            <button 
                                onClick={() => setView('shop')} 
                                className="w-full sm:w-auto px-10 py-4 bg-myn-primary hover:bg-myn-dark text-white text-sm uppercase tracking-widest font-bold transition-all border border-transparent hover:border-myn-light rounded-sm shadow-2xl transform hover:-translate-y-0.5"
                            >
                                Ver Catálogo
                            </button>
                            <button 
                                className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/30 hover:bg-white/10 text-white text-sm uppercase tracking-widest font-bold transition-all backdrop-blur-sm rounded-sm"
                            >
                                Conócenos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values / Iconos */}
            <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto bg-texture relative z-20 bg-myn-cream">
                <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-myn-light">
                    <div className="p-6 group">
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🌱</div>
                        <h3 className="font-serif text-xl font-bold text-myn-dark mb-2">Origen Responsable</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Trabajamos directamente con fincas que respetan la tierra y sus ciclos naturales.</p>
                    </div>
                    <div className="p-6 group">
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🔥</div>
                        <h3 className="font-serif text-xl font-bold text-myn-dark mb-2">Tueste Fresco</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Tostamos en pequeños lotes para resaltar las notas únicas de cada cosecha.</p>
                    </div>
                    <div className="p-6 group">
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">☕</div>
                        <h3 className="font-serif text-xl font-bold text-myn-dark mb-2">Para personas como Tú</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Café de especialidad accesible, preparado con dedicación humana.</p>
                    </div>
                </div>
            </section>

            {/* Best Coffees of the Week Section */}
            <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto border-t border-myn-light/50">
                <div className="text-center mb-10 md:mb-12">
                    <span className="text-myn-primary font-bold tracking-widest uppercase text-[10px] md:text-xs">Selección MyN</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-myn-dark mt-2">Favoritos de la Semana</h2>
                    <div className="w-16 h-0.5 bg-myn-primary mx-auto mt-4 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                             {/* Image */}
                            <div className="h-64 md:h-72 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-myn-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-myn-light">
                                    <Star size={10} fill="currentColor" /> Destacado
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-5 md:p-6 flex-1 flex flex-col">
                                <div className="text-xs text-myn-primary font-bold uppercase tracking-wider mb-2">{product.origin}</div>
                                <h3 className="text-xl font-serif font-bold text-myn-dark mb-3 group-hover:text-myn-primary transition-colors">{product.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-medium bg-myn-sand/50 px-2 py-1 rounded-md text-gray-600 border border-transparent group-hover:border-myn-light transition-colors">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                    <span className="font-serif text-lg font-bold text-myn-dark">${product.price.toLocaleString('es-CL')}</span>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-10 h-10 rounded-full bg-myn-sand/50 flex items-center justify-center text-myn-dark hover:bg-myn-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                        title="Añadir al carrito"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-10 md:mt-12">
                    <button 
                        onClick={() => setView('shop')} 
                        className="inline-flex items-center gap-2 text-myn-dark text-sm font-bold border-b-2 border-myn-primary pb-1 hover:text-myn-primary transition-colors uppercase tracking-wider"
                    >
                        Ver todos los cafés <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* Quiz Section Wrapper */}
            <section className="bg-myn-sand/30 py-10 px-4 border-t border-myn-light">
                <CoffeeQuiz addToCart={addToCart} />
            </section>
        </div>
    );
};

export default HomeView;
