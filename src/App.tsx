import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import SubscriptionView from './views/SubscriptionView';
import GuidesView from './views/GuidesView';
import WholesaleView from './views/WholesaleView';
import { ViewState, Product } from './types';

import { useToast } from './context/ToastContext';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>('home');
    const [cart, setCart] = useState<Product[]>([]);
    const { showToast } = useToast();

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
        showToast(`🌿 ${product.name} añadido al carrito`);
    };

    const renderView = () => {
        switch (currentView) {
            case 'home': return <HomeView setView={setCurrentView} addToCart={addToCart} />;
            case 'shop': return <ShopView addToCart={addToCart} />;
            case 'subscription': return <SubscriptionView />;
            case 'wholesale': return <WholesaleView />;
            case 'guides': return <GuidesView />;
            default: return <HomeView setView={setCurrentView} addToCart={addToCart} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-myn-dark bg-myn-cream">
            <Navbar setView={setCurrentView} cartCount={cart.length} currentView={currentView} />

            <main className="flex-grow">
                {/* We key the view to force re-animation on route change if desired, 
                    or remove key to keep state if views were components holding state */}
                {renderView()}
            </main>

            <Footer setView={setCurrentView} />
        </div>
    );
};

export default App;