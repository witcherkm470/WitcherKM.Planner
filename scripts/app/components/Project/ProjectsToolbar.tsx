import { ProjectStatus } from "../../api/models/project/ProjectStatus.ts";
import FilterSelect from "../FilterSelect/FilterSelect.tsx";
import styles from "./ProjectsToolbar.module.scss";

interface ProjectsToolbarProps { onAdd: () => void; status: ProjectStatus | undefined; onStatusChange: (status: ProjectStatus | undefined) => void; }

export default function ProjectsToolbar({ onAdd, status, onStatusChange }: ProjectsToolbarProps) {
    return <div className={styles.toolbar}><div className={styles.leftArea}><div className={styles.titleBadge}>Проекты</div><div className={styles.filtersArea}>
        <span className={styles.filterLabel}>Статус<FilterSelect ariaLabel="Статус проекта" value={status} onChange={onStatusChange} options={[{ value: undefined, label: "Все" }, { value: ProjectStatus.InProgress, label: "В работе" }, { value: ProjectStatus.Completed, label: "Завершённые" }]} /></span>
    </div></div><button type="button" className={styles.addButton} onClick={onAdd}><span className={styles.addIcon}>+</span>Добавить проект</button></div>;
}
