import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectTable from "../../components/Project/ProjectTable.tsx";
import ProjectsToolbar from "../../components/Project/ProjectsToolbar.tsx";

import ErrorModal from "../../components/Modal/ErrorModal.tsx";
import UpdateProjectModal from "../../components/Modal/Project/UpdateProjectModal.tsx";
import CreateProjectModal from "../../components/Modal/Project/CreateProjectModal.tsx";

import {
    getProjects,
    deleteProject,
    updateProject,
    addProject
} from "../../api/apis/project/projectApi.ts";

import { useApiRequest } from "../../hooks/useApiRequest.ts";
import type { ProjectModel } from "../../api/models/project/ProjectModel.ts";

import styles from "./ProjectsPage.module.scss";

export function RenderProjectsPage() {
    const navigate = useNavigate();

    const [updatingProject, setUpdatingProject] =
        useState<ProjectModel | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const {
        execute: loadProjects,
        data: projects
    } = useApiRequest(getProjects);

    const {
        execute: deleteProjectById,
        error: deleteProjectError,
        clearError: clearDeletionError
    } = useApiRequest(deleteProject, {
        onSuccess: loadProjects
    });

    const {
        execute: updateProjectRequest,
        error: updateProjectError,
        clearError: clearUpdateError
    } = useApiRequest(updateProject, {
        onSuccess: async () => {
            setUpdatingProject(null);
            await loadProjects();
        }
    });

    const {
        execute: createProject,
        error: createProjectError,
        clearError: clearCreateProjectError
    } = useApiRequest(addProject, {
        onSuccess: async () => {
            setIsCreateModalOpen(false);
            await loadProjects();
        }
    });

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    return (
        <div className={styles.page}>
            <ProjectsToolbar
                onAdd={() => setIsCreateModalOpen(true)}
            />

            <ProjectTable
                projects={projects ?? []}
                onDelete={deleteProjectById}
                onEdit={setUpdatingProject}
                onOpen={(projectId) =>
                    navigate(`/projects/${projectId}`)
                }
            />

            {isCreateModalOpen && (
                <CreateProjectModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={(name, description) =>
                        void createProject({
                            name,
                            description
                        })
                    }
                />
            )}

            {updatingProject && (
                <UpdateProjectModal
                    key={updatingProject.id}
                    project={updatingProject}
                    onClose={() => setUpdatingProject(null)}
                    onSave={(name, description) =>
                        void updateProjectRequest({
                            projectId: updatingProject.id,
                            name,
                            description
                        })
                    }
                />
            )}

            {deleteProjectError && (
                <ErrorModal
                    message={deleteProjectError.message}
                    onClose={clearDeletionError}
                />
            )}

            {updateProjectError && (
                <ErrorModal
                    message={updateProjectError.message}
                    onClose={clearUpdateError}
                />
            )}

            {createProjectError && (
                <ErrorModal
                    message={createProjectError.message}
                    onClose={clearCreateProjectError}
                />
            )}
        </div>
    );
}
