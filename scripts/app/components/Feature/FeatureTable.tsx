import {
    FeatureStatusLabel
} from "../../api/models/feature/FeatureModel.ts";

import type {
    FeatureModel
} from "../../api/models/feature/FeatureModel.ts";

import {
    FeatureStatus
} from "../../api/models/feature/FeatureStatus.ts";

import styles from "./FeatureTable.module.scss";

interface FeatureTableProps {
    features: FeatureModel[];
}

export default function FeatureTable({
                                         features
                                     }: FeatureTableProps) {

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
        <div className={styles.tableWrapper}>
            <table className={styles.featuresTable}>
                <colgroup>
                    <col className={styles.nameColumn} />
                    <col className={styles.descriptionColumn} />
                    <col className={styles.projectColumn} />
                    <col className={styles.statusColumn} />
                </colgroup>

                <thead>
                <tr>
                    <th>
                        Название
                    </th>

                    <th>
                        Краткое описание фичи
                    </th>

                    <th>
                        Проект
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
                            {feature.projectName}
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
                            colSpan={4}
                        >
                            Фичи отсутствуют
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
