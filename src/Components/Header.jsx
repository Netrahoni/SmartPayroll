import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatDistanceToNow } from 'date-fns';

const Header = ({ user, globalSearchQuery, setGlobalSearchQuery, toggleSidebar }) => {
    const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const getInitials = (firstName, lastName) => {
        if (!firstName || !lastName) return '';
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };
    
    const handleBellClick = () => {
        setIsDropdownOpen(prev => !prev);
        if (!isDropdownOpen) {
            markAsRead();
        }
    };

    return (
        <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-20 p-4 border-b border-slate-200">
            <div className="flex items-center justify-between gap-4">
                <button onClick={toggleSidebar} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon path={ICONS.search} className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search employees or payroll..."
                        value={globalSearchQuery}
                        onChange={(e) => setGlobalSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <button onClick={handleBellClick} className="relative text-slate-500 hover:text-slate-700">
                             <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-xs text-white">{unreadCount}</span>
                                </span>
                            )}
                        </button>
                        
                        {isDropdownOpen && (
                             <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden border">
                                <div className="p-3 flex justify-between items-center border-b">
                                    <h4 className="font-semibold text-gray-700">Notifications</h4>
                                    <button onClick={clearNotifications} className="text-sm text-blue-500 hover:underline">Clear All</button>
                                </div>
                                <ul className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <li key={n.id} className="p-3 border-b hover:bg-gray-50">
                                                <p className="text-sm text-gray-800">{n.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-4 text-center text-sm text-gray-500">No new notifications</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                            {user ? getInitials(user.firstName, user.lastName) : '...'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-slate-800">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
                            <p className="text-xs text-slate-500">{user ? user.position : 'Loading...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;