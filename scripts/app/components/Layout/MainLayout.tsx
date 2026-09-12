import { useState } from "react";
import {
    NavLink,
    Outlet
} from "react-router-dom";

import styles from "./MainLayout.module.scss";

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] =
        useState(true);

    return (
        <div className={styles.layout}>
            <aside
                className={`
                    ${styles.sidebar}
                    ${
                    isSidebarOpen
                        ? styles.sidebarOpen
                        : styles.sidebarClosed
                }
                `}
            >
                <div
                    className={`
                        ${styles.sidebarContent}
                        ${
                        isSidebarOpen
                            ? styles.sidebarContentVisible
                            : styles.sidebarContentHidden
                    }
                    `}
                >
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
                                ◈
                            </span>

                            <span>
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
                                ✦
                            </span>

                            <span>
                                Фичи
                            </span>
                        </NavLink>
                    </nav>
                </div>

                <button
                    type="button"
                    className={styles.sidebarToggle}
                    onClick={() =>
                        setIsSidebarOpen(current => !current)
                    }
                    aria-label={
                        isSidebarOpen
                            ? "Скрыть навигацию"
                            : "Показать навигацию"
                    }
                    title={
                        isSidebarOpen
                            ? "Скрыть навигацию"
                            : "Показать навигацию"
                    }
                >
                    <span
                        className={`
                            ${styles.toggleArrow}
                            ${
                            isSidebarOpen
                                ? styles.toggleArrowLeft
                                : styles.toggleArrowRight
                        }
                        `}
                    />
                </button>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
