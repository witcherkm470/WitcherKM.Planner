import FeatureActions from "../Feature/FeatureActions";
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
    onEdit: (feature: FeatureModel) => void;
    onDelete: (id: number) => void;
    isBusy: boolean;
}

export default function FeatureTable({ onEdit, onDelete, isBusy, features
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
                    <col className={styles.statusColumn} /><col className={styles.actionsColumn} />
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
                    </th><th>Действия</th>
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
                    <td><FeatureActions disabled={isBusy} onEdit={() => onEdit(feature)} onDelete={() => onDelete(feature.id)} /></td></tr>
                ))}

                {features.length === 0 && (
                    <tr>
                        <td
                            className={styles.empty}
                            colSpan={5}
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
