import {ProjectStatusLabel, type ProjectModel} from "../../api/models/project/ProjectModel.ts";
import styles from './ProjectTable.module.scss'

interface ProjectTableProps {
    projects: ProjectModel[];
    onDelete: (projectId: number) => void;
}

export default function RenderProjectTable({projects, onDelete} : ProjectTableProps) {

    const projectsTable = projects.map(project => <tr key={project.id}>
        <td>{project.id}</td>
        <td>{project.name}</td>
        <td>{project.description}</td>
        <td>{ProjectStatusLabel[project.projectStatus]}</td>
        <td>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.actionButton} ${styles.editButton}`}
                    aria-label="Редактировать проект"
                >
                    <img src="app/assets/magic-edit.svg" alt="edit project" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(project.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    aria-label="Удалить проект"
                >
                    <img src="app/assets/magic-delete.svg" alt="delete project" />
                </button>
            </div>
        </td>
    </tr>)

    return <div className={styles.tableWrapper}><table className={styles.projectsTable}>
        <colgroup>
            <col className={styles.idColumn} />
            <col className={styles.nameColumn} />
            <col className={styles.descriptionColumn} />
            <col className={styles.statusColumn} />
            <col className={styles.actionsColumn} />
        </colgroup>
        <thead>
        <tr>
            <th>Id</th>
            <th>Название</th>
            <th>Краткое описание проекта</th>
            <th>Статус</th>
            <th>Действия</th>
        </tr>
        </thead>
        <tbody>
            {projectsTable}
        </tbody>
    </table></div>;
}

