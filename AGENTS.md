# Правила работы в Planner

- `src/` — backend; `scripts/` — React; `tests/` — backend tests. Сохраняй пользовательские изменения, перед работой изучай git status/diff.
- [Canonical specs](docs/specs/README.md): `domain` — словарь/агрегаты/инварианты, `application` — сценарии со ссылками на domain, `ui` — страницы/действия/модалки. Это источник поведения, не копия особенностей кода.
- [Architecture](docs/architecture/overview.md) — технические правила; [design](docs/design/frontend.md) — визуальные. Skills содержат процедуры, не дублируют эти правила.
- Порядок: `docs/specs/changes/active/<change>.md` → canonical specs → code → проверки → `changes/archive`. Незавершённое остаётся active. Не придумывай требования и не ослабляй specs под дефект; реальные неоднозначности фиксируй в [questions](docs/specs/questions.md), продолжая независимую работу.
- Основной router: [implement-change](.agents/skills/implement-change/SKILL.md). По задаче читай [spec-management](.agents/skills/spec-management/SKILL.md), [domain-modeling](.agents/skills/domain-modeling/SKILL.md), [testing](.agents/skills/testing/SKILL.md). Не загружай все skills/references заранее.
- Для отдельных этапов: [incremental-implementation](.agents/skills/incremental-implementation/SKILL.md), [debugging-and-error-recovery](.agents/skills/debugging-and-error-recovery/SKILL.md), [code-review-and-quality](.agents/skills/code-review-and-quality/SKILL.md), [frontend-ui-engineering](.agents/skills/frontend-ui-engineering/SKILL.md), [api-and-interface-design](.agents/skills/api-and-interface-design/SKILL.md).
- Существующие тесты запрещено подгонять ради зелёного прогона; условия допустимых изменений и отчётности заданы в testing. Команды сборки и проверок — в [architecture/testing](docs/architecture/testing.md).
