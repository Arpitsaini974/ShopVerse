import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import CartDrawer from '../cart/CartDrawer';
import ToastContainer from '../ui/ToastContainer';
import QuickViewModal from '../product/QuickViewModal';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      
      {/* Main content with bottom padding on mobile to account for MobileNav */}
      <main className="flex-1 w-full pb-16 md:pb-0 flex flex-col">
        {children}
      </main>
      
      <Footer />
      <MobileNav />
      
      {/* Overlays and Modals */}
      <CartDrawer />
      <ToastContainer />
      <QuickViewModal />
    </div>
  );
};

export default Layout;
