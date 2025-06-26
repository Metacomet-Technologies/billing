import NotificationItem from './NotificationItem';
import type { Notification } from '../hooks/useNotifications';

interface NotificationsProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

export default function Notifications({ notifications, onRemove }: NotificationsProps) {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-4 w-96">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}
