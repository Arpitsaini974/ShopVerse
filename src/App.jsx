import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DealsPage from './pages/DealsPage';
import ComparePage from './pages/ComparePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
