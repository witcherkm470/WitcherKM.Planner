import type { ProjectNameIdModel } from "../../api/models/project/ProjectNameIdModel";
import FilterSelect from "../FilterSelect/FilterSelect";
interface Props { projects: ProjectNameIdModel[]; value: number | null; onChange: (projectId: number) => void; disabled?: boolean; }
export default function ProjectSelect({ projects, value, onChange, disabled }: Props) {
    return <FilterSelect inlineMenu ariaLabel="Проект" value={value ?? undefined} disabled={disabled || !projects.length} onChange={id => { if (id !== undefined) onChange(id); }} options={[{ value: undefined, label: "Выберите проект" }, ...projects.map(project => ({ value: project.id, label: project.name }))]} />;
}
