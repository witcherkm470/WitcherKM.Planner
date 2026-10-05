# Сценарии проектов

Правила модели: [Project](../domain/project.md). HTTP-адаптер: ProjectsController.

| Сценарий | Вход и оркестрация | Результат |
| --- | --- | --- |
| ListProjects | Прочитать репозиторий | id, name, description, projectStatus |
| ProjectChoices | Прочитать идентификаторы и названия | Список для выбора родителя фичи |
| GetProject | projectId; найти проект, отдельно посчитать Opened-фичи | Модель + documentation + openedFeatureCount |
| AddProject | name, description; создать Project и сохранить | Созданная модель |
| UpdateProject | projectId, name, description; найти и вызвать Update | Обновлённая модель |
| UpdateProjectCard | те же данные + documentation; Update и SetDocumentation | Полная карточка с актуальным счётчиком |
| RemoveProject | projectId; найти, проверить наличие связанных фич запросом (P-05), удалить и сохранить | Без тела |
| ProjectFeatures | projectId; выбрать фичи проекта | id, name, description, featureStatus |

Отсутствующий объект для карточки/изменения даёт EntityNotFoundException; удаление со связями — DeleteProjectException. Команды фиксируются через unit of work; ошибка не должна сохранять частичные изменения.

Приёмка: CRUD отражается в последующем чтении; документация переживает повторную загрузку; openedFeatureCount считает только Opened; удаление с фичами отклоняется.
