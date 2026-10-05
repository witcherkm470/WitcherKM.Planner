import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CreateProjectModal from "../app/components/Modal/Project/CreateProjectModal";
import UpdateProjectModal from "../app/components/Modal/Project/UpdateProjectModal";
import CreateFeatureModal from "../app/components/Modal/Feature/CreateFeatureModal";
import CreateProjectFeatureModal from "../app/components/Modal/Feature/CreateProjectFeatureModal";
import UpdateFeatureModal from "../app/components/Modal/Feature/UpdateFeatureModal";
import IdeaModal from "../app/components/Modal/Idea/IdeaModal";
import ProjectCard from "../app/components/Project/ProjectCard";
import FeatureActions from "../app/components/Feature/FeatureActions";
import IdeasTable from "../app/components/Idea/IdeasTable";

const project = { id: 1, name: "Project", description: "Description", projectStatus: 1 as const, documentation: "Docs", openedFeatureCount: 1 };
const feature = { id: 2, name: "Feature", description: "Description", featureStatus: 1 as const };
describe("Existing form contracts", () => {
    it.each(["project", "projectFeature", "idea"])("%s creation validates, submits and cancels", async kind => {
        const save = vi.fn(), close = vi.fn(); const user = userEvent.setup();
        if (kind === "project") render(<CreateProjectModal isSaving={false} onSave={save} onClose={close} />);
        if (kind === "projectFeature") render(<CreateProjectFeatureModal projectName="Project" isSaving={false} onSave={save} onClose={close} />);
        if (kind === "idea") render(<IdeaModal title="Новая идея" isSaving={false} onSave={save} onClose={close} />);
        const dialog = screen.getByRole("dialog");
        const submit = within(dialog).getByRole("button", { name: /Создать|Сохранить/ });
        expect(submit).toBeDisabled();
        await user.type(within(dialog).getByLabelText(kind === "idea" ? "Суть" : "Название"), "Value");
        await user.click(submit); expect(save).toHaveBeenCalledTimes(1);
        await user.click(within(dialog).getByRole("button", { name: "Отмена" })); expect(close).toHaveBeenCalledOnce();
    });

    it.each(["project", "feature", "idea"])("%s edit starts with existing values and blocks saves in flight", async kind => {
        const save = vi.fn(), close = vi.fn();
        if(kind === "project") render(<UpdateProjectModal project={project} isSaving onSave={save} onClose={close} />);
        if(kind === "feature") render(<UpdateFeatureModal feature={feature} isSaving onSave={save} onClose={close} />);
        if(kind === "idea") render(<IdeaModal title="Редактирование идеи" initialEssence="Idea" isSaving onSave={save} onClose={close} />);
        const user = userEvent.setup();
        expect(screen.getByDisplayValue(kind === "project" ? "Project" : kind === "feature" ? "Feature" : "Idea")).toBeDisabled();
        expect(screen.getByRole("button", { name: /Сохранить|Сохранение/ })).toBeDisabled();
        await user.keyboard("{Escape}"); expect(close).not.toHaveBeenCalled(); expect(save).not.toHaveBeenCalled();
    });

    it("feature creation supports asynchronously supplied project choices", async () => {
        const save = vi.fn(); const user = userEvent.setup();
        const result = render(<CreateFeatureModal projects={[]} isSaving={false} onSave={save} onClose={vi.fn()} />);
        await user.type(screen.getByLabelText("Название"), "Feature");
        expect(screen.getByRole("button", { name: "Создать" })).toBeDisabled();
        result.rerender(<CreateFeatureModal projects={[project]} isSaving={false} onSave={save} onClose={vi.fn()} />);
        await user.click(screen.getByRole("button", { name: "Проект" }));
        await user.click(screen.getByRole("option", { name: "Project" }));
        await user.click(screen.getByRole("button", { name: "Создать" }));
        expect(save).toHaveBeenCalledWith("Feature", "", 1);
    });

    it("keeps Tab and Shift+Tab in the modal", async () => {
        render(<><button>Outside</button><CreateProjectModal isSaving={false} onSave={vi.fn()} onClose={vi.fn()} /></>);
        const user = userEvent.setup(); const dialog = screen.getByRole("dialog");
        await user.type(screen.getByLabelText("Название"), "Project");
        within(dialog).getByRole("button", { name: "Создать" }).focus();
        await user.tab(); expect(within(dialog).getByRole("button", { name: "Закрыть" })).toHaveFocus();
        await user.tab({ shift: true }); expect(within(dialog).getByRole("button", { name: "Создать" })).toHaveFocus();
    });

    it("inline project edit preserves draft on dialog Escape and can discard it", async () => {
        const save = vi.fn();
        function Harness() { const [editing, setEditing] = useState(false); return <ProjectCard project={project} isEditing={editing} isSaving={false} onEditingChange={setEditing} onSave={save} />; }
        render(<Harness />); const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "Редактировать проект" }));
        await user.type(screen.getByLabelText("Документация проекта"), " Draft");
        await user.click(screen.getByRole("button", { name: "Завершить редактирование" }));
        expect(screen.getByRole("dialog", { name: "Сохранить изменения?" })).toBeVisible();
        await user.keyboard("{Escape}"); expect(screen.getByLabelText("Документация проекта")).toHaveValue("Docs Draft");
        await user.click(screen.getByRole("button", { name: "Завершить редактирование" }));
        await user.click(screen.getByRole("button", { name: "Нет" }));
        expect(save).not.toHaveBeenCalled();
        expect(screen.getByText("Docs")).toBeVisible();
    });

    it("terminal feature and realized idea have no mutation actions", () => {
        render(<><FeatureActions status={3} disabled={false} onEdit={vi.fn()} onDelete={vi.fn()} onChangeStatus={vi.fn()} /><IdeasTable ideas={[{ id: 1, essence: "Idea", ideaStatus: 1 }]} isBusy={false} onEdit={vi.fn()} onDelete={vi.fn()} onStatusChange={vi.fn()} /></>);
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
