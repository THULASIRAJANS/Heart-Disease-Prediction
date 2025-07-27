// components/Header.jsx
import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'upload', label: 'Upload & Diagnose' },
    { id: 'history', label: 'Patient History' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'info', label: 'About' }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and App Title */}
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">RetinaCare</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden">
            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}