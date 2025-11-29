import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, total, itemCount, isOpen, closeCart } = useCart();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Cart Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-myn-cream">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="text-myn-primary" size={24} />
                        <div>
                            <h2 className="text-xl font-bold text-myn-dark">Tu Carrito</h2>
                            <p className="text-sm text-gray-600">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag size={64} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-600 mb-2">Tu carrito está vacío</h3>
                            <p className="text-sm text-gray-500 mb-6">Agrega productos para comenzar</p>
                            <Link
                                to="/shop"
                                onClick={closeCart}
                                className="px-6 py-3 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors font-medium"
                            >
                                Ir a la Tienda
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-myn-dark mb-1 truncate">{product.name}</h3>
                                            <p className="text-xs text-myn-primary mb-2">{product.origin}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-myn-dark">
                                                    ${(product.price * quantity).toLocaleString('es-CL')}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(product.id)}
                                            className="self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-myn-cream">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold text-myn-dark">${total.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Envío</span>
                                <span>Calculado en checkout</span>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            onClick={closeCart}
                            className="w-full py-4 bg-myn-dark text-white rounded-lg hover:bg-myn-primary transition-colors font-bold uppercase tracking-wider shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Proceder al Pago
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
