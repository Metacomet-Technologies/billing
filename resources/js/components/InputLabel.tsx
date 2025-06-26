import { LabelHTMLAttributes, PropsWithChildren } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement>, PropsWithChildren {
    value?: string;
    className?: string;
}

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: InputLabelProps) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
