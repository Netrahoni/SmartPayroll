import React from 'react';
import { Icon } from './Icon.jsx'; // Use named import

const MetricCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-100',
    green: 'text-green-500 bg-green-100',
    red: 'text-red-500 bg-red-100',
    indigo: 'text-indigo-500 bg-indigo-100',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex items-start gap-4">
      <div className={`p-2 rounded-lg ${colorClasses[color] || 'bg-gray-100'}`}>
        <Icon path={icon} className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;