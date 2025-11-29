import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { getFlowPaymentStatus } from '../services/flowPayment';

const PaymentReturnView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
    const [paymentData, setPaymentData] = useState<any>(null);

    useEffect(() => {
        const checkPayment = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                return;
            }

            try {
                const paymentStatus = await getFlowPaymentStatus(token);
                setPaymentData(paymentStatus);

                // Flow payment statuses:
                // 1 = Pendiente de Pago
                // 2 = Pagado
                // 3 = Rechazado
                // 4 = Anulado

                if (paymentStatus.status === 2) {
                    setStatus('success');
                } else if (paymentStatus.status === 1) {
                    setStatus('pending');
                } else {
                    setStatus('error');
                }
            } catch (error: any) {
                console.error('Error checking payment:', error);
                setStatus('error');
            }
        };

        checkPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-myn-cream flex items-center justify-center px-4 pt-20">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                <div className="text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 size={80} className="mx-auto text-myn-primary animate-spin mb-6" />
                            <h1 className="text-3xl font-bold text-myn-dark mb-4">Verificando pago...</h1>
                            <p className="text-gray-600 text-lg">Por favor espera un momento</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
                            <h1 className="text-3xl font-bold text-myn-dark mb-4">¡Pago Exitoso!</h1>
                            <p className="text-gray-600 text-lg mb-3">
                                Tu pago ha sido procesado correctamente
                            </p>
                            {paymentData && (
                                <div className="bg-myn-sand/30 rounded-xl p-6 mb-8">
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Orden</p>
                                            <p className="font-bold text-myn-dark">{paymentData.commerceOrder}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Monto</p>
                                            <p className="font-bold text-myn-primary">
                                                ${parseInt(paymentData.amount).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500 mb-1">Flow Order</p>
                                            <p className="font-mono text-sm text-gray-700">{paymentData.flowOrder}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-8 py-3 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors font-bold"
                                >
                                    Ver Mis Pedidos
                                </button>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="px-8 py-3 bg-white border-2 border-myn-dark text-myn-dark rounded-lg hover:bg-myn-sand/30 transition-colors font-bold"
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </>
                    )}

                    {status === 'pending' && (
                        <>
                            <Clock size={80} className="mx-auto text-yellow-500 mb-6" />
                            <h1 className="text-3xl font-bold text-myn-dark mb-4">Pago Pendiente</h1>
                            <p className="text-gray-600 text-lg mb-8">
                                Tu pago está siendo procesado. Te notificaremos cuando se complete.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-3 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors font-bold"
                            >
                                Ir al Dashboard
                            </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle size={80} className="mx-auto text-red-500 mb-6" />
                            <h1 className="text-3xl font-bold text-myn-dark mb-4">Pago No Completado</h1>
                            <p className="text-gray-600 text-lg mb-8">
                                Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="px-8 py-3 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors font-bold"
                                >
                                    Volver a Intentar
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentReturnView;
