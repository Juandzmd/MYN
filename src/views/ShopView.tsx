import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../supabaseClient';
import { Leaf, ShoppingCart } from 'lucide-react';

interface ShopViewProps {
    addToCart: (product: Product) => void;
}

const ShopView: React.FC<ShopViewProps> = ({ addToCart }) => {
    const [filter, setFilter] = useState('todos');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.error('Error fetching products:', error);
            } else if (data) {
                setProducts(data as Product[]);
            }
        };

        fetchProducts();
    }, []);

    const displayedProducts = filter === 'todos'
        ? products
        : products.filter(p => p.origin === filter);

    const origins: string[] = ['todos', ...Array.from(new Set<string>(products.map(p => p.origin).filter(o => o !== "Mix Orígenes")))];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in bg-texture min-h-screen">
            <div className="text-center mb-16">
                <span className="text-myn-primary font-bold tracking-widest uppercase text-xs">Nuestra Selección</span>
                <h2 className="text-4xl md:text-5xl font-serif text-myn-dark mt-2 mb-4">Cosecha Fresca</h2>
                <div className="w-24 h-1 bg-myn-primary mx-auto rounded-full"></div>
            </div>

            {/* Filters */}
            <div className="flex justify-center flex-wrap gap-3 mb-12">
                {origins.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${filter === f
                                ? 'bg-myn-dark text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-myn-primary hover:text-myn-primary'}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayedProducts.map(product => (
                    <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
                        <div className="relative h-72 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                            <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                {product.tags.map(tag => (
                                    <span key={tag} className="inline-block bg-white/90 backdrop-blur-sm text-myn-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-myn-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Leaf size={12} /> {product.origin}
                                </span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-myn-dark mb-4 group-hover:text-myn-primary transition-colors">
                                {product.name}
                            </h3>

                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xl font-serif font-medium text-myn-dark">
                                    ${product.price.toLocaleString('es-CL')}
                                </span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-12 h-12 rounded-full bg-myn-sand flex items-center justify-center text-myn-dark hover:bg-myn-dark hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm"
                                    aria-label="Agregar al carrito"
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopView;