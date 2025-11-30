import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import SubscriptionView from './views/SubscriptionView';
import GuidesView from './views/GuidesView';
import ProductDetailView from './views/ProductDetailView';
import WholesaleView from './views/WholesaleView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';
import UserDashboardView from './views/UserDashboardView';
import CheckoutView from './views/CheckoutView';
import PaymentConfirmationView from './views/PaymentConfirmationView';
import PaymentReturnView from './views/PaymentReturnView';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

// Wrapper to handle location-based logic (like tracking visits)
const AppContent: React.FC = () => {
    const { addToCart } = useCart();
    const location = useLocation();

    // Helper to determine if we should show nav/footer
    const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen flex flex-col font-sans text-myn-dark bg-myn-cream">
            {!isDashboard && (
                <Navbar />
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

                    {/* Payment Routes */}
                    <Route path="/payment/confirmation" element={<PaymentConfirmationView />} />
                    <Route path="/payment/return" element={<PaymentReturnView />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboardView />} />
                        <Route path="/checkout" element={<CheckoutView />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute requireAdmin={true} />}>
                        <Route path="/admin" element={<AdminView />} />
                    </Route>
                </Routes>
            </main>

            <Cart />

            {!isDashboard && (
                <Footer />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;