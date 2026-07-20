export default function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-front-accent" : "bg-front-line"}`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-front-bg shadow transition-transform ${
                    checked ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    );
}
