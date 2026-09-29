import styles from "./IdeasToolbar.module.scss";

interface IdeasToolbarProps {
    showCanceled: boolean;
    onFilterChange: (showCanceled: boolean) => void;
    onAdd: () => void;
}

export default function IdeasToolbar({ showCanceled, onFilterChange, onAdd }: IdeasToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.leftArea}>
                <div className={styles.titleBadge}>Идеи</div>
                <div className={styles.filter} role="group" aria-label="Фильтр идей">
                    <button type="button" className={!showCanceled ? styles.filterActive : ""} onClick={() => onFilterChange(false)}>Активные</button>
                    <button type="button" className={showCanceled ? styles.filterActive : ""} onClick={() => onFilterChange(true)}>Отклонённые</button>
                </div>
            </div>
            <button type="button" className={styles.addButton} onClick={onAdd}><span className={styles.addIcon}>+</span>Добавить идею</button>
        </div>
    );
}
