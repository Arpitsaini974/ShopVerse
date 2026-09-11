import React from 'react';
import { AlertTriangle, RefreshCw, ShoppingBag } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔥 [ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleContinueShopping = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/products';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50 text-center animate-in fade-in duration-200">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-5 border border-rose-100 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong.</h1>
            <p className="text-sm text-gray-600 mb-6">
              We couldn't load this page.
            </p>

            {/* Error detail in development */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="w-full text-left bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 overflow-x-auto">
                <p className="text-xs font-mono text-rose-700 font-semibold break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleTryAgain}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw size={15} /> Try Again
              </button>
              <button
                onClick={this.handleContinueShopping}
                className="flex-1 py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={15} /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
