import { useFeatureActions } from "../../hooks/useFeatureActions";
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

import { ProjectStatus } from "../../api/models/project/ProjectStatus";

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
        isLoading: isProjectLoading, error: loadError, clearError: clearLoadError
    } = useApiRequest(getProjectById);

    const {
        execute: loadProjectFeatures,
        data: projectFeatures, error: featuresError, clearError: clearFeaturesError
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
        clearError: clearCreateFeatureError, isLoading: isFeatureCreating
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

    const featureActions = useFeatureActions(async () => { const id = Number(projectId); if (!Number.isNaN(id)) { await Promise.all([loadProject(id), loadProjectFeatures(id)]); } });

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

            {project && project.id === Number(projectId) && (
                <ProjectCard
                    key={project.id}
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

            <ProjectFeaturesTable canAdd={!!project && project.id === Number(projectId) && project.projectStatus !== ProjectStatus.Closed && !isFeatureCreating} onEdit={featureActions.onEdit} onDelete={featureActions.onDelete} onChangeStatus={featureActions.onChangeStatus} isBusy={featureActions.isBusy}
                features={projectFeatures ?? []}
                onAdd={() =>
                    setIsCreateFeatureModalOpen(true)
                }
            />

            {isCreateFeatureModalOpen && project && project.id === Number(projectId) && (
                <CreateProjectFeatureModal
                    isSaving={isFeatureCreating}
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

            {updateProjectError && (
                <ErrorModal
                    message={updateProjectError.message}
                    onClose={clearUpdateProjectError}
                />
            )}

            {featureActions.dialogs}
            {loadError && <ErrorModal message={loadError.message} onClose={clearLoadError} />}
            {featuresError && <ErrorModal message={featuresError.message} onClose={clearFeaturesError} />}

            {createFeatureError && (
                <ErrorModal
                    message={createFeatureError.message}
                    onClose={clearCreateFeatureError}
                />
            )}
        </main>
    );
}
