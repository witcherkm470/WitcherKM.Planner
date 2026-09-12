import { FeatureStatus } from "../../api/models/feature/FeatureStatus.ts";
import { FeatureStatusLabel } from "../../api/models/feature/FeatureModel.ts";

import type {
    ProjectFeaturesModel
} from "../../api/models/project/ProjectFeaturesModel.ts";

import styles from "./ProjectFeaturesTable.module.scss";

interface ProjectFeaturesTableProps {
    features: ProjectFeaturesModel[];
    onAdd: () => void;
}

export default function ProjectFeaturesTable({
                                                 features,
                                                 onAdd
                                             }: ProjectFeaturesTableProps) {

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
                        <col className={styles.statusColumn} />
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
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {features.map(feature => (
                        <tr key={feature.id}>
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
                        </tr>
                    ))}

                    {features.length === 0 && (
                        <tr>
                            <td
                                className={styles.empty}
                                colSpan={3}
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
