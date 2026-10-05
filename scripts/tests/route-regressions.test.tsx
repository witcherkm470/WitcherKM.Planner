import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";
import ProjectPage from "../app/views/project/ProjectPage";
import FeaturePage from "../app/views/feature/FeaturePage";
import { TaskCardPage } from "../app/views/task/TasksPage";
import * as projects from "../app/api/apis/project/projectApi";
import * as features from "../app/api/apis/feature/featureApi";
import * as tasks from "../app/api/apis/task/taskApi";

vi.mock("../app/api/apis/project/projectApi");
vi.mock("../app/api/apis/feature/featureApi");
vi.mock("../app/api/apis/task/taskApi");

beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(projects.getProjectById).mockImplementation(async id => ({ id, name: "Project " + id, description: null, documentation: null, openedFeatureCount: 1, projectStatus: 1 }));
    vi.mocked(projects.getProjectFeatures).mockResolvedValue([]);
    vi.mocked(features.getFeatures).mockResolvedValue([1, 2].map(id => ({ id, name: "Feature " + id, description: null, featureStatus: 1, projectId: 1, projectName: "Project" })));
    vi.mocked(tasks.getTasks).mockResolvedValue([]);
    vi.mocked(tasks.getTask).mockImplementation(async id => ({ id, name: "Task " + id, description: null, taskStatus: 1, featureId: 1, featureName: "Feature", projectId: 1, projectName: "Project" }));
});

it.each([
    { route: "/tasks/:taskId", base: "/tasks", element: <TaskCardPage />, edit: "Редактировать задачу", heading: "Task 2" },
    { route: "/features/:featureId", base: "/features", element: <FeaturePage />, edit: "Редактировать фичу", heading: "Feature 2" },
    { route: "/projects/:projectId", base: "/projects", element: <ProjectPage />, edit: "Редактировать проект", heading: "Project 2" },
])("$base closes the old editor on history navigation to another entity", async ({ route, base, element, edit, heading }) => {
    const router = createMemoryRouter([{ path: route, element }], { initialEntries: [base + "/1"] });
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: edit }));
    const input = screen.getByRole("textbox", { name: base === "/projects" ? "Название проекта" : "Название" });
    await user.clear(input); await user.type(input, "Draft of first entity");
    await act(async () => { await router.navigate(base + "/2"); });
    expect(screen.queryByDisplayValue("Draft of first entity")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: heading })).toBeVisible();
    expect(projects.updateProjectCard).not.toHaveBeenCalled();
    expect(features.updateFeature).not.toHaveBeenCalled();
    expect(tasks.updateTask).not.toHaveBeenCalled();
});
