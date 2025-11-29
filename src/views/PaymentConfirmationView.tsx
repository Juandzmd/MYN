import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getFlowPaymentStatus } from '../services/flowPayment';
import { supabase } from '../supabaseClient';

const PaymentConfirmationView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const processPayment = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token de pago no encontrado');
                return;
            }

            try {
                // Get payment status from Flow
                const paymentStatus = await getFlowPaymentStatus(token);

                // Update order in database
                const { error } = await supabase
                    .from('orders')
                    .update({
                        status: paymentStatus.status === 2 ? 'paid' : 'failed',
                        flow_order: paymentStatus.flowOrder,
                        payment_data: paymentStatus,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('commerce_order', paymentStatus.commerceOrder);

                if (error) throw error;

                if (paymentStatus.status === 2) {
                    setStatus('success');
                    setMessage('Pago procesado correctamente');
                } else {
                    setStatus('error');
                    setMessage('El pago no pudo ser procesado');
                }
            } catch (error: any) {
                console.error('Error processing payment confirmation:', error);
                setStatus('error');
                setMessage(error.message || 'Error al procesar la confirmación');
            }
        };

        processPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-myn-cream flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 size={64} className="mx-auto text-myn-primary animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-myn-dark mb-2">Procesando pago...</h2>
                        <p className="text-gray-600">Por favor espera mientras confirmamos tu transacción</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-myn-dark mb-2">¡Pago Exitoso!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors font-bold"
                        >
                            Ver Mis Pedidos
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-myn-dark mb-2">Error en el Pago</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-3 bg-myn-dark text-white rounded-lg hover:bg-myn-primary transition-colors font-bold"
                        >
                            Volver a la Tienda
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentConfirmationView;
