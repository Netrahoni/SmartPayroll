import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message) => {
        const newNotification = {
            id: Date.now(),
            message,
            read: false,
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep last 10
    }, []);

    const markAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);
    
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const value = {
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
        unreadCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};