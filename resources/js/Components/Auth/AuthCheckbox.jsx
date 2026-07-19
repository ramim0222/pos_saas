export default function AuthCheckbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`h-4 w-4 rounded border-front-line bg-transparent text-front-accent accent-front-accent focus:ring-1 focus:ring-front-accent focus:ring-offset-0 ${className}`}
        />
    );
}
