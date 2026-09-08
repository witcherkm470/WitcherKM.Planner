import { useEffect, useState } from "react";
import RenderProjectTable from "../../components/Project/ProjectTable.tsx";
import type { ProjectModel } from "../../api/models/project/ProjectModel.ts";


export function RenderProjectsPage() {
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    async function loadProjects() {
        const response = await fetch(
            "/api/Projects/get-projects"
        );

        if (!response.ok) {
            throw new Error(`Failed to load projects: ${response.status}`);
        }

        const data: ProjectModel[] = await response.json();

        setProjects(data);
    }

    async function deleteProject(projectId: number) {
        const response = await fetch(`/api/Projects/remove-project?ProjectId=${projectId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Failed to delete project: ${response.status}`);
        }

        await loadProjects();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProjects();
    }, []);

    return (
        <RenderProjectTable projects={projects}
                            onDelete={deleteProject}/>
    );

}
