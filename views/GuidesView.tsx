import React, { useState } from 'react';
import { GUIDES } from '../constants';
import { Guide } from '../types';
import { ChevronRight, X, ZoomIn } from 'lucide-react';

const GuidesView: React.FC = () => {
    const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in bg-texture min-h-screen">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-myn-dark mb-4">Maestría en Preparación</h2>
                <p className="text-gray-500">El café es solo el comienzo. Haz click en una guía para ver el instructivo.</p>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
                {GUIDES.map(guide => (
                    <div 
                        key={guide.id} 
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer transform hover:-translate-y-1"
                        onClick={() => setSelectedGuide(guide)}
                    >
                        <div className="flex flex-col md:flex-row h-full">
                            <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                                <img 
                                    src={guide.image} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt={guide.title}
                                />
                                <div className="absolute inset-0 bg-myn-dark/20 group-hover:bg-transparent transition-colors"></div>
                                {/* Overlay Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/90 p-3 rounded-full text-myn-dark shadow-lg">
                                        <ZoomIn size={24} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
                                <h3 className="text-2xl font-serif font-bold text-myn-dark mb-2">{guide.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">Descubre el método paso a paso para lograr la taza perfecta.</p>
                                <div className="flex items-center text-myn-primary font-bold text-sm uppercase tracking-wider group-hover:underline decoration-myn-light underline-offset-4">
                                    Ver Instructivo <ChevronRight size={16} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-myn-dark/90 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedGuide(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto flex flex-col animate-fade-in-up">
                        <button 
                            onClick={() => setSelectedGuide(null)}
                            className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white text-myn-dark p-2 rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        {selectedGuide.instructionalImage ? (
                            <div className="bg-myn-cream">
                                <img 
                                    src={selectedGuide.instructionalImage} 
                                    alt={`Guía para ${selectedGuide.title}`} 
                                    className="w-full h-auto"
                                />
                            </div>
                        ) : (
                            // Fallback layout if no instructional image exists yet
                            <div className="p-10 md:p-16 text-center bg-myn-cream">
                                <h3 className="text-3xl font-serif text-myn-dark mb-8 border-b border-myn-light pb-4 inline-block">{selectedGuide.title}</h3>
                                <div className="grid gap-6 text-left max-w-lg mx-auto">
                                    {selectedGuide.steps.map((step, index) => (
                                        <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-myn-dark text-white flex items-center justify-center font-bold font-serif">
                                                {index + 1}
                                            </span>
                                            <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-10 text-xs text-gray-400 uppercase tracking-widest">Imagen instructiva próximamente</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuidesView;