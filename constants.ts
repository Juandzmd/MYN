
import { Product, Guide, QuizStep } from './types';

export const PRODUCTS: Product[] = [
    { 
        id: 1, 
        name: "Kenya Nyeri Signature", 
        origin: "Kenya", 
        price: 13500, 
        tags: ["Caramelo", "Cítrico", "Floral", "Almendra", "Mantequilla"], 
        image: "https://i.imgur.com/VVTaFLS.png" 
    },
    { 
        id: 2, 
        name: "Perú Valle Chanchamayo", 
        origin: "Perú", 
        price: 12000, 
        tags: ["Chocolate", "Frutal", "Acidez Baja", "Cuerpo Robusto"], 
        image: "https://i.imgur.com/gVtp3er.png" 
    },
    { 
        id: 3, 
        name: "Drip Coffee Individual (15g)", 
        origin: "Mix Orígenes", 
        price: 1500, 
        tags: ["10-15g", "Portátil", "Filtro Incorporado"], 
        image: "https://i.imgur.com/PzFsgYY.png" 
    },
    { 
        id: 4, 
        name: "Pack Degustación MyN", 
        origin: "Kenya & Perú", 
        price: 24500, 
        tags: ["Variedad", "Regalo Ideal"], 
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80" 
    }
];

export const GUIDES: Guide[] = [
    { 
        id: 'v60', 
        title: 'V60 / Filtrado', 
        image: 'https://i.imgur.com/cZUZtem.png', 
        instructionalImage: 'https://i.imgur.com/pfIXm2S.png',
        steps: ['Ratio 1:15 (1g café por 15ml agua)', 'Agua a 92°C', 'Pre-infusión de 30s para liberar CO2', 'Verter en espiral lento y constante'] 
    },
    { 
        id: 'french', 
        title: 'Prensa Francesa', 
        image: 'https://i.imgur.com/MPu3Ey2.png', 
        instructionalImage: 'https://i.imgur.com/AnuKZRt.png',
        steps: ['Molienda gruesa (como sal de mar)', 'Ratio 1:12 para cuerpo intenso', '4 minutos de inmersión total', 'Romper la costra con cuchara antes de bajar el émbolo'] 
    },
    { 
        id: 'espresso', 
        title: 'Espresso', 
        image: 'https://i.imgur.com/Rlbkx7A.png', 
        instructionalImage: 'https://i.imgur.com/uHjzogP.png',
        steps: ['18g - 20g de café en portafiltro doble', 'Molienda muy fina', '25 a 30 segundos de extracción', 'Buscamos textura cremosa y atigrada'] 
    }
];

export const QUIZ_STEPS: QuizStep[] = [
    {
        question: "¿Qué perfil de tueste prefieres?",
        key: 'roast',
        options: [
            { label: "Claro & Frutal", value: "claro", desc: "Acidez brillante, notas cítricas y florales." },
            { label: "Medio & Dulce", value: "medio", desc: "Balanceado, caramelo, frutos secos." },
            { label: "Intenso & Fuerte", value: "intenso", desc: "Cuerpo pesado, chocolate oscuro, especias." }
        ]
    },
    {
        question: "¿Prefieres grano o molido?",
        key: 'format',
        options: [
            { label: "Grano Entero", value: "grano", desc: "Para conservar toda la frescura." },
            { label: "Molido", value: "molido", desc: "Listo para tu cafetera." }
        ]
    },
    {
        question: "¿Cuál es tu ritual de preparación?",
        key: 'method',
        options: [
            { label: "Espresso / Moka", value: "espresso", desc: "Intenso y corto." },
            { label: "Filtrado / V60", value: "filtrado", desc: "Suave, limpio y aromático." },
            { label: "Prensa Francesa", value: "prensa", desc: "Con cuerpo, textura y aceites." }
        ]
    }
];
