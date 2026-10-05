import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./FilterSelect.module.scss";

export interface FilterOption<T extends string | number> { value: T | undefined; label: string; }

interface Props<T extends string | number> { ariaLabel: string; value: T | undefined; options: FilterOption<T>[]; onChange: (value: T | undefined) => void; tone?: "light" | "dark"; disabled?: boolean; inlineMenu?: boolean; }

export default function FilterSelect<T extends string | number>({ ariaLabel, value, options, onChange, tone = "light", disabled = false, inlineMenu = false }: Props<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const menuId = useId();
    const selected = options.find(option => option.value === value) ?? options[0];

    useEffect(() => {
        const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setIsOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    useEffect(() => {
        if (isOpen && !disabled) {
            (root.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
                ?? root.current?.querySelector<HTMLElement>('[role="option"]'))?.focus();
        }
    }, [isOpen, disabled]);

    function closeMenu() {
        setIsOpen(false);
        trigger.current?.focus();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (disabled) return;
        if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
            return;
        }
        if (event.key === "Tab" && isOpen) {
            // Continue native Tab navigation from the trigger after removing the menu.
            closeMenu();
            return;
        }
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) { setIsOpen(true); return; }
        const items = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
        const index = items.findIndex(item => item === document.activeElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
            : event.key === "ArrowDown" ? Math.min(index + 1, items.length - 1) : Math.max(index - 1, 0);
        items[next]?.focus();
    }

    return <div ref={root} onKeyDown={handleKeyDown}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false); }}
        className={`${styles.root} ${tone === "dark" ? styles.dark : ""}`}>
        <button ref={trigger} type="button" disabled={disabled || !options.length} className={styles.trigger}
            aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={isOpen && !disabled} aria-controls={isOpen && !disabled ? menuId : undefined}
            onClick={() => setIsOpen(open => !open)}><span>{selected?.label}</span><span className={styles.chevron} aria-hidden="true" /></button>
        {isOpen && !disabled && <div id={menuId} className={styles.menu + (inlineMenu ? " " + styles.inlineMenu : "")} role="listbox" aria-label={ariaLabel}>
            {options.map(option => <button type="button" role="option" tabIndex={-1} aria-selected={option.value === value}
                className={option.value === value ? styles.optionActive : styles.option} key={String(option.value)}
                onClick={() => { onChange(option.value); closeMenu(); }}>{option.label}</button>)}
        </div>}
    </div>;
}
