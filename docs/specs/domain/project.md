# Project

- P-01: название непустое и не состоит из пробелов; описание и документация необязательны. Обновление сохраняет значения без требования уникальности.
- P-02: новый проект имеет Opened = 1. Closed = 2 — закрытый проект.
- P-03: существующий доменный метод закрытия допускается при наличии хотя бы одной фичи и завершённости всех фич. Для проверки вызывающий код обязан загрузить полный набор фич. Повторное закрытие запрещено. Пользовательского use case закрытия/повторного открытия пока нет.
- P-04: в закрытый проект нельзя добавлять фичи; создание через application должно вызывать Project.AddFeature.
- P-05: удалить проект можно только без связанных фич. Наличие связей проверяет application запросом в репозиторий; это не проверка по потенциально незагруженной коллекции.

Источник: legacy/projects/initial.md и существующая модель Project. Запрет переименования закрытого проекта не задан и не добавлен.

Проверки: DomainTests.Required_text_is_validated_by_domain; Project_closure_requires_features_all_completed_and_blocks_addition; ApplicationIntegrationTests.Closed_project_rejects_feature_without_persisting_it; Project_cannot_be_deleted_with_features_and_card_counts_only_opened.
