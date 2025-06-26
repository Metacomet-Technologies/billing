import { createContext, useContext } from 'react';
import type { NotificationType } from '../hooks/useNotifications';

interface NotificationContextType {
    addNotification: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
