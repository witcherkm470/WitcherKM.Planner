import FeatureActions from "../Feature/FeatureActions";
import { FeatureStatus } from "../../api/models/feature/FeatureStatus.ts";
import { FeatureStatusLabel } from "../../api/models/feature/FeatureModel.ts";

import type {
    ProjectFeaturesModel
} from "../../api/models/project/ProjectFeaturesModel.ts";

import styles from "./ProjectFeaturesTable.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FilterSelect from "../FilterSelect/FilterSelect.tsx";

interface ProjectFeaturesTableProps {
    features: ProjectFeaturesModel[];
    onEdit: (feature: ProjectFeaturesModel) => void;
    onDelete: (id: number) => void;
    isBusy: boolean;
    onAdd: () => void;
    onChangeStatus: (id: number, status: FeatureStatus) => void;
}

export default function ProjectFeaturesTable({ onEdit, onDelete, onChangeStatus, isBusy, features,
                                                 onAdd
                                             }: ProjectFeaturesTableProps) {

    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<FeatureStatus>();
    const visibleFeatures = features.filter(feature => statusFilter === undefined || feature.featureStatus === statusFilter);
    function getStatusClass(
        status: FeatureStatus
    ): string {
        switch (status) {
            case FeatureStatus.Opened:
                return styles.statusOpened;

            case FeatureStatus.InProgress:
                return styles.statusInProgress;

            case FeatureStatus.Completed:
                return styles.statusCompleted;

            default:
                return styles.statusUndefined;
        }
    }

    return (
        <section className={styles.block}>
            <header className={styles.header}>
                <h2>
                    Фичи проекта
                </h2>

                <div className={styles.headerActions}>
                    <span className={styles.filterLabel}>Статус<FilterSelect tone="dark" ariaLabel="Статус фичи проекта" value={statusFilter} onChange={setStatusFilter} options={[{ value: undefined, label: "Все" }, { value: FeatureStatus.Opened, label: "Открытые" }, { value: FeatureStatus.InProgress, label: "В работе" }, { value: FeatureStatus.Completed, label: "Завершённые" }]} /></span>
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={onAdd}
                    >
                        <span className={styles.addIcon}>
                            +
                        </span>

                        Добавить фичу
                    </button>
                    <span className={styles.count}>
                        {features.length}
                    </span>
                </div>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <colgroup>
                        <col className={styles.nameColumn} />
                        <col className={styles.descriptionColumn} />
                        <col className={styles.statusColumn} /><col className={styles.actionsColumn} />
                    </colgroup>

                    <thead>
                    <tr>
                        <th>
                            Название
                        </th>

                        <th>
                            Краткое описание
                        </th>

                        <th>
                            Статус
                        </th><th>Действия</th>
                    </tr>
                    </thead>

                    <tbody>
                    {visibleFeatures.map(feature => (
                        <tr key={feature.id} onClick={() => navigate(`/features/${feature.id}`)}>
                            <td>
                                {feature.name}
                            </td>

                            <td>
                                {
                                    feature.description ||
                                    "Описание отсутствует"
                                }
                            </td>

                            <td>
                                    <span
                                        className={`
                                            ${styles.statusBadge}
                                            ${getStatusClass(
                                            feature.featureStatus
                                        )}
                                        `}
                                    >
                                        {
                                            FeatureStatusLabel[
                                                feature.featureStatus
                                                ]
                                        }
                                    </span>
                            </td>
                        <td><FeatureActions disabled={isBusy} status={feature.featureStatus} onChangeStatus={status => onChangeStatus(feature.id, status)} onEdit={() => onEdit(feature)} onDelete={() => onDelete(feature.id)} /></td></tr>
                    ))}

                    {visibleFeatures.length === 0 && (
                        <tr>
                            <td
                                className={styles.empty}
                                colSpan={4}
                            >
                                В проекте пока нет фич
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
