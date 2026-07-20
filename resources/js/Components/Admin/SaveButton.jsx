import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Loader2 } from "lucide-react";

import { FrontButton } from "@/Components/Front/Button";

export default function SaveButton({ processing, saved, disabled, form, children = "Save changes" }) {
    const checkRef = useRef(null);

    useGSAP(
        () => {
            if (!saved || !checkRef.current) return;
            gsap.fromTo(
                checkRef.current,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)" },
            );
        },
        { dependencies: [saved] },
    );

    return (
        <FrontButton type="submit" form={form} size="sm" disabled={processing || disabled}>
            {processing ? (
                <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving
                </>
            ) : saved ? (
                <>
                    <Check ref={checkRef} size={14} />
                    Saved
                </>
            ) : (
                children
            )}
        </FrontButton>
    );
}
