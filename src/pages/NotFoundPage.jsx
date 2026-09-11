import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-max mx-auto text-center">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-primary-600 sm:text-5xl">404</p>
          <div className="sm:ml-6 sm:border-l sm:border-gray-200 sm:pl-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
            <p className="mt-3 text-base text-gray-500">
              Please check the URL in the address bar and try again, or return to the homepage.
            </p>
          </div>
        </main>
        <div className="mt-10 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
