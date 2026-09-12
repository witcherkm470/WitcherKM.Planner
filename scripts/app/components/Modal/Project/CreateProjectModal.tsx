import { useState } from "react";
import { createPortal } from "react-dom";

import styles from "./CreateProjectModal.module.scss";

interface CreateProjectModalProps {
    onSave: (
        name: string,
        description: string
    ) => void;

    onClose: () => void;
}

export default function CreateProjectModal({onSave, onClose}: CreateProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return createPortal(
        <div className={styles.overlay}>
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-project-title"
            >
                <header className={styles.header}>
                    <h2 id="create-project-title">
                        Новый проект
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
                    <div className={styles.formGroup}>
                        <label htmlFor="new-project-name">
                            Название
                        </label>

                        <input
                            id="new-project-name"
                            value={name}
                            onChange={event =>
                                setName(event.target.value)
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="new-project-description">
                            Краткое описание
                        </label>

                        <textarea
                            id="new-project-description"
                            value={description}
                            onChange={event =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>
                </div>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className={styles.saveButton}
                        onClick={() =>
                            onSave(
                                name,
                                description
                            )
                        }
                    >
                        Создать
                    </button>
                </footer>
            </section>
        </div>,
        document.body
    );
}
