import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-8xl font-bold tracking-tighter text-black dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
        Return Home
      </Link>
    </div>
  );
}
