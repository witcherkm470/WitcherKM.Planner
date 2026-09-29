import TooltipButton from "../Tooltip/TooltipButton.tsx";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import { IdeaStatus } from "../../api/models/idea/IdeaStatus.ts";
import { IdeaStatusLabel, type IdeaModel } from "../../api/models/idea/IdeaModel.ts";
import styles from "./IdeasTable.module.scss";

interface IdeasTableProps {
    ideas: IdeaModel[];
    isBusy: boolean;
    onEdit: (idea: IdeaModel) => void;
    onDelete: (ideaId: number) => void;
    onStatusChange: (ideaId: number, status: IdeaStatus) => void;
}

export default function IdeasTable({ ideas, isBusy, onEdit, onDelete, onStatusChange }: IdeasTableProps) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.ideasTable}>
                <thead><tr><th>Суть</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>
                    {ideas.map(idea => {
                        const isRealized = idea.ideaStatus === IdeaStatus.Realized;

                        return (
                            <tr key={idea.id}>
                                <td>{idea.essence}</td>
                                <td><span className={`${styles.statusBadge} ${styles[`status${idea.ideaStatus}`]}`}>{IdeaStatusLabel[idea.ideaStatus]}</span></td>
                                <td>
                                    <div className={styles.actions}>
                                        {!isRealized && <>
                                            <TooltipButton type="button" aria-label="Редактировать идею" className={`${styles.actionButton} ${styles.editButton}`} disabled={isBusy} onClick={() => onEdit(idea)}><img src={editIcon} alt="" /></TooltipButton>
                                            <TooltipButton type="button" aria-label="Удалить идею" className={`${styles.actionButton} ${styles.deleteButton}`} disabled={isBusy} onClick={() => onDelete(idea.id)}><img src={deleteIcon} alt="" /></TooltipButton>
                                        </>}
                                        {idea.ideaStatus === IdeaStatus.NotRealized && <>
                                            <button type="button" className={`${styles.statusAction} ${styles.realizeAction}`} disabled={isBusy} onClick={() => onStatusChange(idea.id, IdeaStatus.Realized)}>Реализовать</button>
                                            <button type="button" className={`${styles.statusAction} ${styles.cancelAction}`} disabled={isBusy} onClick={() => onStatusChange(idea.id, IdeaStatus.Canceled)}>Отклонить</button>
                                        </>}
                                        {idea.ideaStatus === IdeaStatus.Canceled && <button type="button" className={styles.statusAction} disabled={isBusy} onClick={() => onStatusChange(idea.id, IdeaStatus.NotRealized)}>Вернуть</button>}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {ideas.length === 0 && <tr><td className={styles.empty} colSpan={3}>Идеи отсутствуют</td></tr>}
                </tbody>
            </table>
        </div>
    );
}
