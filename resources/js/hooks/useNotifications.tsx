import { useEffect, useState } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: NotificationType, title: string, message: string) => void;
    removeNotification: (id: string) => void;
}

const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, title: string, message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        const notification: Notification = { id, type, title, message };

        setNotifications(prev => [...prev, notification]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return { notifications, addNotification, removeNotification };
};

export default useNotifications;
export type { NotificationType, Notification };
