import { useState } from "react";
import type { FeatureModel } from "../../api/models/feature/FeatureModel";
import ModalFrame from "../Modal/ModalFrame";
import FilterSelect from "../FilterSelect/FilterSelect";
import styles from "../Modal/Project/CreateProjectModal.module.scss";

interface Props {
    title: string;
    initial?: { name: string; description: string | null };
    featureId?: number;
    features?: FeatureModel[];
    isSaving: boolean;
    isLoadingFeatures?: boolean;
    onClose: () => void;
    onSave: (values: { name: string; description: string; featureId?: number }) => void;
}
export default function TaskModal({ title, initial, featureId, features = [], isSaving, isLoadingFeatures = false, onClose, onSave }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [selectedFeatureId, setSelectedFeatureId] = useState<number>();
    const needsParent = !initial && featureId === undefined;
    const parentId = featureId ?? selectedFeatureId;
    const canSave = !!name.trim() && !isSaving && (!needsParent || features.some(feature => feature.id === parentId));

    return <ModalFrame titleId="task-modal-title" onClose={onClose} isBusy={isSaving}>
        <header className={styles.header}><h2 id="task-modal-title">{title}</h2><button type="button" className={styles.closeButton} onClick={onClose} disabled={isSaving} aria-label="Закрыть">×</button></header>
        <div className={styles.body}>
            <div className={styles.formGroup}><label htmlFor="task-name">Название</label><input id="task-name" value={name} disabled={isSaving} onChange={event => setName(event.target.value)} /></div>
            <div className={styles.formGroup}><label htmlFor="task-description">Описание</label><textarea id="task-description" value={description} disabled={isSaving} onChange={event => setDescription(event.target.value)} /></div>
            {needsParent && <div className={styles.formGroup}><span>Фича</span>{isLoadingFeatures ? <p>Загрузка фич...</p> : features.length === 0 ? <p>Сначала создайте фичу, чтобы добавить задачу.</p> : <FilterSelect inlineMenu ariaLabel="Фича" disabled={isSaving} value={selectedFeatureId} onChange={setSelectedFeatureId} options={[{ value: undefined, label: "Выберите фичу" }, ...features.map(feature => ({ value: feature.id, label: feature.projectName + " · " + feature.name }))]} />}</div>}
        </div>
        <footer className={styles.footer}><button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSaving}>Отмена</button><button type="button" className={styles.saveButton} disabled={!canSave} onClick={() => { if (canSave) onSave({ name, description, featureId: parentId }); }}>{isSaving ? "Сохранение..." : "Сохранить"}</button></footer>
    </ModalFrame>;
}
