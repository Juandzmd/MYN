import React, { useState, useEffect } from 'react';
import { Product, QuizAnswers } from '../types';
import { supabase } from '../supabaseClient';
import { QUIZ_STEPS } from '../constants';
import { Leaf, ArrowRight, Check, RefreshCw } from 'lucide-react';

interface CoffeeQuizProps {
    addToCart: (product: Product) => void;
}

const CoffeeQuiz: React.FC<CoffeeQuizProps> = ({ addToCart }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.error('Error fetching products for quiz:', error);
            } else if (data) {
                setProducts(data as Product[]);
            }
        };

        fetchProducts();
    }, []);

    const handleAnswer = (key: keyof QuizAnswers, value: string) => {
        setAnswers({ ...answers, [key]: value });
        setStep(step + 1);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
    };

    const getRecommendation = (): Product | null => {
        if (products.length === 0) return null;

        const kenya = products.find(p => p.name.toLowerCase().includes('kenya'));
        const peru = products.find(p => p.name.toLowerCase().includes('perú') || p.name.toLowerCase().includes('peru'));

        if (answers.roast === 'claro') return kenya || products[0];
        if (answers.roast === 'intenso') return peru || products[0];
        return peru || products[0]; // Default/Medium
    };

    const currentStepData = QUIZ_STEPS[step];
    const isComplete = step >= QUIZ_STEPS.length;
    const recommendedProduct = isComplete ? getRecommendation() : null;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-myn-light my-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-myn-dark to-myn-primary"></div>

            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-myn-primary font-bold tracking-widest uppercase text-xs mb-2 bg-myn-light px-3 py-1 rounded-full">
                    <Leaf size={12} /> Asesor Virtual
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-myn-dark mt-2">Descubre tu origen ideal</h2>
                <p className="text-gray-500 mt-3 max-w-md mx-auto">Responde 3 simples preguntas y nuestros baristas digitales te guiarán.</p>
            </div>

            {!isComplete ? (
                <div className="animate-fade-in">
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                            <span>Inicio</span>
                            <span>Paso {step + 1} de 3</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-myn-primary transition-all duration-500 ease-out"
                                style={{ width: `${((step + 1) / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-serif text-myn-dark mb-6 text-center">{currentStepData.question}</h3>

                    <div className="grid gap-4">
                        {currentStepData.options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleAnswer(currentStepData.key, opt.value)}
                                className="flex items-center justify-between p-5 border-2 border-transparent bg-myn-sand/30 rounded-xl hover:border-myn-primary hover:bg-white transition-all text-left group shadow-sm hover:shadow-md"
                            >
                                <div>
                                    <div className="font-bold text-lg text-myn-dark group-hover:text-myn-primary mb-1">{opt.label}</div>
                                    <div className="text-sm text-gray-500">{opt.desc}</div>
                                </div>
                                <div className="text-gray-300 group-hover:text-myn-primary transition-colors">
                                    <ArrowRight size={20} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center animate-fade-in">
                    <div className="inline-flex p-4 bg-myn-light rounded-full text-myn-primary mb-6 shadow-inner">
                        <Check size={32} />
                    </div>
                    <h3 className="text-3xl font-serif text-myn-dark mb-2">Tu Match Perfecto</h3>
                    <p className="text-gray-600 mb-8">Basado en tu perfil {answers.roast} para {answers.method}.</p>

                    {recommendedProduct && (
                        <div className="bg-myn-cream p-8 rounded-xl border border-myn-light mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                            <div className="relative group">
                                <img
                                    src={recommendedProduct.image}
                                    alt={recommendedProduct.name}
                                    className="w-48 h-48 object-cover rounded-lg shadow-lg transform rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-105"
                                />
                                <div className="absolute -bottom-3 -right-3 bg-myn-dark text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Recomendado
                                </div>
                            </div>
                            <div className="text-left flex-1">
                                <h4 className="text-2xl font-serif font-bold text-myn-dark mb-1">{recommendedProduct.name}</h4>
                                <p className="text-sm text-myn-primary font-bold mb-4 uppercase tracking-wide flex items-center gap-1">
                                    <Leaf size={14} /> {recommendedProduct.origin}
                                </p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Este grano ha sido seleccionado por sus notas que complementan perfectamente tu gusto por los sabores <strong>{answers.roast}s</strong>.
                                    Ideal para molienda {answers.format}.
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-serif font-bold text-myn-dark">
                                        ${recommendedProduct.price.toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {recommendedProduct && (
                            <button
                                onClick={() => addToCart(recommendedProduct)}
                                className="px-10 py-4 bg-myn-dark text-white rounded-lg hover:bg-myn-primary transition-colors font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Añadir al Carrito
                            </button>
                        )}
                        <button
                            onClick={resetQuiz}
                            className="px-10 py-4 text-gray-500 hover:text-myn-dark font-medium underline decoration-myn-light underline-offset-4 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} /> Volver a intentar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoffeeQuiz;