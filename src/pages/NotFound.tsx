import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { GradientText, GradientButton } from '@/components/ui/brand-components';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-heading">404</h1>
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2 font-heading">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-sans">
            We couldn't find the page you're looking for. The page might have been moved or deleted.
          </p>
          <Link to="/">
            <GradientButton>
              Back to Home
            </GradientButton>
          </Link>
        </div>
      </main>
      
      <footer className="border-t dark:border-gray-800 py-4">
        <div className="container mx-auto px-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between font-sans">
          <p>© 2023 Hireable. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
