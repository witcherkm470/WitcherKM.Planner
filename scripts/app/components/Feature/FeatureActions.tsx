import TooltipButton from "../Tooltip/TooltipButton";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import styles from "../Project/ProjectTable.module.scss";
import { FeatureStatus } from "../../api/models/feature/FeatureStatus";
import startIcon from "../../assets/start-icon.svg";
import completeIcon from "../../assets/complete-icon.svg";
import reopenIcon from "../../assets/reopen-icon.svg";

interface Props {
    onEdit: () => void;
    onDelete: () => void;
    onChangeStatus: (status: FeatureStatus) => void;
    status: FeatureStatus;
    disabled: boolean;
}

export default function FeatureActions({ onEdit, onDelete, onChangeStatus, status, disabled }: Props) {
    if (status === FeatureStatus.Completed) return null;

    return <div className={styles.actions} onClick={event => event.stopPropagation()}>
        {status === FeatureStatus.Opened && <TooltipButton type="button" aria-label="Начать фичу" disabled={disabled}
            className={`${styles.actionButton} ${styles.statusStartButton}`} onClick={() => onChangeStatus(FeatureStatus.InProgress)}><img src={startIcon} alt="" /></TooltipButton>}
        {status === FeatureStatus.InProgress && <>
            <TooltipButton type="button" aria-label="Завершить фичу" disabled={disabled}
                className={`${styles.actionButton} ${styles.statusCompleteButton}`} onClick={() => onChangeStatus(FeatureStatus.Completed)}><img src={completeIcon} alt="" /></TooltipButton>
            <TooltipButton type="button" aria-label="Вернуть в открытые" disabled={disabled}
                className={`${styles.actionButton} ${styles.statusReopenButton}`} onClick={() => onChangeStatus(FeatureStatus.Opened)}><img src={reopenIcon} alt="" /></TooltipButton>
        </>}
        <TooltipButton type="button" aria-label="Редактировать фичу" disabled={disabled}
            className={`${styles.actionButton} ${styles.editButton}`} onClick={onEdit}>
            <img src={editIcon} alt="" />
        </TooltipButton>
        <TooltipButton type="button" aria-label="Удалить фичу" disabled={disabled}
            className={`${styles.actionButton} ${styles.deleteButton}`} onClick={onDelete}>
            <img src={deleteIcon} alt="" />
        </TooltipButton>
    </div>;
}
