import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectCard
    from "../../components/Project/ProjectCard.tsx";

import ProjectFeaturesTable
    from "../../components/Project/ProjectFeaturesTable.tsx";

import CreateProjectFeatureModal
    from "../../components/Modal/Feature/CreateProjectFeatureModal.tsx";

import ErrorModal
    from "../../components/Modal/ErrorModal.tsx";

import {
    getProjectById,
    getProjectFeatures,
    updateProjectCard
} from "../../api/apis/project/projectApi.ts";

import {
    addFeature
} from "../../api/apis/feature/featureApi.ts";

import {
    useApiRequest
} from "../../hooks/useApiRequest.ts";

import styles from "./ProjectPage.module.scss";

export default function ProjectPage() {
    const { projectId } = useParams();

    const [isEditing, setIsEditing] =
        useState(false);

    const [
        isCreateFeatureModalOpen,
        setIsCreateFeatureModalOpen
    ] = useState(false);

    const {
        execute: loadProject,
        data: project,
        error: loadProjectError,
        clearError: clearLoadProjectError,
        isLoading: isProjectLoading
    } = useApiRequest(getProjectById);

    const {
        execute: loadProjectFeatures,
        data: projectFeatures,
        error: projectFeaturesError,
        clearError: clearProjectFeaturesError
    } = useApiRequest(getProjectFeatures);

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

    const {
        execute: createFeature,
        error: createFeatureError,
        clearError: clearCreateFeatureError
    } = useApiRequest(addFeature, {
        onSuccess: async () => {
            setIsCreateFeatureModalOpen(false);

            const id = Number(projectId);

            if (Number.isNaN(id)) {
                return;
            }

            await Promise.all([
                loadProject(id),
                loadProjectFeatures(id)
            ]);
        }
    });

    useEffect(() => {
        const id = Number(projectId);

        if (Number.isNaN(id)) {
            return;
        }

        void loadProject(id);
        void loadProjectFeatures(id);
    }, [
        projectId,
        loadProject,
        loadProjectFeatures
    ]);

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

            <ProjectFeaturesTable
                features={projectFeatures ?? []}
                onAdd={() =>
                    setIsCreateFeatureModalOpen(true)
                }
            />

            {isCreateFeatureModalOpen && project && (
                <CreateProjectFeatureModal
                    projectName={project.name}
                    onClose={() =>
                        setIsCreateFeatureModalOpen(false)
                    }
                    onSave={(name, description) =>
                        void createFeature({
                            name,
                            description,

                            /*
                              Тут именно ID ТЕКУЩЕГО проекта.
                              Пользователь ничего не выбирает.
                            */
                            projectId: project.id
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

            {projectFeaturesError && (
                <ErrorModal
                    message={projectFeaturesError.message}
                    onClose={clearProjectFeaturesError}
                />
            )}

            {createFeatureError && (
                <ErrorModal
                    message={createFeatureError.message}
                    onClose={clearCreateFeatureError}
                />
            )}
        </main>
    );
}
