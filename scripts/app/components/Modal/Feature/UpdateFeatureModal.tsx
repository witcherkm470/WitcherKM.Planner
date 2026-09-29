import {useState} from "react";
import {createPortal} from "react-dom";
import type {ProjectFeaturesModel} from "../../../api/models/project/ProjectFeaturesModel.ts";
import styles from "../Project/UpdateProjectModal.module.scss";

interface EditFeatureModalProps {
    feature: ProjectFeaturesModel;
    onSave: (name: string, description: string) => void;
    onClose: () => void;
    isSaving: boolean;
}

export default function UpdateFeatureModal({feature, onSave, onClose, isSaving}: EditFeatureModalProps) {
    const [name, setName] = useState(feature.name);
    const [description, setDescription] = useState(feature.description ?? "");

    return createPortal(
        <div className={styles.overlay}>
            <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-feature-title">
                <header className={styles.header}>
                    <h2 id="edit-feature-title">Редактирование фичи</h2>

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

                        <input
                            id="feature-name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="feature-description">
                            Описание
                        </label>

                        <textarea
                            id="feature-description"
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
                        onClick={() => onSave(name, description)} disabled={isSaving || !name.trim()}
                    >
                        {isSaving ? "Сохранение..." : "Сохранить"}
                    </button>
                </footer>
            </section>
        </div>,
        document.body
    );
}
