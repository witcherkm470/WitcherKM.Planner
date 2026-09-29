import { NavLink, Outlet } from "react-router-dom";

import ProjectsIcon from "../../assets/projects-icon.svg";
import FeaturesIcon from "../../assets/features-icon.svg";
import IdeadIcon from "../../assets/idea-icon.svg";
import TaskIcon from "../../assets/task-icon.svg";
import styles from "./MainLayout.module.scss";

const destinations = [
    { to: "/projects", label: "Проекты", icon: ProjectsIcon },
    { to: "/features", label: "Фичи", icon: FeaturesIcon },
    { to: "/tasks", label: "Задачи", icon: TaskIcon },
    { to: "/ideas", label: "Идеи", icon: IdeadIcon },
];

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <nav className={styles.navigation} aria-label="Основная навигация">
                    {destinations.map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            aria-label={label}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                            }
                        >
                            <span className={styles.navText} aria-hidden="true">{label}</span>
                            <span className={styles.navIcon} aria-hidden="true">
                                <img className={styles.iconBase} src={icon} alt="" />
                                <img className={styles.iconFill} src={icon} alt="" />
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
