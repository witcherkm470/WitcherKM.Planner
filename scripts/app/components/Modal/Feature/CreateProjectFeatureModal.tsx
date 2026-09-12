import { useState } from "react";
import { createPortal } from "react-dom";

import styles from "./CreateProjectFeatureModal.module.scss";

interface CreateProjectFeatureModalProps {
    projectName: string;

    onSave: (
        name: string,
        description: string
    ) => void;

    onClose: () => void;
}

export default function CreateProjectFeatureModal({
                                                      projectName,
                                                      onSave,
                                                      onClose
                                                  }: CreateProjectFeatureModalProps) {
    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const canSave =
        name.trim().length > 0;

    return createPortal(
        <div className={styles.overlay}>
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
            >
                <header className={styles.header}>
                    <div>
                        <span className={styles.caption}>
                            {projectName}
                        </span>

                        <h2>
                            Новая фича
                        </h2>
                    </div>

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
                        <label htmlFor="project-feature-name">
                            Название
                        </label>

                        <input
                            id="project-feature-name"
                            value={name}
                            onChange={event =>
                                setName(event.target.value)
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="project-feature-description">
                            Краткое описание
                        </label>

                        <textarea
                            id="project-feature-description"
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
                        disabled={!canSave}
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
