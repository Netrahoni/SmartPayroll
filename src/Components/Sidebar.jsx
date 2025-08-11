import React from 'react';
import Icon from './Icon';
import { ICONS } from '../icons';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { name: 'Dashboard', icon: ICONS.dashboard },
    { name: 'Employees', icon: ICONS.employees },
    { name: 'Payroll', icon: ICONS.payroll },
    { name: 'Reports', icon: ICONS.reports },
    { name: 'Settings', icon: ICONS.settings },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <Icon path={ICONS.payroll} className="w-8 h-8 mr-2 text-blue-400" />
        <h1 className="text-2xl font-bold">Smart Payroll</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        {menuItems.map(item => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveItem(item.name); }}
            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
              activeItem === item.name
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Icon path={item.icon} className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <img src="https://placehold.co/40x40/6366f1/ffffff?text=AU" alt="Admin User" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-gray-400">admin@company.ca</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;