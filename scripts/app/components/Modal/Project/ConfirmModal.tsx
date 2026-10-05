import ModalFrame from "../ModalFrame";

import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
    title: string;
    message: string;

    confirmText: string;
    cancelText: string;

    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}

export default function ConfirmModal({ onClose,
                                         title,
                                         message,
                                         confirmText,
                                         cancelText,
                                         onConfirm,
                                         onCancel
                                     }: ConfirmModalProps) {
    return <ModalFrame titleId="confirm-title" onClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
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

    </ModalFrame>;
}
