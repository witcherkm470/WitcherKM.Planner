import {
    useEffect,
    useRef,
    useState
} from "react";

import { createPortal } from "react-dom";

import type {
    ProjectNameIdModel
} from "../../api/models/project/ProjectNameIdModel.ts";

import styles from "./ProjectSelect.module.scss";

interface ProjectSelectProps {
    projects: ProjectNameIdModel[];

    value: number | null;

    onChange: (projectId: number) => void;
}

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
}

export default function ProjectSelect({
                                          projects,
                                          value,
                                          onChange
                                      }: ProjectSelectProps) {
    const [isOpen, setIsOpen] =
        useState(false);

    const [dropdownPosition, setDropdownPosition] =
        useState<DropdownPosition>({
            top: 0,
            left: 0,
            width: 0
        });

    const selectRef =
        useRef<HTMLDivElement | null>(null);

    const dropdownRef =
        useRef<HTMLDivElement | null>(null);

    const selectedProject =
        projects.find(project => project.id === value);

    function updateDropdownPosition() {
        if (!selectRef.current) {
            return;
        }

        const rect =
            selectRef.current.getBoundingClientRect();

        setDropdownPosition({
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width
        });
    }

    function toggleDropdown() {
        if (projects.length === 0) {
            return;
        }

        if (!isOpen) {
            updateDropdownPosition();
        }

        setIsOpen(current => !current);
    }

    function selectProject(projectId: number) {
        onChange(projectId);

        setIsOpen(false);
    }

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            const target = event.target as Node;

            const clickedSelect =
                selectRef.current?.contains(target);

            const clickedDropdown =
                dropdownRef.current?.contains(target);

            if (!clickedSelect && !clickedDropdown) {
                setIsOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handlePositionChange() {
            updateDropdownPosition();
        }

        window.addEventListener(
            "resize",
            handlePositionChange
        );

        window.addEventListener(
            "scroll",
            handlePositionChange,
            true
        );

        return () => {
            window.removeEventListener(
                "resize",
                handlePositionChange
            );

            window.removeEventListener(
                "scroll",
                handlePositionChange,
                true
            );
        };
    }, [isOpen]);

    return (
        <>
            <div
                ref={selectRef}
                className={styles.select}
            >
                <button
                    type="button"
                    className={`
                        ${styles.trigger}
                        ${isOpen ? styles.triggerOpen : ""}
                    `}
                    onClick={toggleDropdown}
                    disabled={projects.length === 0}
                >
                    <span className={styles.selectedText}>
                        {
                            selectedProject?.name ??
                            "Выберите проект"
                        }
                    </span>

                    <span
                        className={`
                            ${styles.arrow}
                            ${isOpen ? styles.arrowOpen : ""}
                        `}
                    />
                </button>
            </div>

            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className={styles.options}
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownPosition.width
                        }}
                    >
                        {projects.map(project => {
                            const isSelected =
                                project.id === value;

                            return (
                                <button
                                    key={project.id}
                                    type="button"
                                    className={`
                                        ${styles.option}
                                        ${
                                        isSelected
                                            ? styles.optionSelected
                                            : ""
                                    }
                                    `}
                                    onClick={() =>
                                        selectProject(project.id)
                                    }
                                >
                                    {project.name}
                                </button>
                            );
                        })}
                    </div>,
                    document.body
                )
            }
        </>
    );
}
