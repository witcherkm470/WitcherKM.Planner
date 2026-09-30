import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFeatures } from "../../api/apis/feature/featureApi.ts";
import { getTasks } from "../../api/apis/task/taskApi.ts";
import { FeatureStatusLabel } from "../../api/models/feature/FeatureModel.ts";
import { TaskStatus } from "../../api/models/task/TaskStatus.ts";
import FeatureActions from "../../components/Feature/FeatureActions.tsx";
import { useApiRequest } from "../../hooks/useApiRequest.ts";
import { useFeatureActions } from "../../hooks/useFeatureActions.tsx";
import { TasksPage } from "../task/TasksPage.tsx";
import styles from "./FeaturePage.module.scss";

export default function FeaturePage() {
    const { featureId } = useParams();
    const id = Number(featureId);
    const { execute: loadFeatures, data: features } = useApiRequest(getFeatures);
    const { execute: loadOpenTasks, data: openTasks } = useApiRequest(getTasks);
    const reload = useCallback(async () => {
        if (Number.isNaN(id)) return;
        await Promise.all([loadFeatures(), loadOpenTasks(id, TaskStatus.Open)]);
    }, [id, loadFeatures, loadOpenTasks]);
    const actions = useFeatureActions(reload);

    useEffect(() => { void reload(); }, [reload]);

    const feature = features?.find(item => item.id === id);
    if (!feature) return <main className={styles.loading}>Загрузка фичи...</main>;

    return <main className={styles.page}>
        <article className={styles.card}>
            <header className={styles.header}><div className={styles.titleArea}><span className={styles.caption}>Фича · {feature.projectName}</span><h1>{feature.name}</h1></div>
                <div className={styles.headerCenter}><span className={styles.openTaskCountBadge}>Открытых задач: {openTasks?.length ?? 0}</span></div>
                <div className={styles.headerActions}><span className={`${styles.statusBadge} ${feature.featureStatus === 1 ? styles.statusOpened : feature.featureStatus === 2 ? styles.statusInProgress : styles.statusCompleted}`}>{FeatureStatusLabel[feature.featureStatus]}</span><FeatureActions status={feature.featureStatus} disabled={actions.isBusy} onChangeStatus={status => actions.onChangeStatus(feature.id, status)} onEdit={() => actions.onEdit(feature)} onDelete={() => actions.onDelete(feature.id)} /></div>
            </header>
            <div className={styles.body}><h2>Описание</h2><p>{feature.description || "Описание отсутствует"}</p></div>
        </article>
        <TasksPage featureId={feature.id} />
        {actions.dialogs}
    </main>;
}
