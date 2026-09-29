import TooltipButton from "../Tooltip/TooltipButton";
import {ProjectStatusLabel, type ProjectModel} from "../../api/models/project/ProjectModel.ts";
import styles from './ProjectTable.module.scss'
import {ProjectStatus} from "../../api/models/project/ProjectStatus.ts";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";

interface ProjectTableProps {
    projects: ProjectModel[];
    onDelete: (projectId: number) => void;
    onEdit: (project: ProjectModel) => void;
    onOpen: (projectId: number) => void;
}

function getStatusClass(status: ProjectStatus): string {
    switch (status) {
        case ProjectStatus.InProgress:
            return styles.statusInProgress;

        case ProjectStatus.Completed:
            return styles.statusCompleted;

        default:
            return styles.statusUndefined;
    }
}

export default function ProjectTable({projects, onDelete, onEdit, onOpen}: ProjectTableProps) {

    const projectsTable = projects.map(project =>
        <tr key={project.id} onClick={() => onOpen(project.id)}>
        <td>{project.name}</td>
        <td>{project.description}</td>
        <td>
    <span className={`${styles.statusBadge} ${getStatusClass(project.projectStatus)}`}>
        {ProjectStatusLabel[project.projectStatus]}
    </span>
        </td>
        <td>
            <div className={styles.actions}>
                <TooltipButton
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit(project);
                    }}
                    className={`${styles.actionButton} ${styles.editButton}`}
                    aria-label="Редактировать проект"
                >
                    <img src={editIcon} alt=""/>
                </TooltipButton>

                <TooltipButton
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete(project.id);
                    }}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    aria-label="Удалить проект"
                >
                    <img src={deleteIcon} alt=""/>
                </TooltipButton>
            </div>
        </td>
    </tr>)

    return <div className={styles.tableWrapper}>
        <table className={styles.projectsTable}>
            <colgroup>
                <col className={styles.nameColumn}/>
                <col className={styles.descriptionColumn}/>
                <col className={styles.statusColumn}/>
                <col className={styles.actionsColumn}/>
            </colgroup>
            <thead>
            <tr>
                <th>Название</th>
                <th>Краткое описание проекта</th>
                <th>Статус</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {projectsTable}
            </tbody>
        </table>
    </div>;
}

