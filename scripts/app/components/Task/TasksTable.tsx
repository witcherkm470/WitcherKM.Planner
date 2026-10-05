import { Link, useNavigate } from "react-router-dom";
import type { TaskStatus } from "../../api/models/task/TaskStatus";
import type { TaskModel } from "../../api/models/task/TaskModel";
import { TaskStatusLabel } from "../../api/models/task/TaskModel";
import TaskActions from "./TaskActions";
import styles from "../Idea/IdeasTable.module.scss";

interface Props { tasks: TaskModel[]; isBusy: boolean; onEdit: (task: TaskModel) => void; onDelete: (id: number) => void; onStatus: (id: number, status: TaskStatus) => void; }
export default function TasksTable({ tasks, isBusy, onEdit, onDelete, onStatus }: Props) {
    const navigate = useNavigate();
    return <div className={styles.tableWrapper}><table className={styles.ideasTable}><thead><tr><th>Название</th><th>Статус</th><th>Действия</th></tr></thead><tbody>
        {tasks.map(task => <tr key={task.id} onClick={() => navigate('/tasks/' + task.id)}><td><Link to={'/tasks/' + task.id} onClick={event => event.stopPropagation()}>{task.name}</Link></td><td><span className={styles.statusBadge}>{TaskStatusLabel[task.taskStatus]}</span></td><td><TaskActions status={task.taskStatus} disabled={isBusy} onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)} onStatus={status => onStatus(task.id, status)} /></td></tr>)}
        {!tasks.length && <tr><td className={styles.empty} colSpan={3}>Задачи отсутствуют</td></tr>}
    </tbody></table></div>;
}
