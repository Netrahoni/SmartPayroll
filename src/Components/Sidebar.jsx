import React from 'react';
import Icon from './Icon';
import { ICONS } from '../icons';

// The Sidebar now accepts an 'onLogout' function as a prop
const Sidebar = ({ activeItem, setActiveItem, onLogout }) => {
    const navItems = ['Dashboard', 'Employees', 'Payroll', 'Reports', 'Settings'];

    return (
        <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
            <h1 className="text-2xl font-bold mb-10">Smart Payroll</h1>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li
                            key={item}
                            className={`flex items-center p-3 my-2 rounded-lg cursor-pointer transition-colors ${
                                activeItem === item ? 'bg-blue-500' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveItem(item)}
                        >
                            <Icon path={ICONS[item.toLowerCase()]} className="w-5 h-5 mr-3" />
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* --- ADMIN USER & LOGOUT BUTTON --- */}
            <div>
                
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <Icon path={ICONS.logout} className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
