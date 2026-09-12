import {
    NavLink,
    Outlet
} from "react-router-dom";

import ProjectsIcon from "../../assets/projects-icon.svg";
import FeaturesIcon from "../../assets/features-icon.svg";

import styles from "./MainLayout.module.scss";

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <nav className={styles.navigation}>
                    <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                            `${styles.navItem} ${
                                isActive
                                    ? styles.navItemActive
                                    : ""
                            }`
                        }
                    >
                        <span className={styles.navIcon}>
                            <img
                                src={ProjectsIcon}
                                alt=""
                            />
                        </span>

                        <span className={styles.navText}>
                            Проекты
                        </span>
                    </NavLink>

                    <NavLink
                        to="/features"
                        className={({ isActive }) =>
                            `${styles.navItem} ${
                                isActive
                                    ? styles.navItemActive
                                    : ""
                            }`
                        }
                    >
                        <span className={styles.navIcon}>
                            <img
                                src={FeaturesIcon}
                                alt=""
                            />
                        </span>

                        <span className={styles.navText}>
                            Фичи
                        </span>
                    </NavLink>
                </nav>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
