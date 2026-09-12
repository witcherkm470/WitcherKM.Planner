import styles from "./ProjectsToolbar.module.scss";

interface ProjectsToolbarProps {
    onAdd: () => void;
}

export default function ProjectsToolbar({onAdd}: ProjectsToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.filtersArea}>
            </div>

            <button
                type="button"
                className={styles.addButton}
                onClick={onAdd}
            >
                <span className={styles.addIcon}>+</span>

                Добавить проект
            </button>
        </div>
    );
}
