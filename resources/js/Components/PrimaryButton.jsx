export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl
                shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:from-primary-500 hover:to-primary-600
                transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    disabled && 'opacity-50 cursor-not-allowed transform-none shadow-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
