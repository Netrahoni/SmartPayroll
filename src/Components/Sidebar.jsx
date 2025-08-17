import React from 'react';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';

const Sidebar = ({ activeItem, setActiveItem, onLogout, isSidebarOpen }) => {
    const navItems = ['Dashboard', 'Employees', 'Payroll', 'Reports', 'Settings'];

    return (
        <aside className={`bg-slate-900 text-slate-300 flex flex-col h-screen shadow-2xl transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden'}`}>
            
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Icon path={ICONS.payroll} className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide whitespace-nowrap">Smart Payroll</h1>
            </div>

            <nav className="flex-grow">
                <ul className="space-y-2">
                    {navItems.map(item => {
                        const isActive = activeItem === item;
                        return (
                            <li key={item}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveItem(item);
                                    }}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 relative whitespace-nowrap ${
                                        isActive
                                            ? 'bg-blue-600/90 text-white font-semibold shadow-md'
                                            : 'hover:bg-slate-700/50 hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-300 rounded-r-full"></span>
                                    )}
                                    <Icon path={ICONS[item.toLowerCase()]} className="w-5 h-5" />
                                    <span>{item}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-auto">
                 <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 p-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 group whitespace-nowrap"
                >
                    <Icon path={ICONS.logout} className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;