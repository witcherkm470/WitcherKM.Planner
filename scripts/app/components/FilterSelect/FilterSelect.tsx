import { useEffect, useRef, useState } from "react";
import styles from "./FilterSelect.module.scss";

export interface FilterOption<T extends string | number> { value: T | undefined; label: string; }

interface Props<T extends string | number> { ariaLabel: string; value: T | undefined; options: FilterOption<T>[]; onChange: (value: T | undefined) => void; tone?: "light" | "dark"; }

export default function FilterSelect<T extends string | number>({ ariaLabel, value, options, onChange, tone = "light" }: Props<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const selected = options.find(option => option.value === value) ?? options[0];

    useEffect(() => {
        const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setIsOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return <div ref={root} className={`${styles.root} ${tone === "dark" ? styles.dark : ""}`}>
        <button type="button" className={styles.trigger} aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(open => !open)} onKeyDown={event => { if (event.key === "Escape") setIsOpen(false); }}><span>{selected.label}</span><span className={styles.chevron} aria-hidden="true" /></button>
        {isOpen && <div className={styles.menu} role="listbox" aria-label={ariaLabel}>{options.map(option => <button type="button" role="option" aria-selected={option.value === value} className={option.value === value ? styles.optionActive : styles.option} key={String(option.value)} onClick={() => { onChange(option.value); setIsOpen(false); }}>{option.label}</button>)}</div>}
    </div>;
}
