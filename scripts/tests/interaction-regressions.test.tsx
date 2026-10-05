import { act, render, renderHook, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useApiRequest } from "../app/hooks/useApiRequest";
import CreateFeatureModal from "../app/components/Modal/Feature/CreateFeatureModal";
import ErrorModal from "../app/components/Modal/ErrorModal";

function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

describe("Current request owns displayed data and errors", () => {
    it("does not replace the current filter with an older response", async () => {
        const old = deferred<string[]>(), current = deferred<string[]>();
        const request = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
        const { result } = renderHook(() => useApiRequest(request));
        let first!: Promise<void>, second!: Promise<void>;
        act(() => { first = result.current.execute("all"); second = result.current.execute("done"); });
        await act(async () => { current.resolve(["Done task"]); await second; });
        await act(async () => { old.resolve(["Open task", "Done task"]); await first; });
        expect(result.current.data).toEqual(["Done task"]);
        expect(result.current.error).toBeNull();
    });

    it("does not finish loading or display an error from an obsolete request", async () => {
        const old = deferred<string[]>(), current = deferred<string[]>();
        const request = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
        const { result } = renderHook(() => useApiRequest(request));
        let first!: Promise<void>, second!: Promise<void>;
        act(() => { first = result.current.execute("all"); second = result.current.execute("done"); });
        await act(async () => { old.reject(new Error("Old request failed")); await first; });
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(true);
        await act(async () => { current.resolve(["Done task"]); await second; });
        expect(result.current.data).toEqual(["Done task"]);
        expect(result.current.isLoading).toBe(false);
    });

    it("reloads using the current filter after a delayed mutation", async () => {
        const pending = deferred<string>();
        const request = vi.fn(() => pending.promise);
        const reload = vi.fn();
        const { result, rerender } = renderHook(({ filter }) => useApiRequest(request, { onSuccess: () => reload(filter) }), { initialProps: { filter: "all" } });
        let saving!: Promise<void>;
        act(() => { saving = result.current.execute(); });
        rerender({ filter: "done" });
        await act(async () => { pending.resolve("Saved"); await saving; });
        expect(reload).toHaveBeenCalledExactlyOnceWith("done");
    });

    it("does not run page callbacks after that page has unmounted", async () => {
        const pending = deferred<string>();
        const request = vi.fn(() => pending.promise), onSuccess = vi.fn();
        const { result, unmount } = renderHook(() => useApiRequest(request, { onSuccess }));
        let saving!: Promise<void>;
        act(() => { saving = result.current.execute(); });
        unmount();
        await act(async () => { pending.resolve("Saved"); await saving; });
        expect(onSuccess).not.toHaveBeenCalled();
    });
});

describe("A parent picker preserves its containing draft", () => {
    it("Escape closes only the picker and returns focus to its trigger", async () => {
        const close = vi.fn(), save = vi.fn(), user = userEvent.setup();
        render(<CreateFeatureModal projects={[{ id: 1, name: "Project" }]} isSaving={false} onClose={close} onSave={save} />);
        await user.type(screen.getByLabelText("Название"), "Draft");
        const trigger = screen.getByRole("button", { name: "Проект" });
        await user.click(trigger);
        screen.getByRole("option", { name: "Project" }).focus();
        await user.keyboard("{Escape}");
        expect(close).not.toHaveBeenCalled();
        expect(save).not.toHaveBeenCalled();
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
        expect(screen.getByLabelText("Название")).toHaveValue("Draft");
        await user.keyboard("{Escape}");
        expect(close).toHaveBeenCalledOnce();
    });

    it("supports arrows and selection without losing keyboard focus", async () => {
        const save = vi.fn(), user = userEvent.setup();
        render(<CreateFeatureModal projects={[{ id: 1, name: "First" }, { id: 2, name: "Second" }]} isSaving={false} onClose={vi.fn()} onSave={save} />);
        await user.type(screen.getByLabelText("Название"), "Feature");
        const trigger = screen.getByRole("button", { name: "Проект" });
        trigger.focus();
        await user.keyboard("{ArrowDown}{End}{Enter}");
        expect(trigger).toHaveTextContent("Second");
        expect(trigger).toHaveFocus();
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Создать" }));
        expect(save).toHaveBeenCalledWith("Feature", "", 2);
    });

    it("keeps independent accessible names for simultaneous error dialogs", () => {
        render(<><ErrorModal title="Ошибка загрузки" message="Load" onClose={vi.fn()} /><ErrorModal title="Ошибка сохранения" message="Save" onClose={vi.fn()} /></>);
        expect(within(screen.getByRole("dialog", { name: "Ошибка загрузки" })).getByText("Load")).toBeVisible();
        expect(within(screen.getByRole("dialog", { name: "Ошибка сохранения" })).getByText("Save")).toBeVisible();
    });
});
