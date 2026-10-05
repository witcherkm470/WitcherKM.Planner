import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Project/CreateProjectModal.module.scss";

import frameStyles from "./ModalFrame.module.scss";

const dialogs: HTMLElement[] = [];
const lastFocused = new WeakMap<HTMLElement, HTMLElement>();
interface Props { children: ReactNode; titleId: string; onClose: () => void; isBusy?: boolean; className?: string; overlayClassName?: string; }

export default function ModalFrame({ children, titleId, onClose, isBusy = false, className = styles.modal, overlayClassName = styles.overlay }: Props) {
    const dialog = useRef<HTMLElement>(null);
    const controls = useRef({ onClose, isBusy });
    useEffect(() => { controls.current = { onClose, isBusy }; }, [onClose, isBusy]);
    useEffect(() => {
        const element = dialog.current!;
        const active = document.activeElement as HTMLElement | null;
        const parent = dialogs.at(-1);
        // Disabling the submit button can move browser focus to body before an error opens.
        const previous = parent && !parent.contains(active) ? lastFocused.get(parent) ?? parent : active;
        dialogs.push(element);
        const rememberFocus = (event: FocusEvent) => {
            if (event.target instanceof HTMLElement) lastFocused.set(element, event.target);
        };
        element.addEventListener("focusin", rememberFocus);
        const focusable = () => Array.from(element.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')).filter(item => item.tabIndex >= 0);
        (element.querySelector<HTMLElement>('input:not(:disabled), textarea:not(:disabled)') ?? focusable()[0] ?? element).focus();
        const keydown = (event: KeyboardEvent) => {
            if (dialogs.at(-1) !== element) return;
            if (event.key === "Escape") {
                event.preventDefault(); event.stopPropagation();
                if (!controls.current.isBusy) controls.current.onClose();
            }
            if (event.key === "Tab") {
                const items = focusable(); const first = items[0]; const last = items.at(-1);
                if (!first) { event.preventDefault(); element.focus(); }
                else if (event.shiftKey && (document.activeElement === first || !element.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && (document.activeElement === last || !element.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener("keydown", keydown);
        return () => {
            dialogs.splice(dialogs.indexOf(element), 1);
            element.removeEventListener("focusin", rememberFocus);
            document.removeEventListener("keydown", keydown);
            if (previous?.isConnected) {
                if (!previous.matches(":disabled")) previous.focus();
                else {
                    // A save may close the form while its trigger is still disabled during reload.
                    const observer = new MutationObserver(() => {
                        if (!previous.matches(":disabled")) {
                            observer.disconnect();
                            if (previous.isConnected && (!dialogs.length || dialogs.at(-1)?.contains(previous))) previous.focus();
                        }
                    });
                    observer.observe(previous, { attributes: true, attributeFilter: ["disabled"] });
                    window.setTimeout(() => observer.disconnect(), 5000);
                }
            }
        };
    }, []);
    return createPortal(<div className={overlayClassName}><section ref={dialog} tabIndex={-1} className={className + " " + frameStyles.frame} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-busy={isBusy}>{children}</section></div>, document.body);
}
