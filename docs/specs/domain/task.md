# TaskItem

- T-01: непустое название, необязательное описание, одна существующая фича и через неё один проект. Перепривязка при редактировании не задана.
- T-02: новая задача Open = 1. Переходы: Open → InProgress = 2; InProgress → Open; InProgress → Done = 3. Прямой Open → Done запрещён.
- T-03: Done — конечное состояние; нельзя изменить название, описание, статус или удалить задачу. Локальные проверки находятся в TaskItem.

Источник: legacy/tasks/task-page.md и task-card.md. Слова «идея» в acceptance criteria этих документов — очевидная опечатка в требованиях о задаче; в архиве оригинал сохранён.

Проверки: DomainTests.Task_done_is_terminal_and_invalid_edit_preserves_state; Required_text_is_validated_by_domain; ApplicationIntegrationTests.Task_writes_return_full_parent_chain_and_persist_between_requests; Missing_parents_are_rejected; Terminal_entities_cannot_be_deleted_and_task_status_filter_is_applied.
