import { PropsWithChildren } from 'react';
import NotificationContext from '../contexts/NotificationContext';
import useNotifications from '../hooks/useNotifications';
import Notifications from './Notifications';

export default function AppProvider({ children }: PropsWithChildren) {
    const { notifications, addNotification, removeNotification } = useNotifications();

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            {/* Global Notifications */}
            <Notifications
                notifications={notifications}
                onRemove={removeNotification}
            />
        </NotificationContext.Provider>
    );
}
