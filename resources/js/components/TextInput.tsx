import { forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    isFocused?: boolean;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
            ref={localRef}
        />
    );
});
