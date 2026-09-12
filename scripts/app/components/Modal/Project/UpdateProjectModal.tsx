import {useState} from "react";
import {createPortal} from "react-dom";
import type {ProjectModel} from "../../../api/models/project/ProjectModel.ts";
import styles from "./UpdateProjectModal.module.scss";

interface EditProjectModalProps {
    project: ProjectModel;
    onSave: (name: string, description: string) => void;
    onClose: () => void;
}

export default function UpdateProjectModal({project, onSave, onClose}: EditProjectModalProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description ?? "");

    return createPortal(
        <div className={styles.overlay}>
            <section className={styles.modal}>
                <header className={styles.header}>
                    <h2>Редактирование проекта</h2>

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
                        <label htmlFor="project-name">
                            Название
                        </label>

                        <input
                            id="project-name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="project-description">
                            Описание
                        </label>

                        <textarea
                            id="project-description"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
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
                        onClick={() => onSave(name, description)}
                    >
                        Сохранить
                    </button>
                </footer>
            </section>
        </div>,
        document.body
    );
}
