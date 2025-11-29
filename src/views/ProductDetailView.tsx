import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Star, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ProductDetailViewProps {
    addToCart: (product: Product) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ addToCart }) => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setProduct(data as Product);
                    setSelectedImage(data.image_url);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                showToast('❌ Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-myn-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myn-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-myn-cream flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-serif font-bold text-myn-dark mb-4">Producto no encontrado</h2>
                <Link to="/shop" className="px-6 py-2 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors">
                    Volver a la Tienda
                </Link>
            </div>
        );
    }

    const allImages = [product.image_url, ...(product.media_urls || [])].filter(Boolean);

    return (
        <div className="min-h-screen bg-myn-cream pt-24 pb-12 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <Link to="/shop" className="inline-flex items-center gap-2 text-myn-dark hover:text-myn-primary transition-colors mb-8 font-medium">
                    <ArrowLeft size={20} /> Volver a la Tienda
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Gallery */}
                        <div className="p-6 md:p-10 bg-gray-50">
                            <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm bg-white">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImage === img ? 'border-myn-primary ring-2 ring-myn-primary/20' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-6 md:p-10 flex flex-col">
                            <div className="mb-6">
                                <span className="text-myn-primary font-bold tracking-widest uppercase text-xs mb-2 block">
                                    {product.origin}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-myn-dark mb-4">
                                    {product.name}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(product.tags || []).map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-myn-sand/50 text-myn-dark text-xs font-bold uppercase tracking-wider rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                    {product.description || 'Una experiencia única en cada taza. Este café ha sido seleccionado cuidadosamente para ofrecerte los mejores sabores de su origen.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <Leaf className="text-myn-primary" size={24} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Tostado</p>
                                        <p className="font-medium text-myn-dark">Medio-Alto</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <Star className="text-myn-primary" size={24} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Calidad</p>
                                        <p className="font-medium text-myn-dark">Especialidad</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-gray-100">
                                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Precio</p>
                                        <span className="text-3xl font-serif font-bold text-myn-dark">
                                            ${product.price.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            showToast('✅ Agregado al carrito');
                                        }}
                                        className="w-full md:w-auto px-8 py-4 bg-myn-primary text-white rounded-xl font-bold hover:bg-myn-dark transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:-translate-y-1"
                                    >
                                        <ShoppingCart size={24} />
                                        Agregar al Carrito
                                    </button>
                                </div>

                                <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 justify-center md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} /> Envío a todo Chile
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} /> Compra Segura
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailView;
