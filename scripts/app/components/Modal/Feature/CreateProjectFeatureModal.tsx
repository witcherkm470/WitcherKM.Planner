import { useState } from "react";
import ModalFrame from "../ModalFrame";

import styles from "./CreateProjectFeatureModal.module.scss";

interface CreateProjectFeatureModalProps {
    projectName: string;

    onSave: (
        name: string,
        description: string
    ) => void;

    onClose: () => void;
    isSaving: boolean;
}

export default function CreateProjectFeatureModal({ isSaving,
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

    return <ModalFrame titleId="create-project-feature-title" onClose={onClose} isBusy={isSaving} className={styles.modal} overlayClassName={styles.overlay}>
                <header className={styles.header}>
                    <div>
                        <span className={styles.caption}>
                            {projectName}
                        </span>

                        <h2 id="create-project-feature-title">
                            Новая фича
                        </h2>
                    </div>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose} disabled={isSaving}
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

                        <input disabled={isSaving}
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

                        <textarea disabled={isSaving}
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
                        onClick={onClose} disabled={isSaving}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className={styles.saveButton}
                        disabled={isSaving || !canSave}
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

    </ModalFrame>;
}
