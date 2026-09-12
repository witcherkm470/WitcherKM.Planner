import { useEffect, useState } from "react";

import { ProjectStatus } from "../../api/models/project/ProjectStatus.ts";
import { ProjectStatusLabel } from "../../api/models/project/ProjectModel.ts";

import type {
    ProjectExtendedModel
} from "../../api/models/project/ProjectExtendedModel.ts";

import ConfirmModal from "../Modal/Project/ConfirmModal.tsx";

import editIcon from "../../assets/magic-edit.svg";

import styles from "./ProjectCard.module.scss";

interface ProjectCardEditValues {
    name: string;
    description: string;
    documentation: string;
}

interface ProjectCardProps {
    project: ProjectExtendedModel;

    isEditing: boolean;
    isSaving: boolean;

    onEditingChange: (isEditing: boolean) => void;

    onSave: (values: ProjectCardEditValues) => void;
}

export default function ProjectCard({
                                        project,
                                        isEditing,
                                        isSaving,
                                        onEditingChange,
                                        onSave
                                    }: ProjectCardProps) {
    const [name, setName] = useState(project.name);

    const [description, setDescription] =
        useState(project.description ?? "");

    const [documentation, setDocumentation] =
        useState(project.documentation ?? "");

    const [isConfirmOpen, setIsConfirmOpen] =
        useState(false);

    useEffect(() => {
        setName(project.name);
        setDescription(project.description ?? "");
        setDocumentation(project.documentation ?? "");
    }, [project]);

    const hasChanges =
        name !== project.name ||
        description !== (project.description ?? "") ||
        documentation !== (project.documentation ?? "");

    function resetChanges() {
        setName(project.name);
        setDescription(project.description ?? "");
        setDocumentation(project.documentation ?? "");
    }

    function enableEditing() {
        resetChanges();
        onEditingChange(true);
    }

    function disableEditing() {
        if (!hasChanges) {
            onEditingChange(false);
            return;
        }

        setIsConfirmOpen(true);
    }

    function toggleEditing() {
        if (isSaving) {
            return;
        }

        if (isEditing) {
            disableEditing();
            return;
        }

        enableEditing();
    }

    function saveChanges() {
        onSave({
            name,
            description,
            documentation
        });
    }

    function saveAndCloseConfirmation() {
        setIsConfirmOpen(false);
        saveChanges();
    }

    function discardChanges() {
        setIsConfirmOpen(false);

        resetChanges();

        onEditingChange(false);
    }

    function getStatusClass(status: ProjectStatus): string {
        switch (status) {
            case ProjectStatus.InProgress:
                return styles.statusInProgress;

            case ProjectStatus.Completed:
                return styles.statusCompleted;

            default:
                return styles.statusUndefined;
        }
    }

    return (
        <>
            <article className={styles.card}>
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <span className={styles.caption}>
                            Проект
                        </span>

                        {isEditing ? (
                            <input
                                className={styles.titleInput}
                                value={name}
                                onChange={event =>
                                    setName(event.target.value)
                                }
                            />
                        ) : (
                            <h1>
                                {project.name}
                            </h1>
                        )}
                    </div>

                    <div className={styles.headerCenter}>
                        <span className={styles.featureCountBadge}>
                            Открытых фич: {project.openedFeatureCount}
                        </span>
                    </div>

                    <div className={styles.headerActions}>
                        <span
                            className={`
                                ${styles.statusBadge}
                                ${getStatusClass(project.projectStatus)}
                            `}
                        >
                            {ProjectStatusLabel[project.projectStatus]}
                        </span>

                        <button
                            type="button"
                            className={`
                                ${styles.editButton}
                                ${
                                isEditing
                                    ? styles.editButtonActive
                                    : ""
                            }
                            `}
                            onClick={toggleEditing}
                            disabled={isSaving}
                            aria-label={
                                isEditing
                                    ? "Завершить редактирование"
                                    : "Редактировать проект"
                            }
                        >
                            <img
                                src={editIcon}
                                alt=""
                            />
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>
                            Описание
                        </h2>

                        {isEditing ? (
                            <textarea
                                className={styles.textarea}
                                value={description}
                                onChange={event =>
                                    setDescription(event.target.value)
                                }
                            />
                        ) : (
                            <p className={styles.description}>
                                {
                                    project.description ||
                                    "Описание отсутствует"
                                }
                            </p>
                        )}
                    </section>

                    <section className={styles.section}>
                        <h2>
                            Документация
                        </h2>

                        {isEditing ? (
                            <textarea
                                className={`
                                    ${styles.textarea}
                                    ${styles.documentationInput}
                                `}
                                value={documentation}
                                onChange={event =>
                                    setDocumentation(event.target.value)
                                }
                            />
                        ) : (
                            <div className={styles.documentation}>
                                {
                                    project.documentation ||
                                    "Документация отсутствует"
                                }
                            </div>
                        )}
                    </section>
                </div>

                {isEditing && (
                    <footer className={styles.footer}>
                        <button
                            type="button"
                            className={styles.saveButton}
                            onClick={saveChanges}
                            disabled={isSaving || !hasChanges}
                        >
                            {
                                isSaving
                                    ? "Сохранение..."
                                    : "Сохранить"
                            }
                        </button>
                    </footer>
                )}
            </article>

            {isConfirmOpen && (
                <ConfirmModal
                    title="Сохранить изменения?"
                    message="В проекте есть несохранённые изменения."
                    confirmText="Да"
                    cancelText="Нет"
                    onConfirm={saveAndCloseConfirmation}
                    onCancel={discardChanges}
                />
            )}
        </>
    );
}
