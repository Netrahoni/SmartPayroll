import React from 'react';
import Icon from './Icon';
import { ICONS } from '../icons';

const Header = ({ user }) => {

    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-10 p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon path={ICONS.search} className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search employees, payroll, reports..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {/* User Profile & Notifications */}
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <svg 
                            className="w-6 h-6 text-slate-500 hover:text-slate-700" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-xs text-white">3</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                            {user ? getInitials(user.fullName) : '...'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-slate-800">{user ? user.fullName : 'Loading...'}</p>
                            <p className="text-xs text-slate-500">{user ? user.position : 'Loading...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;