import { useState } from "react";
import { changeTaskStatus, deleteTask, updateTask } from "../api/apis/task/taskApi";
import type { TaskModel } from "../api/models/task/TaskModel";
import type { TaskStatus } from "../api/models/task/TaskStatus";
import TaskModal from "../components/Task/TaskModal";
import ErrorModal from "../components/Modal/ErrorModal";
import { useApiRequest } from "./useApiRequest";

export function useTaskActions(onChanged: () => Promise<void>, onDeleted?: () => void) {
    const [editing, setEditing] = useState<TaskModel | null>(null);
    const update = useApiRequest(updateTask, { onSuccess: async () => { setEditing(null); await onChanged(); } });
    const removal = useApiRequest(deleteTask, { onSuccess: async () => { if (onDeleted) onDeleted(); else await onChanged(); } });
    const status = useApiRequest(changeTaskStatus, { onSuccess: onChanged });
    return {
        onEdit: setEditing,
        onDelete: (id: number) => { void removal.execute(id); },
        onStatus: (taskId: number, taskStatus: TaskStatus) => { void status.execute({ taskId, taskStatus }); },
        isBusy: update.isLoading || removal.isLoading || status.isLoading,
        dialogs: <>
            {editing && <TaskModal key={editing.id} title="Редактирование задачи" initial={editing} isSaving={update.isLoading} onClose={() => setEditing(null)} onSave={values => void update.execute({ taskId: editing.id, name: values.name, description: values.description })} />}
            {update.error && <ErrorModal message={update.error.message} onClose={update.clearError} />}
            {removal.error && <ErrorModal message={removal.error.message} onClose={removal.clearError} />}
            {status.error && <ErrorModal message={status.error.message} onClose={status.clearError} />}
        </>,
    };
}
