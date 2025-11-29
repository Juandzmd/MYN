import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import SubscriptionView from './views/SubscriptionView';
import GuidesView from './views/GuidesView';
import ProductDetailView from './views/ProductDetailView';
import WholesaleView from './views/WholesaleView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';
import UserDashboardView from './views/UserDashboardView';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Product } from './types';
import { supabase } from './supabaseClient';
import { useToast } from './context/ToastContext';

// Wrapper to handle location-based logic (like tracking visits)
const AppContent: React.FC = () => {
    const [cart, setCart] = useState<Product[]>([]);
    const { showToast } = useToast();
    const location = useLocation();

    useEffect(() => {
        // Track visit on route change
        const trackVisit = async () => {
            try {
                await supabase.from('site_visits').insert([{ page: location.pathname }]);
            } catch (e) {
                console.error('Error tracking visit:', e);
            }
        };
        trackVisit();
    }, [location]);

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
        showToast(`🌿 ${product.name} añadido al carrito`);
    };

    // Helper to determine if we should show nav/footer
    const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen flex flex-col font-sans text-myn-dark bg-myn-cream">
            {!isDashboard && (
                <Navbar cartCount={cart.length} />
            )}

            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomeView addToCart={addToCart} />} />
                    <Route path="/shop" element={<ShopView addToCart={addToCart} />} />
                    <Route path="/product/:id" element={<ProductDetailView addToCart={addToCart} />} />
                    <Route path="/subscription" element={<SubscriptionView />} />
                    <Route path="/wholesale" element={<WholesaleView />} />
                    <Route path="/guides" element={<GuidesView />} />
                    <Route path="/login" element={<LoginView />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboardView />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute requireAdmin={true} />}>
                        <Route path="/admin" element={<AdminView />} />
                    </Route>
                </Routes>
            </main>

            {!isDashboard && (
                <Footer />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router basename="/MYN">
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;