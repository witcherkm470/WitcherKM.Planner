import { useEffect, useRef, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import styles from "./TooltipButton.module.scss";

type Props = ComponentProps<"button"> & { "aria-label": string };

export default function TooltipButton({ children, ...props }: Props) {
    const button = useRef<HTMLButtonElement>(null);
    const tooltip = useRef<HTMLSpanElement>(null);
    const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

    function show() {
        if (props.disabled || !button.current) return;
        const rect = button.current.getBoundingClientRect();
        setPosition({ left: rect.left + rect.width / 2, top: rect.top - 8 });
    }

    const visible = position !== null;
    useEffect(() => {
        if (!visible) return;
        // Render outside cards/tables so overflow:hidden cannot clip the label.
        const label = tooltip.current;
        if (label) {
            const rect = label.getBoundingClientRect();
            const offset = Math.max(8 - rect.left, Math.min(0, window.innerWidth - 8 - rect.right));
            label.style.marginLeft = `${offset}px`;
            if (rect.top < 8 && button.current) {
                label.style.top = `${button.current.getBoundingClientRect().bottom + 8}px`;
                label.style.transform = "translateX(-50%)";
            }
        }
        const hide = () => setPosition(null);
        const escape = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
        window.addEventListener("scroll", hide, true);
        window.addEventListener("resize", hide);
        window.addEventListener("keydown", escape);
        return () => {
            window.removeEventListener("scroll", hide, true);
            window.removeEventListener("resize", hide);
            window.removeEventListener("keydown", escape);
        };
    }, [visible]);

    return <>
        <button
            {...props}
            ref={button}
            onMouseEnter={(event) => { show(); props.onMouseEnter?.(event); }}
            onMouseLeave={(event) => { setPosition(null); props.onMouseLeave?.(event); }}
            onFocus={(event) => { show(); props.onFocus?.(event); }}
            onBlur={(event) => { setPosition(null); props.onBlur?.(event); }}
            onClick={(event) => { setPosition(null); props.onClick?.(event); }}
        >{children}</button>
        {position && !props.disabled && createPortal(
            <span ref={tooltip} className={styles.tooltip} style={position} aria-hidden="true">
                {props["aria-label"]}
            </span>,
            document.body,
        )}
    </>;
}