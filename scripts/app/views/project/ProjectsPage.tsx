import { useEffect, useState } from "react";
import ProjectTable from "../../components/Project/ProjectTable.tsx";
import type { ProjectModel } from "../../api/models/project/ProjectModel.ts";
import {getProjects, deleteProject} from "../../api/apis/project/projectApi.ts"


export function RenderProjectsPage() {
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    async function loadProjects() {
        const response = await getProjects();
        setProjects(response);
    }

    async function handleDelete(projectId: number) {
        await deleteProject(projectId);
        const projects = await getProjects();
        setProjects(projects);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProjects();
    }, []);

    return (
        <ProjectTable projects={projects}
                            onDelete={handleDelete}/>
    );

}
