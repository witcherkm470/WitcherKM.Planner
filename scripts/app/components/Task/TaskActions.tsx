import { TaskStatus } from "../../api/models/task/TaskStatus";
import TooltipButton from "../Tooltip/TooltipButton";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import startIcon from "../../assets/start-icon.svg";
import completeIcon from "../../assets/complete-icon.svg";
import reopenIcon from "../../assets/reopen-icon.svg";
import styles from "../Project/ProjectTable.module.scss";

interface Props { status: TaskStatus; disabled: boolean; onEdit: () => void; onDelete: () => void; onStatus: (status: TaskStatus) => void; }
export default function TaskActions({ status, disabled, onEdit, onDelete, onStatus }: Props) {
    if (status === TaskStatus.Done) return null;
    return <div className={styles.actions} onClick={event => event.stopPropagation()}>
        {status === TaskStatus.Open && <TooltipButton type="button" aria-label="Начать задачу" disabled={disabled} className={styles.actionButton + " " + styles.statusStartButton} onClick={() => onStatus(TaskStatus.InProgress)}><img src={startIcon} alt="" /></TooltipButton>}
        {status === TaskStatus.InProgress && <>
            <TooltipButton type="button" aria-label="Завершить задачу" disabled={disabled} className={styles.actionButton + " " + styles.statusCompleteButton} onClick={() => onStatus(TaskStatus.Done)}><img src={completeIcon} alt="" /></TooltipButton>
            <TooltipButton type="button" aria-label="Вернуть задачу в открытые" disabled={disabled} className={styles.actionButton + " " + styles.statusReopenButton} onClick={() => onStatus(TaskStatus.Open)}><img src={reopenIcon} alt="" /></TooltipButton>
        </>}
        <TooltipButton type="button" aria-label="Редактировать задачу" disabled={disabled} className={styles.actionButton + " " + styles.editButton} onClick={onEdit}><img src={editIcon} alt="" /></TooltipButton>
        <TooltipButton type="button" aria-label="Удалить задачу" disabled={disabled} className={styles.actionButton + " " + styles.deleteButton} onClick={onDelete}><img src={deleteIcon} alt="" /></TooltipButton>
    </div>;
}
