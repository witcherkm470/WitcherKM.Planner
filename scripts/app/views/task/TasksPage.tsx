import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addTask, getTask, getTasks } from "../../api/apis/task/taskApi";
import { getFeatures } from "../../api/apis/feature/featureApi";
import { TaskStatus } from "../../api/models/task/TaskStatus";
import { TaskStatusLabel } from "../../api/models/task/TaskModel";
import TasksTable from "../../components/Task/TasksTable";
import TaskActions from "../../components/Task/TaskActions";
import TaskModal from "../../components/Task/TaskModal";
import FilterSelect from "../../components/FilterSelect/FilterSelect";
import ErrorModal from "../../components/Modal/ErrorModal";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useTaskActions } from "../../hooks/useTaskActions";
import styles from "./TasksPage.module.scss";

export function TasksPage({ featureId, onChanged }: { featureId?: number; onChanged?: () => Promise<void> }) {
    const [adding, setAdding] = useState(false);
    const [filter, setFilter] = useState<TaskStatus>();
    const { execute: load, data, error, clearError, isLoading } = useApiRequest(getTasks);
    const choices = useApiRequest(getFeatures);
    const reload = useCallback(async () => { await load(featureId, filter); }, [load, featureId, filter]);
    const changed = async () => { await reload(); await onChanged?.(); };
    const add = useApiRequest(addTask, { onSuccess: async () => { setAdding(false); await changed(); } });
    const actions = useTaskActions(changed);
    useEffect(() => { void reload(); }, [reload]);
    const isBusy = isLoading || add.isLoading || actions.isBusy;

    return <section className={styles.page}>
        <header className={styles.toolbar}><div className={styles.leftArea}><h1 className={styles.titleBadge}>{featureId === undefined ? "Задачи" : "Задачи фичи"}</h1>
            <FilterSelect ariaLabel="Статус задачи" value={filter} onChange={setFilter} options={[{ value: undefined, label: "Все" }, { value: TaskStatus.Open, label: "Открытые" }, { value: TaskStatus.InProgress, label: "В работе" }, { value: TaskStatus.Done, label: "Готовые" }]} />
        </div><button type="button" className={styles.addButton} disabled={add.isLoading} onClick={() => { setAdding(true); if (featureId === undefined) void choices.execute(); }}>+ Добавить задачу</button></header>
        {isLoading && !data && <p>Загрузка задач...</p>}
        <TasksTable tasks={data ?? []} isBusy={isBusy} onEdit={actions.onEdit} onDelete={actions.onDelete} onStatus={actions.onStatus} />
        {adding && <TaskModal title="Новая задача" featureId={featureId} features={choices.data ?? []} isLoadingFeatures={choices.isLoading} isSaving={add.isLoading} onClose={() => setAdding(false)} onSave={values => { if (values.featureId !== undefined) void add.execute({ name: values.name, description: values.description, featureId: values.featureId }); }} />}
        {actions.dialogs}
        {error && <ErrorModal message={error.message} onClose={clearError} />}
        {choices.error && <ErrorModal message={choices.error.message} onClose={choices.clearError} />}
        {add.error && <ErrorModal message={add.error.message} onClose={add.clearError} />}
    </section>;
}

export function TaskCardPage() {
    const { taskId } = useParams();
    return <TaskCardPageContent key={taskId} />;
}

function TaskCardPageContent() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { execute: load, data, error, clearError, isLoading } = useApiRequest(getTask);
    const id = Number(taskId);
    const validId = Number.isSafeInteger(id) && id > 0;
    const reload = useCallback(async () => { if (validId) await load(id); }, [validId, id, load]);
    const actions = useTaskActions(reload, () => navigate("/tasks"));
    useEffect(() => { void reload(); }, [reload]);
    return <main>
        {data && validId && data.id === id ? <article className={styles.card}>
            <header className={styles.cardHeader}><div><span>Задача</span><h1>{data.name}</h1></div><div className={styles.headerActions}><span className={styles.statusBadge}>{TaskStatusLabel[data.taskStatus]}</span><TaskActions status={data.taskStatus} disabled={isLoading || actions.isBusy} onEdit={() => actions.onEdit(data)} onDelete={() => actions.onDelete(data.id)} onStatus={status => actions.onStatus(data.id, status)} /></div></header>
            <div className={styles.cardBody}><section><h2>Описание</h2><p>{data.description || "Описание отсутствует"}</p></section><section className={styles.reference}><h2>Фича</h2><Link to={'/features/' + data.featureId}>{data.featureName}</Link></section><section className={styles.reference}><h2>Проект</h2><Link to={'/projects/' + data.projectId}>{data.projectName}</Link></section></div>
        </article> : <p>{isLoading ? "Загрузка задачи..." : "Задача недоступна"}</p>}
        {actions.dialogs}
        {error && <ErrorModal message={error.message} onClose={clearError} />}
    </main>;
}
