import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Contexts & Services
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, Order } from './types';
import { getProductsFromDB, subscribeToProducts, cleanupOldMockProducts } from './services/productService';
import { subscribeToAllOrders } from './services/orderService';
import { testFirestoreConnection } from './firebase/config';

function MainApp() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Catalog & Orders
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Initialize and verify connection & products catalog
  useEffect(() => {
    testFirestoreConnection();

    // Subscribe to live products
    const unsubscribeProducts = subscribeToProducts((updated) => {
      setProducts(updated);
      setLoadingProducts(false);
    });

    // Handle hash routing support e.g. #admin, #shop, #about
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash.startsWith('admin')) {
        setCurrentPage('admin');
      } else if (hash.startsWith('track')) {
        setCurrentPage('tracking');
      } else if (hash === 'about') {
        setCurrentPage('about');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'cart') {
        setCurrentPage('cart');
      } else if (hash === 'shop') {
        setCurrentPage('shop');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    return () => {
      unsubscribeProducts();
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // ONLY subscribe to orders if authenticated as authorized admin
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      return;
    }

    // Clean up any old mock products from Firestore
    cleanupOldMockProducts();

    const unsubscribeOrders = subscribeToAllOrders(
      (allOrders) => {
        setOrders(allOrders);
      },
      (err) => {
        console.warn('Orders listener notice:', err);
      }
    );

    return () => {
      unsubscribeOrders();
    };
  }, [isAdmin]);

  const handleNavigate = (page: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'product-detail' && params?.product) {
      setSelectedProduct(params.product);
      setCurrentPage('product-detail');
      return;
    }
    if (page === 'tracking' && params?.orderNumber) {
      setTrackingOrderNumber(params.orderNumber);
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromConfirmation = (orderNum: string) => {
    setTrackingOrderNumber(orderNum);
    setCurrentPage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1918]">
      
      {/* Top Announcement Bar (visible across customer pages) */}
      {currentPage !== 'admin' && <AnnouncementBar />}

      {/* Main Navbar */}
      {currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* Home */}
        {currentPage === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {/* Shop All */}
        {currentPage === 'shop' && (
          <ShopPage
            products={products}
            selectedCategory="all"
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => handleNavigate(cat === 'all' ? 'shop' : `category-${cat}`)}
          />
        )}

        {/* Category: Oversized T-Shirts */}
        {currentPage === 'category-oversized' && (
          <ShopPage
            products={products}
            selectedCategory="oversized-t-shirts"
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => handleNavigate(cat === 'all' ? 'shop' : `category-${cat}`)}
          />
        )}

        {/* Category: Waffle T-Shirts */}
        {currentPage === 'category-waffle' && (
          <ShopPage
            products={products}
            selectedCategory="waffle-t-shirts"
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => handleNavigate(cat === 'all' ? 'shop' : `category-${cat}`)}
          />
        )}

        {/* Category: Sweatshirts */}
        {currentPage === 'category-sweatshirts' && (
          <ShopPage
            products={products}
            selectedCategory="sweatshirts"
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => handleNavigate(cat === 'all' ? 'shop' : `category-${cat}`)}
          />
        )}

        {/* Product Details */}
        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
            onNavigateToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {/* Full Cart Page */}
        {currentPage === 'cart' && (
          <CartPage
            onNavigateToCheckout={() => handleNavigate('checkout')}
            onNavigateToShop={() => handleNavigate('shop')}
          />
        )}

        {/* Checkout Page */}
        {currentPage === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('cart')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {/* Order Confirmation Page */}
        {currentPage === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            onTrackOrder={handleTrackOrderFromConfirmation}
            onContinueShopping={() => handleNavigate('shop')}
          />
        )}

        {/* Order Tracking */}
        {currentPage === 'tracking' && (
          <OrderTrackingPage initialOrderNumber={trackingOrderNumber} />
        )}

        {/* About Page */}
        {currentPage === 'about' && (
          <AboutPage onNavigateToShop={() => handleNavigate('shop')} />
        )}

        {/* Contact Page */}
        {currentPage === 'contact' && <ContactPage />}

        {/* Admin Router: Protected Route */}
        {currentPage === 'admin' && (
          <>
            {authLoading ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#1A1918] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !user || !isAdmin ? (
              <AdminLoginPage
                onLoginSuccess={() => setCurrentPage('admin')}
                onBackToStore={() => setCurrentPage('home')}
              />
            ) : (
              <AdminDashboardPage
                products={products}
                orders={orders}
                onBackToStore={() => setCurrentPage('home')}
                onRefreshProducts={() => getProductsFromDB().then(setProducts)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer (hidden on admin dashboard to provide full-height workspace) */}
      {currentPage !== 'admin' && <Footer onNavigate={handleNavigate} />}

      {/* Cart Drawer Modal */}
      <CartDrawer
        onNavigateToCheckout={() => handleNavigate('checkout')}
        onNavigateToShop={() => handleNavigate('shop')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
