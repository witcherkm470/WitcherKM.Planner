import { useState } from "react";
import ModalFrame from "../ModalFrame";

import type {
    ProjectNameIdModel
} from "../../../api/models/project/ProjectNameIdModel.ts";

import styles from "./CreateFeatureModal.module.scss";
import ProjectSelect from "../../Project/ProjectSelect.tsx";

interface CreateFeatureModalProps {
    projects: ProjectNameIdModel[];

    onSave: (
        name: string,
        description: string,
        projectId: number
    ) => void;

    onClose: () => void;
    isSaving: boolean;
}

export default function CreateFeatureModal({ isSaving,
                                               projects,
                                               onSave,
                                               onClose
                                           }: CreateFeatureModalProps) {
    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [projectId, setProjectId] =
        useState<number | null>(
            projects.length > 0
                ? projects[0].id
                : null
        );

    const canSave =
        name.trim().length > 0 &&
        projects.some(project => project.id === projectId);

    return <ModalFrame titleId="create-feature-title" onClose={onClose} isBusy={isSaving} className={styles.modal} overlayClassName={styles.overlay}>
                <header className={styles.header}>
                    <h2 id="create-feature-title">
                        Новая фича
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
                        <label htmlFor="feature-name">
                            Название
                        </label>

                        <input disabled={isSaving}
                            id="feature-name"
                            value={name}
                            onChange={event =>
                                setName(event.target.value)
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="feature-description">
                            Краткое описание
                        </label>

                        <textarea disabled={isSaving}
                            id="feature-description"
                            value={description}
                            onChange={event =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="feature-project">
                            Проект
                        </label>

                        <ProjectSelect
                            disabled={isSaving}
                            projects={projects}
                            value={projectId}
                            onChange={setProjectId}
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
                        onClick={() => {
                            if (projectId === null) {
                                return;
                            }

                            onSave(
                                name,
                                description,
                                projectId
                            );
                        }}
                    >
                        Создать
                    </button>
                </footer>

    </ModalFrame>;
}
