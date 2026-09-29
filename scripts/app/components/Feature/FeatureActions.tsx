import TooltipButton from "../Tooltip/TooltipButton";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import styles from "../Project/ProjectTable.module.scss";

interface Props {
    onEdit: () => void;
    onDelete: () => void;
    disabled: boolean;
}

export default function FeatureActions({ onEdit, onDelete, disabled }: Props) {
    return <div className={styles.actions}>
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