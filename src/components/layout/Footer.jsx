import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 border-b border-slate-700 pb-8">
          
          {/* Brand & Social */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white mb-4">
              <ShoppingBag size={28} className="text-primary-500" />
              <span className="text-2xl font-bold tracking-tight">ShopVerse</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Your one-stop destination for all your shopping needs. Experience the best products with fast delivery and excellent customer service.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors text-white">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors text-white">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors text-white">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors text-white">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link to="/corporate" className="hover:text-white transition-colors">Corporate Information</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/payments" className="hover:text-white transition-colors">Payments</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-white font-semibold mb-4">Policy</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/policy/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/policy/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/policy/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/policy/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
          <div className="flex gap-2 items-center flex-wrap justify-center">
            <span className="px-2 py-1 border border-slate-700 rounded bg-slate-800 font-bold tracking-wider">VISA</span>
            <span className="px-2 py-1 border border-slate-700 rounded bg-slate-800 font-bold tracking-wider">MASTERCARD</span>
            <span className="px-2 py-1 border border-slate-700 rounded bg-slate-800 font-bold tracking-wider">RUPAY</span>
            <span className="px-2 py-1 border border-slate-700 rounded bg-slate-800 font-bold tracking-wider">UPI</span>
            <span className="px-2 py-1 border border-slate-700 rounded bg-slate-800 font-bold tracking-wider">NET BANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
