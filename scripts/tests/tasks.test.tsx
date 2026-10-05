import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TasksPage, TaskCardPage } from "../app/views/task/TasksPage";
import FeaturePage from "../app/views/feature/FeaturePage";
import * as tasks from "../app/api/apis/task/taskApi";
import * as features from "../app/api/apis/feature/featureApi";
import type { TaskModel } from "../app/api/models/task/TaskModel";

vi.mock("../app/api/apis/task/taskApi");
vi.mock("../app/api/apis/feature/featureApi");
const task: TaskModel = { id: 3, name: "Task", description: "Description", featureId: 2, featureName: "Feature", projectId: 1, projectName: "Project", taskStatus: 1 };
const feature = { id: 2, name: "Feature", description: "Description", projectId: 1, projectName: "Project", featureStatus: 1 as const };
function renderRoute(path = "/tasks") {
    return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/tasks" element={<TasksPage />} /><Route path="/tasks/:taskId" element={<TaskCardPage />} /><Route path="/features/:featureId" element={<FeaturePage />} /></Routes></MemoryRouter>);
}
beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(tasks.getTasks).mockResolvedValue([task]);
    vi.mocked(tasks.getTask).mockResolvedValue(task);
    vi.mocked(tasks.addTask).mockResolvedValue(task);
    vi.mocked(tasks.updateTask).mockResolvedValue(task);
    vi.mocked(tasks.changeTaskStatus).mockResolvedValue(task);
    vi.mocked(features.getFeatures).mockResolvedValue([feature]);
});

describe("Task page contracts", () => {
    it("opens global creation, requires a parent, and saves selected feature", async () => {
        const user = userEvent.setup(); renderRoute();
        await user.click(screen.getByRole("button", { name: /Добавить задачу/ }));
        const modal = await screen.findByRole("dialog", { name: "Новая задача" });
        expect(within(modal).getByRole("button", { name: "Сохранить" })).toBeDisabled();
        await user.type(within(modal).getByLabelText("Название"), "New task");
        await user.click(within(modal).getByRole("button", { name: "Фича" }));
        await user.click(within(modal).getByRole("option", { name: /Project.*Feature/ }));
        await user.click(within(modal).getByRole("button", { name: "Сохранить" }));
        await waitFor(() => expect(tasks.addTask).toHaveBeenCalledWith({ name: "New task", description: "", featureId: 2 }));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("cancels without writing and restores focus", async () => {
        const user = userEvent.setup(); renderRoute();
        const trigger = screen.getByRole("button", { name: /Добавить задачу/ });
        await user.click(trigger);
        const modal = await screen.findByRole("dialog", { name: "Новая задача" });
        await user.type(within(modal).getByLabelText("Название"), "Draft");
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(tasks.addTask).not.toHaveBeenCalled();
        expect(trigger).toHaveFocus();
    });

    it("renders status, parent links and an edit modal on the task card", async () => {
        const user = userEvent.setup(); renderRoute("/tasks/3");
        await screen.findByRole("heading", { name: "Task" });
        expect(screen.getByText("Открыта")).toBeVisible();
        expect(screen.getByRole("link", { name: "Feature" })).toHaveAttribute("href", "/features/2");
        expect(screen.getByRole("link", { name: "Project" })).toHaveAttribute("href", "/projects/1");
        await user.click(screen.getByRole("button", { name: "Редактировать задачу" }));
        const modal = screen.getByRole("dialog", { name: "Редактирование задачи" });
        expect(within(modal).getByLabelText("Название")).toHaveValue("Task");
        await user.clear(within(modal).getByLabelText("Название"));
        await user.type(within(modal).getByLabelText("Название"), "Edited");
        await user.click(within(modal).getByRole("button", { name: "Сохранить" }));
        await waitFor(() => expect(tasks.updateTask).toHaveBeenCalledWith({ taskId: 3, name: "Edited", description: "Description" }));
    });

    it("hides every mutation for Done in both card and list", async () => {
        vi.mocked(tasks.getTask).mockResolvedValue({ ...task, taskStatus: 3 });
        vi.mocked(tasks.getTasks).mockResolvedValue([{ ...task, taskStatus: 3 }]);
        const result = renderRoute("/tasks/3");
        await screen.findByRole("heading", { name: "Task" });
        expect(screen.queryByRole("button", { name: /задачу/ })).not.toBeInTheDocument();
        result.unmount(); renderRoute(); await screen.findByText("Task");
        expect(screen.queryByRole("button", { name: "Редактировать задачу" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Удалить задачу" })).not.toBeInTheDocument();
    });

    it("refreshes the feature open-task count after a task transition", async () => {
        vi.mocked(tasks.getTasks).mockImplementation(async (_id, status) => status === 1 ? [task] : [task]);
        const user = userEvent.setup(); renderRoute("/features/2");
        await screen.findByText("Открытых задач: 1");
        vi.mocked(tasks.getTasks).mockImplementation(async (_id, status) => status === 1 ? [] : [{ ...task, taskStatus: 2 }]);
        await user.click(screen.getByRole("button", { name: "Начать задачу" }));
        await screen.findByText("Открытых задач: 0");
    });

    it("keeps a draft after failure and blocks duplicate submissions while saving", async () => {
        let rejectRequest!: (reason: Error) => void;
        vi.mocked(tasks.updateTask).mockImplementation(() => new Promise((_resolve, reject) => { rejectRequest = reject; }));
        const user = userEvent.setup(); renderRoute();
        await user.click(await screen.findByRole("button", { name: "Редактировать задачу" }));
        const modal = screen.getByRole("dialog", { name: "Редактирование задачи" });
        const input = within(modal).getByLabelText("Название");
        await user.clear(input); await user.type(input, "Draft");
        await user.click(within(modal).getByRole("button", { name: "Сохранить" }));
        expect(within(modal).getByRole("button", { name: /Сохранение/ })).toBeDisabled();
        await user.keyboard("{Escape}");
        expect(modal).toBeInTheDocument();
        await act(async () => rejectRequest(new Error("Network")));
        const error = await screen.findByRole("dialog", { name: "Ошибка" });
        await user.click(within(error).getByRole("button", { name: "Закрыть" }));
        expect(input).toHaveValue("Draft");
        expect(tasks.updateTask).toHaveBeenCalledTimes(1);
    });

    it("shows load failures instead of an endless loading card", async () => {
        vi.mocked(tasks.getTask).mockRejectedValue(new Error("Offline")); renderRoute("/tasks/3");
        await screen.findByRole("dialog", { name: "Ошибка" });
        expect(screen.queryByText("Загрузка задачи...")).not.toBeInTheDocument();
    });

    it("does not save a task without available features", async () => {
        vi.mocked(features.getFeatures).mockResolvedValue([]); renderRoute();
        fireEvent.click(screen.getByRole("button", { name: /Добавить задачу/ }));
        const modal = await screen.findByRole("dialog", { name: "Новая задача" });
        await screen.findByText(/Сначала создайте фичу/);
        fireEvent.change(within(modal).getByLabelText("Название"), { target: { value: "Task" } });
        expect(within(modal).getByRole("button", { name: "Сохранить" })).toBeDisabled();
    });
});
