# Сценарии идей

Правила: [Idea](../domain/idea.md). Адаптер: IdeasController.

| Сценарий | Вход и оркестрация | Результат |
| --- | --- | --- |
| ListIdeas | showCanceled=false по умолчанию; false выбирает все кроме Canceled, true — только Canceled | id, essence, ideaStatus |
| AddIdea | essence; создать и сохранить | Созданная модель |
| UpdateIdea | ideaId, essence; найти, вызвать Update, сохранить | Обновлённая модель |
| ChangeIdeaStatus | ideaId, ideaStatus; найти, вызвать доменный переход, сохранить | Обновлённая модель |
| RemoveIdea | ideaId; найти, вызвать доменную проверку удаления, удалить и сохранить | Без тела |

Отсутствующий объект → EntityNotFoundException; неподдерживаемый enum → ошибка без записи. Приёмка: сохранение видно при повторном чтении, фильтр не скрывает Realized в обычном режиме, запрещённые действия отклоняются.
