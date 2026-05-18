import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
