import { useFeatureActions } from "../../hooks/useFeatureActions";
import { useEffect, useState } from "react";

import FeatureTable
    from "../../components/Feature/FeatureTable.tsx";

import FeaturesToolbar
    from "../../components/Feature/FeaturesToolbar.tsx";

import CreateFeatureModal
    from "../../components/Modal/Feature/CreateFeatureModal.tsx";

import ErrorModal
    from "../../components/Modal/ErrorModal.tsx";

import {addFeature, getFeatures, getProjectNameAndIds} from "../../api/apis/feature/featureApi.ts";

import {
    useApiRequest
} from "../../hooks/useApiRequest.ts";

import styles from "./FeaturesPage.module.scss";
import { FeatureStatus } from "../../api/models/feature/FeatureStatus.ts";

export default function FeaturesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);
    const [statusFilter, setStatusFilter] = useState<FeatureStatus>();
    const [projectFilter, setProjectFilter] = useState<number>();

    const {
        execute: loadFeatures,
        data: features
    } = useApiRequest(getFeatures);

    const {
        execute: loadProjects,
        data: projects
    } = useApiRequest(getProjectNameAndIds);

    const {
        execute: createFeature,
        error: createFeatureError,
        clearError: clearCreateFeatureError,
        isLoading: isFeatureCreating
    } = useApiRequest(addFeature, {
        onSuccess: async () => {
            setIsCreateModalOpen(false);

            await loadFeatures();
        }
    });

    const featureActions = useFeatureActions(loadFeatures);

    useEffect(() => {
        void loadFeatures();
        void loadProjects();
    }, [
        loadFeatures,
        loadProjects
    ]);

    return (
        <div className={styles.page}>
            <FeaturesToolbar
                onAdd={() =>
                    setIsCreateModalOpen(true)
                }
                status={statusFilter}
                projectId={projectFilter}
                projects={projects ?? []}
                onStatusChange={setStatusFilter}
                onProjectChange={setProjectFilter}
            />

            <FeatureTable onEdit={featureActions.onEdit} onDelete={featureActions.onDelete} onChangeStatus={featureActions.onChangeStatus} isBusy={featureActions.isBusy}
                features={(features ?? []).filter(feature =>
                    (statusFilter === undefined || feature.featureStatus === statusFilter)
                    && (projectFilter === undefined || feature.projectId === projectFilter)
                )}
            />

            {isCreateModalOpen && (
                <CreateFeatureModal
                    projects={projects ?? []}
                    onClose={() =>
                        setIsCreateModalOpen(false)
                    }
                    onSave={(name, description, projectId) =>
                        void createFeature({
                            name,
                            description,
                            projectId
                        })
                    }
                />
            )}

            {isFeatureCreating && (
                <div className={styles.saving}>
                    Создание фичи...
                </div>
            )}

            {featureActions.dialogs}

            {createFeatureError && (
                <ErrorModal
                    message={createFeatureError.message}
                    onClose={clearCreateFeatureError}
                />
            )}
        </div>
    );
}
