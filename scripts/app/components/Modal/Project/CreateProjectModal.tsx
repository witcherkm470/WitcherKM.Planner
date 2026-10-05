import { useState } from "react";
import ModalFrame from "../ModalFrame";

import styles from "./CreateProjectModal.module.scss";

interface CreateProjectModalProps {
    onSave: (
        name: string,
        description: string
    ) => void;

    onClose: () => void;
    isSaving: boolean;
}

export default function CreateProjectModal({ isSaving, onSave, onClose}: CreateProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return <ModalFrame titleId="create-project-title" onClose={onClose} isBusy={isSaving} className={styles.modal} overlayClassName={styles.overlay}>
                <header className={styles.header}>
                    <h2 id="create-project-title">
                        Новый проект
                    </h2>

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
                        <label htmlFor="new-project-name">
                            Название
                        </label>

                        <input disabled={isSaving}
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

                        <textarea disabled={isSaving}
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
                        onClick={onClose} disabled={isSaving}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className={styles.saveButton}
                        disabled={isSaving || !name.trim()}
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
