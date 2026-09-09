import { useEffect } from "react";
import ProjectTable from "../../components/Project/ProjectTable.tsx";
import {getProjects, deleteProject} from "../../api/apis/project/projectApi.ts"
import {useApiRequest} from "../../hooks/useApiRequest.ts";
import ErrorModal from "../../components/Modal/ErrorModal.tsx";


export function RenderProjectsPage() {
    const {
        execute: loadProjects,
        data: projects
    } = useApiRequest(getProjects);

    const {
        execute: deleteProjectById,
        error: deleteProjectError,
        clearError: clearDeletionError,
    } = useApiRequest(deleteProject, {onSuccess: loadProjects});

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    return (
        <>
            <ProjectTable
                projects={projects ?? []}
                onDelete={deleteProjectById}
            />

            {deleteProjectError && (
                <ErrorModal
                    message={deleteProjectError.message}
                    onClose={clearDeletionError}
                />
            )}
        </>
    );
}
