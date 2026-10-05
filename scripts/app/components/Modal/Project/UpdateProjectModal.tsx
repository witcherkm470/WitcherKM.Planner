import {useState} from "react";
import ModalFrame from "../ModalFrame";
import type {ProjectModel} from "../../../api/models/project/ProjectModel.ts";
import styles from "./UpdateProjectModal.module.scss";

interface EditProjectModalProps {
    project: ProjectModel;
    onSave: (name: string, description: string) => void;
    onClose: () => void;
    isSaving: boolean;
}

export default function UpdateProjectModal({ isSaving, project, onSave, onClose}: EditProjectModalProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description ?? "");

    return <ModalFrame titleId="edit-project-title" onClose={onClose} isBusy={isSaving} className={styles.modal} overlayClassName={styles.overlay}>
                <header className={styles.header}>
                    <h2 id="edit-project-title">Редактирование проекта</h2>

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
                        <label htmlFor="project-name">
                            Название
                        </label>

                        <input disabled={isSaving}
                            id="project-name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="project-description">
                            Описание
                        </label>

                        <textarea disabled={isSaving}
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
                        onClick={onClose} disabled={isSaving}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className={styles.saveButton}
                        disabled={isSaving || !name.trim()}
                        onClick={() => onSave(name, description)}
                    >
                        Сохранить
                    </button>
                </footer>

    </ModalFrame>;
}
