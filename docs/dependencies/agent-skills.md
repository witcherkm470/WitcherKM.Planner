# Идеи из agent-skills

Изучен [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), ветка main, 2026-10-05. В Planner написаны самостоятельные компактные процедуры; весь plugin, generic SDD, personas, hooks и slash-команды не установлены. Это источник инженерных приёмов, не продуктовых требований.

| Локальный workflow | Что адаптировано из источника |
| --- | --- |
| [incremental-implementation](../../.agents/skills/incremental-implementation/SKILL.md) | [Источник](https://github.com/addyosmani/agent-skills/blob/main/skills/incremental-implementation/SKILL.md): небольшие законченные сценарии и проверка каждого среза. Без обязательных commits, лимитов строк и feature flags. |
| [debugging-and-error-recovery](../../.agents/skills/debugging-and-error-recovery/SKILL.md) | [Источник](https://github.com/addyosmani/agent-skills/blob/main/skills/debugging-and-error-recovery/SKILL.md): воспроизведение, локализация, минимальный пример, причина, регрессия. Останавливается зависимая часть; защита тестов определяется локальным testing. |
| [code-review-and-quality](../../.agents/skills/code-review-and-quality/SKILL.md) | [Источник](https://github.com/addyosmani/agent-skills/blob/main/skills/code-review-and-quality/SKILL.md): пять аспектов review, конкретное последствие и приоритет. Без вкусовых блокировок и произвольного размера diff. |
| [frontend-ui-engineering](../../.agents/skills/frontend-ui-engineering/SKILL.md) | [Источник](https://github.com/addyosmani/agent-skills/blob/main/skills/frontend-ui-engineering/SKILL.md): разделение данных/представления, проверка состояний и доступности. Сохраняются дизайн Planner, существующие hooks и контракт модалок. |
| [api-and-interface-design](../../.agents/skills/api-and-interface-design/SKILL.md) | [Источник](https://github.com/addyosmani/agent-skills/blob/main/skills/api-and-interface-design/SKILL.md): контракт до реализации, совместимость, ошибки и границы ввода. Сохраняются текущие routes/enum и бизнес-правила Planner. |

Собственные implement-change, spec-management, domain-modeling, testing ведут процесс **change spec → canonical specs → code**. Корневые skills короткие; дополнительная процедура вынесена только для сложных UI-взаимодействий. Загружается нужный workflow, не весь каталог. Требования остаются в docs/specs, технические правила — в docs/architecture.
