# Feature

- F-01: непустое название, необязательное описание, связь с одним существующим Project. Перенос между проектами не задан.
- F-02: создаётся Opened = 1. Разрешены только Opened → InProgress = 2, InProgress → Opened и InProgress → Completed = 3.
- F-03: Completed — конечное состояние: редактирование, удаление и смена статуса запрещены. Локальные проверки находятся в Feature; application вызывает их.
- F-04: хранение запрещает удалять фичу с задачами (существующий Restrict). Каскадное удаление не вводится; продуктовое решение о таком удалении остаётся открытым вопросом Q-03.

Источник: legacy/features/initial.md; ограничения хранения — действующая EF-конфигурация. Название Done в старой spec нормализовано к существующему Completed без смены числового API-контракта.

Проверки: DomainTests.Feature_supports_only_documented_transitions_and_completed_is_terminal; ApplicationIntegrationTests.Missing_parents_are_rejected; Terminal_entities_cannot_be_deleted_and_task_status_filter_is_applied.
