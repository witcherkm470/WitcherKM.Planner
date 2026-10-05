import { useId } from "react";
import ModalFrame from "./ModalFrame";
import styles from "./ErrorModal.module.scss";
interface Props { message: string; onClose: () => void; title?: string; }
export default function ErrorModal({ message, onClose, title = "Ошибка" }: Props) {
    const titleId = useId();
    return <ModalFrame titleId={titleId} onClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
        <header className={styles.header}><h2 id={titleId}>{title}</h2><button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">×</button></header><div className={styles.body}><p>{message}</p></div>
    </ModalFrame>;
}
