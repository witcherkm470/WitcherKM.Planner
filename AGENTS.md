# Правила работы в Planner

- src/ — Domain, Application.Common, Application, Infrastructure, Api; scripts/ — React-клиент; tests/ — backend-проверки.
- [Canonical specs](docs/specs/README.md) задают поведение, [architecture](docs/architecture/overview.md) — технические правила, [design](docs/design/frontend.md) — визуальные правила.
- Перед изменением прочитать релевантные specs, architecture и затронутый код. При изменённой spec сначала изучить git diff. Не придумывать продуктовые требования и не переписывать specs под случайный дефект кода.
- Неоднозначности записывать в docs/specs/questions.md; продолжать независимую работу. Сохранять незакоммиченные пользовательские изменения.
- [implement-change](.agents/skills/implement-change/SKILL.md) — реализация изменения; [spec-management](.agents/skills/spec-management/SKILL.md) — сопровождение требований; [domain-modeling](.agents/skills/domain-modeling/SKILL.md) — доменный срез; [testing](.agents/skills/testing/SKILL.md) — проверка.
- Существующие тесты нельзя менять ради зелёного прогона. Ожидание можно менять только при явно изменившемся соответствующем требовании с указанием его источника.
- Проверить критерии приёмки, релевантные тесты и сборки. Для frontend обязательны lint и build. Отчёт различает пройденные, упавшие и не выполненные проверки.
