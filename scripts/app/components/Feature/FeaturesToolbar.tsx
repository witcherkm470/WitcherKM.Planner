import styles from "./FeaturesToolbar.module.scss";

interface FeaturesToolbarProps {
    onAdd: () => void;
}

export default function FeaturesToolbar({
                                            onAdd
                                        }: FeaturesToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.leftArea}>
                <div className={styles.titleBadge}>
                    Фичи
                </div>

                <div className={styles.filtersArea}>
                    {/* Здесь позже будут фильтры */}
                </div>
            </div>

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
        </div>
    );
}
