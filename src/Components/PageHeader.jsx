import React from 'react';
import Icon from './Icon';
import { ICONS } from '../icons'; // We will create this file next

const PageHeader = ({ title }) => (
    <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors duration-200">
                <Icon path={ICONS.add} className="w-5 h-5 mr-2" />
                Add Employee
            </button>
            <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors duration-200">
                <Icon path={ICONS.refresh} className="w-5 h-5 mr-2" />
                Refresh
            </button>
        </div>
    </header>
);

export default PageHeader;