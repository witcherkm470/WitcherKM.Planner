import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "../Project/CreateProjectModal.module.scss";

interface IdeaModalProps {
    title: string;
    initialEssence?: string;
    isSaving: boolean;
    onClose: () => void;
    onSave: (essence: string) => void;
}

export default function IdeaModal({
    title,
    initialEssence = "",
    isSaving,
    onClose,
    onSave
}: IdeaModalProps) {
    const [essence, setEssence] = useState(initialEssence);

    return createPortal(
        <div className={styles.overlay}>
            <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="idea-modal-title">
                <header className={styles.header}>
                    <h2 id="idea-modal-title">{title}</h2>
                    <button type="button" className={styles.closeButton} onClick={onClose} disabled={isSaving} aria-label="Закрыть">×</button>
                </header>
                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label htmlFor="idea-essence">Суть</label>
                        <textarea id="idea-essence" value={essence} onChange={event => setEssence(event.target.value)} />
                    </div>
                </div>
                <footer className={styles.footer}>
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSaving}>Отмена</button>
                    <button type="button" className={styles.saveButton} onClick={() => onSave(essence)} disabled={isSaving || !essence.trim()}>
                        {isSaving ? "Сохранение..." : "Сохранить"}
                    </button>
                </footer>
            </section>
        </div>,
        document.body
    );
}
