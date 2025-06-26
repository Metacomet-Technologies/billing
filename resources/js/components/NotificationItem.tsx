import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import type { Notification } from '../hooks/useNotifications';

interface NotificationProps {
    notification: Notification;
    onRemove: (id: string) => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-5 w-5 text-green-400" />;
        case 'error':
            return <XCircle className="h-5 w-5 text-red-400" />;
        case 'warning':
            return <AlertCircle className="h-5 w-5 text-yellow-400" />;
        case 'info':
            return <Info className="h-5 w-5 text-blue-400" />;
        default:
            return <Info className="h-5 w-5 text-blue-400" />;
    }
};

const getBackgroundColor = (type: string) => {
    switch (type) {
        case 'success':
            return 'bg-green-50 border-green-200';
        case 'error':
            return 'bg-red-50 border-red-200';
        case 'warning':
            return 'bg-yellow-50 border-yellow-200';
        case 'info':
            return 'bg-blue-50 border-blue-200';
        default:
            return 'bg-blue-50 border-blue-200';
    }
};

const getTextColor = (type: string) => {
    switch (type) {
        case 'success':
            return 'text-green-800';
        case 'error':
            return 'text-red-800';
        case 'warning':
            return 'text-yellow-800';
        case 'info':
            return 'text-blue-800';
        default:
            return 'text-blue-800';
    }
};

export default function NotificationItem({ notification, onRemove }: NotificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(notification.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification.id, onRemove]);

    return (
        <div className={`rounded-lg border p-4 shadow-sm ${getBackgroundColor(notification.type)}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${getTextColor(notification.type)}`}>
                        {notification.title}
                    </h3>
                    <div className={`mt-1 text-sm ${getTextColor(notification.type)}`}>
                        <p>{notification.message}</p>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            onClick={() => onRemove(notification.id)}
                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getTextColor(notification.type)} hover:bg-white/20`}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
