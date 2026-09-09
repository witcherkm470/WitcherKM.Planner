import {useEffect} from "react";
import {createPortal} from "react-dom";
import styles from "./ErrorModal.module.scss";

interface ErrorModalProps {
    message: string;
    onClose: () => void;
    title?: string;
}

export default function ErrorModal({
                                       message,
                                       onClose,
                                       title = "Ошибка"
                                   }: ErrorModalProps) {

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return createPortal(
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="error-modal-title"
            >
                <header className={styles.header}>
                    <h2 id="error-modal-title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </header>

                <div className={styles.body}>
                    <p>{message}</p>
                </div>
            </section>
        </div>,
        document.body
    );
}
