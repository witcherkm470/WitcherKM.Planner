import { useState } from "react";
import { deleteFeature, updateFeature } from "../api/apis/feature/featureApi";
import type { ProjectFeaturesModel } from "../api/models/project/ProjectFeaturesModel";
import UpdateFeatureModal from "../components/Modal/Feature/UpdateFeatureModal";
import ErrorModal from "../components/Modal/ErrorModal";
import { useApiRequest } from "./useApiRequest";

export function useFeatureActions(onChanged: () => Promise<void>) {
    const [editingFeature, setEditingFeature] = useState<ProjectFeaturesModel | null>(null);
    const removal = useApiRequest(deleteFeature, { onSuccess: onChanged });
    const update = useApiRequest(updateFeature, {
        onSuccess: async () => {
            setEditingFeature(null);
            await onChanged();
        },
    });

    return {
        onEdit: setEditingFeature,
        onDelete: (id: number) => { void removal.execute(id); },
        isBusy: removal.isLoading || update.isLoading,
        dialogs: <>
            {editingFeature && <UpdateFeatureModal key={editingFeature.id} feature={editingFeature}
                isSaving={update.isLoading} onClose={() => setEditingFeature(null)}
                onSave={(name, description) => {
                    void update.execute({ featureId: editingFeature.id, name, description });
                }} />}
            {removal.error && <ErrorModal message={removal.error.message} onClose={removal.clearError} />}
            {update.error && <ErrorModal message={update.error.message} onClose={update.clearError} />}
        </>,
    };
}