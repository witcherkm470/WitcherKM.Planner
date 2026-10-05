# Idea

- I-01: Essence не пустая и не состоит только из пробелов.
- I-02: новая идея NotRealized = 2. Переходы: NotRealized → Realized = 1; NotRealized → Canceled = 3; Canceled → NotRealized.
- I-03: Realized — конечное состояние. Редактирование и удаление запрещены; локальную проверку выполняет Idea. Canceled можно редактировать и удалять.

Источник: legacy/ideas/initial.md; Realzied исправлено на существующее Realized.

Проверки: DomainTests.Idea_realized_is_terminal_and_canceled_can_be_restored; Required_text_is_validated_by_domain; ApplicationIntegrationTests.Terminal_entities_cannot_be_deleted_and_task_status_filter_is_applied; Ideas_filter_includes_realized_by_default_and_canceled_separately.
