import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addTask, changeTaskStatus, deleteTask, getTask, getTasks, updateTask } from "../../api/apis/task/taskApi.ts";
import type { TaskModel } from "../../api/models/task/TaskModel.ts";
import { TaskStatus } from "../../api/models/task/TaskStatus.ts";
import TasksTable from "../../components/Task/TasksTable.tsx";
import TaskModal from "../../components/Task/TaskModal.tsx";
import { useApiRequest } from "../../hooks/useApiRequest.ts";
import styles from "./TasksPage.module.scss";

export function TasksPage({ featureId }: { featureId?: number }) {
    const [editing, setEditing] = useState<TaskModel | null>(null); const [adding, setAdding] = useState(false); const [filter, setFilter] = useState<TaskStatus | undefined>();
    const { execute: load, data } = useApiRequest(getTasks); const reload = async () => { await load(featureId, filter); };
    const add = useApiRequest(addTask, { onSuccess: async () => { setAdding(false); await reload(); } }); const update = useApiRequest(updateTask, { onSuccess: async () => { setEditing(null); await reload(); } }); const del = useApiRequest(deleteTask, { onSuccess: reload }); const status = useApiRequest(changeTaskStatus, { onSuccess: reload });
    useEffect(() => { void reload(); }, [featureId, filter]);
    return <section className={styles.page}><header className={styles.toolbar}><div className={styles.leftArea}><h1 className={styles.titleBadge}>{featureId === undefined ? "Задачи" : "Задачи фичи"}</h1><div className={styles.filters}><button className={filter === undefined ? styles.filterActive : ""} onClick={() => setFilter(undefined)}>Все</button><button className={filter === TaskStatus.Open ? styles.filterActive : ""} onClick={() => setFilter(TaskStatus.Open)}>Открытые</button><button className={filter === TaskStatus.InProgress ? styles.filterActive : ""} onClick={() => setFilter(TaskStatus.InProgress)}>В работе</button><button className={filter === TaskStatus.Done ? styles.filterActive : ""} onClick={() => setFilter(TaskStatus.Done)}>Готовые</button></div></div><button className={styles.addButton} onClick={() => setAdding(true)}>+ Добавить задачу</button></header><TasksTable tasks={data ?? []} onEdit={setEditing} onDelete={id => void del.execute(id)} onStatus={(taskId, taskStatus) => void status.execute({ taskId, taskStatus })}/>{adding && featureId !== undefined && <TaskModal title="Новая задача" featureId={featureId} onClose={() => setAdding(false)} onSave={x => void add.execute({ name: x.name, description: x.description, featureId })}/>} {editing && <TaskModal title="Редактирование задачи" initial={editing} onClose={() => setEditing(null)} onSave={x => void update.execute({ taskId: editing.id, name: x.name, description: x.description })}/>}</section>;
}

export function TaskCardPage() { const { taskId } = useParams(); const navigate = useNavigate(); const { execute: load, data } = useApiRequest(getTask); useEffect(() => { const id = Number(taskId); if (!Number.isNaN(id)) void load(id); }, [taskId]); if (!data) return <main className={styles.card}>Загрузка задачи...</main>; return <article className={styles.card}><header className={styles.cardHeader}><span>Задача</span><h1>{data.name}</h1></header><div className={styles.cardBody}><section><h2>Описание</h2><p>{data.description || "Описание отсутствует"}</p></section><section className={styles.reference}><h2>Фича</h2><button onClick={() => navigate(`/features/${data.featureId}`)}>{data.featureName}</button></section>{data.projectId && <section className={styles.reference}><h2>Проект</h2><button onClick={() => navigate(`/projects/${data.projectId}`)}>{data.projectName}</button></section>}</div></article>; }
