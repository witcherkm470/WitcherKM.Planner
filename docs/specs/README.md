# Спецификации Planner

Canonical specs описывают согласованное действующее поведение. Это не снимок любых случайных особенностей кода: найденный баг исправляется по требованию, а требование не переписывается под баг.

## Карта

- [Domain: словарь](domain/glossary.md), [Project](domain/project.md), [Feature](domain/feature.md), [Task](domain/task.md), [Idea](domain/idea.md) — понятия, состояния, правила и границы их проверки.
- Application: [проекты](application/projects.md), [фичи](application/features.md), [задачи](application/tasks.md), [идеи](application/ideas.md) — входы, оркестрация, результаты и внешние проверки; локальные инварианты не повторяются.
- UI: [список проектов](ui/projects-page.md), [карточка проекта](ui/project-page.md), [список фич](ui/features-page.md), [карточка фичи](ui/feature-page.md), [список задач](ui/tasks-page.md), [карточка задачи](ui/task-page.md), [идеи](ui/ideas-page.md), [общий контракт диалогов](ui/dialogs.md).
- [Architecture](../architecture/overview.md) — техническое устройство и правила; [дизайн](../design/frontend.md) — визуальные правила.
- [Открытые вопросы](questions.md) — неоднозначности, не разрешённые догадкой.
- [История переноса и соответствия](changes/archive/2026-10-05-sdd/README.md); [повторный аудит и адаптация workflows](changes/archive/2026-10-05-workflows-audit.md).

## Изменения

Требования проходят цепочку **change spec → canonical specs → code**. Canonical описывают согласованное действующее поведение; active change явно отмечает незавершённую реализацию. Архив хранит историю и не является вторым источником требований. Не создавать actual/changes для каждого слоя.

Процедура сопровождения: [spec-management](../../.agents/skills/spec-management/SKILL.md); реализация: [implement-change](../../.agents/skills/implement-change/SKILL.md). При конфликте источников предположение агента не меняет требования; неоднозначность фиксируется в questions.md.