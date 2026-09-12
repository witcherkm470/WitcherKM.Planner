import { createPortal } from "react-dom";

import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
    title: string;
    message: string;

    confirmText: string;
    cancelText: string;

    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
                                         title,
                                         message,
                                         confirmText,
                                         cancelText,
                                         onConfirm,
                                         onCancel
                                     }: ConfirmModalProps) {
    return createPortal(
        <div className={styles.overlay}>
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
            >
                <header className={styles.header}>
                    <h2 id="confirm-title">
                        {title}
                    </h2>
                </header>

                <div className={styles.body}>
                    {message}
                </div>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={styles.confirmButton}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </footer>
            </section>
        </div>,
        document.body
    );
}
