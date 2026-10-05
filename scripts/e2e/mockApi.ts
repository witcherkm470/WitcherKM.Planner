import type { Page } from "@playwright/test";
import type { ProjectExtendedModel } from "../app/api/models/project/ProjectExtendedModel";
import type { FeatureModel } from "../app/api/models/feature/FeatureModel";
import type { TaskModel } from "../app/api/models/task/TaskModel";
import type { IdeaModel } from "../app/api/models/idea/IdeaModel";
import type { FeatureStatus } from "../app/api/models/feature/FeatureStatus";
import type { TaskStatus } from "../app/api/models/task/TaskStatus";
import type { IdeaStatus } from "../app/api/models/idea/IdeaStatus";

export async function mockApi(page: Page) {
    const projects: ProjectExtendedModel[] = [{ id: 1, name: "Проект тестирования", description: "Описание проекта", documentation: "Документация", projectStatus: 1, openedFeatureCount: 1 }];
    const features: FeatureModel[] = [{ id: 2, name: "Первая фича", description: "Описание фичи", featureStatus: 1, projectId: 1, projectName: projects[0].name }];
    const tasks: TaskModel[] = [];
    const ideas: IdeaModel[] = [];
    let nextId = 10;
    const unhandled: string[] = [];
    await page.route(url => url.pathname.startsWith("/api/"), async route => {
        const request = route.request(); const url = new URL(request.url()); const path = url.pathname;
        const method = request.method(); const body = request.postData() ? request.postDataJSON() as Record<string, string | number> : {};
        let result: unknown; let status = 200;
        const projectCard = (id: number) => { const project = projects.find(p => p.id === id); return project && { ...project, openedFeatureCount: features.filter(f => f.projectId === id && f.featureStatus === 1).length }; };
        if(path === "/api/projects/get-projects") result = projects;
        else if(path === "/api/projects/get-project-name-and-ids") result = projects.map(p => ({ id: p.id, name: p.name }));
        else if(path === "/api/projects/get-project-by-id") result = projectCard(Number(url.searchParams.get("ProjectId")));
        else if(path === "/api/projects/get-project-features") result = features.filter(f => f.projectId === Number(url.searchParams.get("ProjectId")));
        else if(path === "/api/projects/add-project") { const p = { id: nextId++, name: String(body.name), description: String(body.description), documentation: null, projectStatus: 1 as const, openedFeatureCount: 0 }; projects.push(p); result = p; }
        else if(path === "/api/projects/update-project" || path === "/api/projects/update-project-card") { const p = projects.find(p => p.id === Number(body.projectId))!; p.name = String(body.name); p.description = String(body.description); if(body.documentation !== undefined) p.documentation = String(body.documentation); result = projectCard(p.id); }
        else if(path === "/api/features/get-features") result = features;
        else if(path === "/api/features/add-feature") { const p = projects.find(p => p.id === Number(body.projectId))!; const f = { id: nextId++, name: String(body.name), description: String(body.description), featureStatus: 1 as const, projectId: p.id, projectName: p.name }; features.push(f); result = f; }
        else if(path === "/api/features/update-feature") { const f = features.find(f => f.id === Number(body.featureId))!; f.name = String(body.name); f.description = String(body.description); result = f; }
        else if(/^\/api\/features\/\d+\/status$/.test(path)) { const f = features.find(f => f.id === Number(path.split("/")[3]))!; f.featureStatus = Number(body.featureStatus) as FeatureStatus; result = f; }
        else if(path === "/api/tasks" && method === "GET") result = tasks.filter(t => (!url.searchParams.has("featureId") || t.featureId === Number(url.searchParams.get("featureId"))) && (!url.searchParams.has("taskStatus") || t.taskStatus === Number(url.searchParams.get("taskStatus"))));
        else if(path === "/api/tasks" && method === "POST") { const f = features.find(f => f.id === Number(body.featureId))!; const t = { id: nextId++, name: String(body.name), description: String(body.description), taskStatus: 1 as const, featureId: f.id, featureName: f.name, projectId: f.projectId, projectName: f.projectName }; tasks.push(t); result = t; }
        else if(/^\/api\/tasks\/\d+(\/status)?$/.test(path)) { const id = Number(path.split("/")[3]); const t = tasks.find(t => t.id === id)!; if(method === "DELETE") { tasks.splice(tasks.indexOf(t), 1); status = 204; } else { if(method === "PUT") { if(path.endsWith("/status")) t.taskStatus = Number(body.taskStatus) as TaskStatus; else { t.name = String(body.name); t.description = String(body.description); } } result = t; } }
        else if(path === "/api/ideas/get-ideas") result = ideas.filter(i => url.searchParams.get("showCanceled") === "true" ? i.ideaStatus === 3 : i.ideaStatus !== 3);
        else if(path === "/api/ideas/add-idea") { const i = { id: nextId++, essence: String(body.essence), ideaStatus: 2 as const }; ideas.push(i); result = i; }
        else if(path === "/api/ideas/update-idea") { const i = ideas.find(i => i.id === Number(body.ideaId))!; i.essence = String(body.essence); result = i; }
        else if(path === "/api/ideas/change-idea-status") { const i = ideas.find(i => i.id === Number(body.ideaId))!; i.ideaStatus = Number(body.ideaStatus) as IdeaStatus; result = i; }
        else { unhandled.push(method + " " + path); status = 501; result = { errors: [{ message: "Unhandled test request" }] }; }
        await route.fulfill({ status, contentType: "application/json", body: status === 204 ? "" : JSON.stringify(result ?? null) });
    });
    return { projects, features, tasks, ideas, unhandled };
}
