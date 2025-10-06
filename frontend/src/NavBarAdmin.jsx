/// SimpleAdminNav.jsx
import React from 'react';
import logo from './assets/logo.png';
import { User } from 'lucide-react'; // optional user icon

function SimpleAdminNav() {
  return (
    <div className="w-full bg-white shadow-md border-b border-gray-200 p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="logo" className="h-12 w-auto" />
        <span className="ml-3 text-2xl font-bold text-gray-800">Admin Panel</span>
      </div>

      {/* Admin Info */}
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-purple-600" />
        <span className="px-3 py-1 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition">
          Hello, Admin
        </span>
      </div>
    </div>
  );
}

export default SimpleAdminNav;
