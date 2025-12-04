import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthOnboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-6">
      <h1 className="text-4xl font-bold text-center">Welcome to FoodLink</h1>
      <div className="grid gap-4 w-full max-w-sm">
        <Link to="/login" className="py-3 px-6 bg-emerald-600 text-white rounded-xl text-center font-semibold">
          Login
        </Link>
        <Link to="/register/donor" className="py-3 px-6 bg-white border border-gray-300 text-gray-900 rounded-xl text-center font-semibold">
          Register as Donor
        </Link>
        <Link to="/register/volunteer" className="py-3 px-6 bg-white border border-gray-300 text-gray-900 rounded-xl text-center font-semibold">
          Register as Volunteer
        </Link>
      </div>
    </div>
  );
}
