import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Lock } from 'lucide-react';
import { createFlowPayment, generateCommerceOrder } from '../services/flowPayment';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';

const CheckoutView: React.FC = () => {
    const { items, total, clearCart } = useCart();
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [shippingData, setShippingData] = useState({
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        region: '',
        zipCode: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        if (items.length === 0) {
            navigate('/shop');
        }
    }, [user, items, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingData({
            ...shippingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const commerceOrder = generateCommerceOrder();

            // Create order in database
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user?.id,
                    commerce_order: commerceOrder,
                    total,
                    status: 'pending',
                    shipping_address: shippingData,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.product.id,
                product_name: item.product.name,
                product_image: item.product.image_url,
                quantity: item.quantity,
                unit_price: item.product.price,
                subtotal: item.product.price * item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Create Flow payment
            const baseUrl = window.location.origin + import.meta.env.BASE_URL;
            const flowResponse = await createFlowPayment({
                commerceOrder,
                subject: `Orden MYN Coffee #${commerceOrder}`,
                currency: 'CLP',
                amount: Math.round(total),
                email: shippingData.email,
                urlConfirmation: `${baseUrl}payment/confirmation`,
                urlReturn: `${baseUrl}payment/return`,
                optional: JSON.stringify({ orderId: orderData.id }),
            });

            // Update order with Flow token
            await supabase
                .from('orders')
                .update({ flow_token: flowResponse.token })
                .eq('id', orderData.id);

            // Clear cart
            clearCart();

            // Redirect to Flow payment page
            window.location.href = flowResponse.url + '?token=' + flowResponse.token;

        } catch (error: any) {
            console.error('Checkout error:', error);
            showToast(`❌ Error al procesar el pago: ${error.message}`);
            setLoading(false);
        }
    };

    const SHIPPING_COST = 3000; // CLP
    const finalTotal = total + SHIPPING_COST;

    return (
        <div className="min-h-screen bg-myn-cream pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/shop')}
                    className="flex items-center gap-2 text-myn-dark hover:text-myn-primary mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver a la tienda
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Shipping Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Truck className="text-myn-primary" size={28} />
                                <h2 className="text-2xl font-bold text-myn-dark">Información de Envío</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Región
                                        </label>
                                        <input
                                            type="text"
                                            name="region"
                                            value={shippingData.region}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingData.zipCode}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-myn-dark text-white rounded-lg hover:bg-myn-primary transition-colors font-bold uppercase tracking-wider shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            'Procesando...'
                                        ) : (
                                            <>
                                                <CreditCard size={20} />
                                                Proceder al Pago - ${finalTotal.toLocaleString('es-CL')}
                                            </>
                                        )}
                                    </button>
                                    <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
                                        <Lock size={14} />
                                        Pago seguro con Flow
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <ShoppingBag className="text-myn-primary" size={24} />
                                <h3 className="text-xl font-bold text-myn-dark">Resumen del Pedido</h3>
                            </div>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                                {items.map(({ product, quantity }) => (
                                    <div key={product.id} className="flex gap-4 pb-4 border-b border-gray-100">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm mb-1">{product.name}</h4>
                                            <p className="text-xs text-gray-500">Cantidad: {quantity}</p>
                                            <p className="text-sm font-bold text-myn-primary mt-1">
                                                ${(product.price * quantity).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">${total.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Envío</span>
                                    <span className="font-bold">${SHIPPING_COST.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200">
                                    <span className="text-lg font-bold text-myn-dark">Total</span>
                                    <span className="text-2xl font-bold text-myn-primary">
                                        ${finalTotal.toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutView;
