# Сценарии фич

Правила: [Feature](../domain/feature.md), [Project](../domain/project.md). Адаптер: FeaturesController.

| Сценарий | Вход и оркестрация | Результат |
| --- | --- | --- |
| ListFeatures | Прочитать фичи с названиями проектов | id, name, description, featureStatus, projectId, projectName |
| AddFeature | name, description, projectId; загрузить родителя, создать Feature, вызвать Project.AddFeature, сохранить | Новая модель с проектом |
| UpdateFeature | featureId, name, description; найти фичу и проект, вызвать Update, сохранить | Обновлённая модель |
| ChangeFeatureStatus | featureId, featureStatus; найти объект, выбрать доменный метод перехода, сохранить | Обновлённая модель |
| RemoveFeature | featureId; найти, вызвать доменную проверку удаления, удалить и сохранить | Без тела |

Отсутствующая фича/родитель → EntityNotFoundException. Неподдерживаемый enum → ошибка без записи. Ограничение F-04 сохраняется; политика каскада не предполагается.

Приёмка: новая фича видна в общем списке и карточке родителя; изменение и смена статуса отражены после повторного чтения; терминальные действия и добавление в закрытый проект отклоняются.
