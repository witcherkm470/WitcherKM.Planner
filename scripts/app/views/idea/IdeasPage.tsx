import { useEffect, useState } from "react";
import { addIdea, changeIdeaStatus, deleteIdea, getIdeas, updateIdea } from "../../api/apis/idea/ideaApi.ts";
import type { IdeaModel } from "../../api/models/idea/IdeaModel.ts";
import type { IdeaStatus } from "../../api/models/idea/IdeaStatus.ts";
import IdeasToolbar from "../../components/Idea/IdeasToolbar.tsx";
import IdeasTable from "../../components/Idea/IdeasTable.tsx";
import IdeaModal from "../../components/Modal/Idea/IdeaModal.tsx";
import ErrorModal from "../../components/Modal/ErrorModal.tsx";
import { useApiRequest } from "../../hooks/useApiRequest.ts";
import styles from "./IdeasPage.module.scss";

export default function IdeasPage() {
    const [showCanceled, setShowCanceled] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingIdea, setEditingIdea] = useState<IdeaModel | null>(null);
    const { execute: loadIdeas, data: ideas, error: loadError, clearError: clearLoadError, isLoading: isLoadingIdeas } = useApiRequest(getIdeas);

    const reload = async () => { await loadIdeas(showCanceled); };
    const create = useApiRequest(addIdea, { onSuccess: async () => { setIsCreateOpen(false); await reload(); } });
    const update = useApiRequest(updateIdea, { onSuccess: async () => { setEditingIdea(null); await reload(); } });
    const remove = useApiRequest(deleteIdea, { onSuccess: reload });
    const status = useApiRequest(changeIdeaStatus, { onSuccess: reload });

    useEffect(() => { void loadIdeas(showCanceled); }, [loadIdeas, showCanceled]);

    const isBusy = isLoadingIdeas || create.isLoading || update.isLoading || remove.isLoading || status.isLoading;

    return (
        <div className={styles.page}>
            <IdeasToolbar showCanceled={showCanceled} onFilterChange={setShowCanceled} onAdd={() => setIsCreateOpen(true)} />
            <IdeasTable ideas={ideas ?? []} isBusy={isBusy} onEdit={setEditingIdea} onDelete={ideaId => void remove.execute(ideaId)} onStatusChange={(ideaId, ideaStatus: IdeaStatus) => void status.execute({ ideaId, ideaStatus })} />
            {isCreateOpen && <IdeaModal title="Новая идея" isSaving={create.isLoading} onClose={() => setIsCreateOpen(false)} onSave={essence => void create.execute({ essence })} />}
            {editingIdea && <IdeaModal key={editingIdea.id} title="Редактирование идеи" initialEssence={editingIdea.essence} isSaving={update.isLoading} onClose={() => setEditingIdea(null)} onSave={essence => void update.execute({ ideaId: editingIdea.id, essence })} />}
            {loadError && <ErrorModal message={loadError.message} onClose={clearLoadError} />}
            {create.error && <ErrorModal message={create.error.message} onClose={create.clearError} />}
            {update.error && <ErrorModal message={update.error.message} onClose={update.clearError} />}
            {remove.error && <ErrorModal message={remove.error.message} onClose={remove.clearError} />}
            {status.error && <ErrorModal message={status.error.message} onClose={status.clearError} />}
        </div>
    );
}
