import { FeatureStatus } from "../../api/models/feature/FeatureStatus.ts";
import type { ProjectNameIdModel } from "../../api/models/project/ProjectNameIdModel.ts";
import FilterSelect from "../FilterSelect/FilterSelect.tsx";
import styles from "./FeaturesToolbar.module.scss";

interface FeaturesToolbarProps {
    onAdd: () => void;
    status: FeatureStatus | undefined;
    projectId: number | undefined;
    projects: ProjectNameIdModel[];
    onStatusChange: (status: FeatureStatus | undefined) => void;
    onProjectChange: (projectId: number | undefined) => void;
}

export default function FeaturesToolbar({ onAdd, status, projectId, projects, onStatusChange, onProjectChange }: FeaturesToolbarProps) {
    return <div className={styles.toolbar}><div className={styles.leftArea}><div className={styles.titleBadge}>Фичи</div><div className={styles.filtersArea}>
        <span className={styles.filterLabel}>Статус<FilterSelect ariaLabel="Статус фичи" value={status} onChange={onStatusChange} options={[{ value: undefined, label: "Все" }, { value: FeatureStatus.Opened, label: "Открытые" }, { value: FeatureStatus.InProgress, label: "В работе" }, { value: FeatureStatus.Completed, label: "Завершённые" }]} /></span>
        <span className={styles.filterLabel}>Проект<FilterSelect ariaLabel="Проект" value={projectId} onChange={onProjectChange} options={[{ value: undefined, label: "Все" }, ...projects.map(project => ({ value: project.id, label: project.name }))]} /></span>
    </div></div><button type="button" className={styles.addButton} onClick={onAdd}><span className={styles.addIcon}>+</span>Добавить фичу</button></div>;
}
