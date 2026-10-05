import ModalFrame from "./ModalFrame";
import styles from "./ErrorModal.module.scss";
interface Props { message: string; onClose: () => void; title?: string; }
export default function ErrorModal({ message, onClose, title = "Ошибка" }: Props) {
    return <ModalFrame titleId="error-modal-title" onClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
        <header className={styles.header}><h2 id="error-modal-title">{title}</h2><button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">×</button></header><div className={styles.body}><p>{message}</p></div>
    </ModalFrame>;
}
