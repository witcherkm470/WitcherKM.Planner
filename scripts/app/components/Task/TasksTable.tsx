import { useNavigate } from "react-router-dom";
import { TaskStatus } from "../../api/models/task/TaskStatus.ts";
import type { TaskModel } from "../../api/models/task/TaskModel.ts";
import TooltipButton from "../Tooltip/TooltipButton.tsx";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import startIcon from "../../assets/start-icon.svg";
import completeIcon from "../../assets/complete-icon.svg";
import reopenIcon from "../../assets/reopen-icon.svg";
import tableStyles from "../Idea/IdeasTable.module.scss";
import actionStyles from "../Project/ProjectTable.module.scss";

const labels: Record<TaskStatus, string> = { [TaskStatus.Undefined]: "Не определён", [TaskStatus.Open]: "Открыта", [TaskStatus.InProgress]: "В работе", [TaskStatus.Done]: "Готова" };

interface Props { tasks: TaskModel[]; onEdit: (task: TaskModel) => void; onDelete: (id: number) => void; onStatus: (id: number, status: TaskStatus) => void; }

export default function TasksTable({ tasks, onEdit, onDelete, onStatus }: Props) {
    const navigate = useNavigate();
    return <div className={tableStyles.tableWrapper}><table className={tableStyles.ideasTable}><thead><tr><th>Название</th><th>Статус</th><th>Действия</th></tr></thead><tbody>
        {tasks.map(task => <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)}><td>{task.name}</td><td><span className={tableStyles.statusBadge}>{labels[task.taskStatus]}</span></td><td onClick={event => event.stopPropagation()}><div className={actionStyles.actions}>
            {task.taskStatus === TaskStatus.Open && <TooltipButton type="button" aria-label="Начать задачу" className={`${actionStyles.actionButton} ${actionStyles.statusStartButton}`} onClick={() => onStatus(task.id, TaskStatus.InProgress)}><img src={startIcon} alt="" /></TooltipButton>}
            {task.taskStatus === TaskStatus.InProgress && <><TooltipButton type="button" aria-label="Завершить задачу" className={`${actionStyles.actionButton} ${actionStyles.statusCompleteButton}`} onClick={() => onStatus(task.id, TaskStatus.Done)}><img src={completeIcon} alt="" /></TooltipButton><TooltipButton type="button" aria-label="Вернуть задачу в открытые" className={`${actionStyles.actionButton} ${actionStyles.statusReopenButton}`} onClick={() => onStatus(task.id, TaskStatus.Open)}><img src={reopenIcon} alt="" /></TooltipButton></>}
            {task.taskStatus !== TaskStatus.Done && <><TooltipButton type="button" aria-label="Редактировать задачу" className={`${actionStyles.actionButton} ${actionStyles.editButton}`} onClick={() => onEdit(task)}><img src={editIcon} alt="" /></TooltipButton><TooltipButton type="button" aria-label="Удалить задачу" className={`${actionStyles.actionButton} ${actionStyles.deleteButton}`} onClick={() => onDelete(task.id)}><img src={deleteIcon} alt="" /></TooltipButton></>}
        </div></td></tr>)}
        {!tasks.length && <tr><td className={tableStyles.empty} colSpan={3}>Задачи отсутствуют</td></tr>}
    </tbody></table></div>;
}
