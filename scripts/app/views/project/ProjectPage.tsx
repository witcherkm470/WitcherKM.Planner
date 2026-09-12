import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectCard from "../../components/Project/ProjectCard.tsx";
import ErrorModal from "../../components/Modal/ErrorModal.tsx";

import {
    getProjectById,
    updateProjectCard
} from "../../api/apis/project/projectApi.ts";

import { useApiRequest } from "../../hooks/useApiRequest.ts";

import styles from "./ProjectPage.module.scss";

export default function ProjectPage() {
    const { projectId } = useParams();

    const [isEditing, setIsEditing] = useState(false);

    const {
        execute: loadProject,
        data: project,
        error: loadProjectError,
        clearError: clearLoadProjectError,
        isLoading: isProjectLoading
    } = useApiRequest(getProjectById);

    const {
        execute: updateProject,
        error: updateProjectError,
        clearError: clearUpdateProjectError,
        isLoading: isProjectUpdating
    } = useApiRequest(updateProjectCard, {
        onSuccess: async updatedProject => {
            setIsEditing(false);

            await loadProject(updatedProject.id);
        }
    });

    useEffect(() => {
        const id = Number(projectId);

        if (Number.isNaN(id)) {
            return;
        }

        void loadProject(id);
    }, [projectId, loadProject]);

    return (
        <main className={styles.page}>
            {isProjectLoading && !project && (
                <div className={styles.loading}>
                    Загрузка проекта...
                </div>
            )}

            {project && (
                <ProjectCard
                    project={project}
                    isEditing={isEditing}
                    isSaving={isProjectUpdating}
                    onEditingChange={setIsEditing}
                    onSave={values =>
                        void updateProject({
                            projectId: project.id,
                            name: values.name,
                            description: values.description,
                            documentation: values.documentation
                        })
                    }
                />
            )}

            {loadProjectError && (
                <ErrorModal
                    message={loadProjectError.message}
                    onClose={clearLoadProjectError}
                />
            )}

            {updateProjectError && (
                <ErrorModal
                    message={updateProjectError.message}
                    onClose={clearUpdateProjectError}
                />
            )}
        </main>
    );
}
