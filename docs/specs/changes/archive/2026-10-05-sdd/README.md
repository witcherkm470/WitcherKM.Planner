# Переход к canonical SDD и исправление соответствия — 2026-10-05

Источник: запрос владельца Planner разделить domain/application/UI/architecture, добавить workflow skills, сверить реализацию, дополнить модалки, тесты и сборки. Последующим сообщением разрешены commit и push только относящихся к работе файлов.

Статус: завершено; реализация и итоговые проверки успешны. Неоднозначные продуктовые решения вынесены в [questions](../../../questions.md), они не заменены предположениями.

## Перенос исходных требований

| Оригинал (сохранён без изменений) | Canonical |
| --- | --- |
| [projects/initial](legacy/projects/initial.md) | domain/project; application/projects; ui/projects-page и project-page |
| [projects/add-feature-card](legacy/projects/add-feature-card.md) | ui/project-page |
| [features/initial](legacy/features/initial.md) | domain/feature; application/features; ui/features-page |
| [features/feature-card](legacy/features/feature-card.md), [features/add-task](legacy/features/add-task.md) | ui/feature-page; ui/tasks-page; Q-01 |
| [ideas/initial](legacy/ideas/initial.md) | domain/idea; application/ideas; ui/ideas-page |
| [tasks/task-page](legacy/tasks/task-page.md) | domain/task; application/tasks; ui/tasks-page |
| [tasks/task-card](legacy/tasks/task-card.md) | ui/task-page; application/tasks |

Пути canonical в таблице относительны к docs/specs и имеют расширение .md. Технические правила остались в docs/architecture; skills ссылаются на них. docs/product и docs/rules стали краткими точками навигации вместо дубликатов.

## Подтверждённые несоответствия и исправления

| До | После | Проверка |
| --- | --- | --- |
| Feature.Completed можно открыть снова | Терминальность защищена Domain | DomainTests + Feature_round_trip_and_forbidden_changes_leave_completed_state_unchanged |
| AddFeature обходит Project.AddFeature | Закрытый проект отклоняет создание без записи | Closed_project_rejects_feature_without_persisting_it |
| Удаление по статусу защищено только handler | EnsureCanDelete в Feature/Idea/TaskItem, вызывается handler | Terminal_entities_cannot_be_deleted_and_task_status_filter_is_applied |
| Ответы изменения задач теряют Feature.Project | Все ответы содержат цепочку родителей; изменения сохраняются | Task_writes_return_full_parent_chain_and_persist_between_requests |
| Общая кнопка добавления задачи ничего не открывает | Модалка с обязательным выбором фичи; в карточке родитель фиксирован | tasks.test.tsx + browser smoke |
| Карточка задачи не имеет статуса/действий | Статус, редактор, переходы, удаление, ссылки на родителей | tasks.test.tsx + browser smoke |
| Счётчик задач фичи устаревает после действий | Перечитывается вместе со списком независимо от фильтра | tasks.test.tsx + browser smoke |
| Ошибки чтения/записи не везде показаны | ErrorModal на затронутых страницах, черновик остаётся | tasks.test.tsx |
| Формы допускают повторную отправку и неполную клавиатурную работу | Общий ModalFrame, блокировка, Escape, Tab, возврат фокуса | dialogs.test.tsx + browser smoke |
| UI именует Project.Opened/Closed как InProgress/Completed | Имена/подписи синхронизированы при сохранении значений 1/2 | build и browser smoke |
| ProjectCard вызывает синхронные setState из effect, lint падает | Черновик инициализируется при входе в редактор, key по проекту | lint + dialogs.test.tsx |
| Удалённая фича остаётся на «Загрузка» | Успешное удаление возвращает к списку фич | Код useFeatureActions; карточка ошибки/отсутствия явная |
| Порядок действий идеи противоречит design | Статусы перед пером/черепом | Код IdeasTable и browser smoke |

## Проверки и границы

До исправлений новые backend-тесты: 3 падения, 10 успешных. Новые UI-регрессии: 7 падений, 1 успешная. Ожидания не ослаблялись. Изначально существующих тестов в репозитории не было.

Backend-интеграция использует настоящие EF/SQLite/миграции и Common unit of work на временных БД. UI-компоненты и браузерные сценарии используют контролируемые API-ответы; это не сквозной прогон через настоящий HTTP-host. В тестовом стенде исправлен захват Vite-модулей слишком широкой маской API и добавлено ожидание завершения перехода страницы. Браузер выявил реальный баг возврата фокуса к ещё отключённой кнопке — исправлен код ModalFrame.

Схема БД, старые миграции и пользовательские данные не изменялись. Существующий Restrict при удалении фичи с задачами проверен интеграционно и сохранён; улучшение бизнес-политики зависит от Q-03. Три предупреждения CS9264 о EF-конструкторах были в исходной сборке и остаются.

## Итоговый прогон

| Проверка | Результат |
| --- | --- |
| dotnet build WitcherKM.Planner.sln -c Release --no-restore (SDK 10.0.401) | Успех, 0 ошибок, 3 исходных CS9264 |
| dotnet test WitcherKM.Planner.sln -c Release --no-build | 19/19: 7 доменных cases и 12 интеграционных |
| npm test | 18/18 UI-компонентных |
| npm run lint | Успех, без ошибок/предупреждений |
| npm run build | Успех |
| PLAYWRIGHT_CHANNEL=msedge npm run test:e2e | 3/3 браузерных сценария |
| quick_validate.py для четырёх SKILL.md | 4/4 |
| Локальные Markdown-ссылки | 44 документа, 0 битых ссылок |
| Сохранность legacy specs | Все 8 оригиналов совпадают с исходными (с нормализацией CRLF/LF) |
| git diff --check | Успех |

Старых тестов не было; добавлены новые suites и тестовая инфраструктура. Красные регрессии исправлены в коде; ожидания не подгонялись. Скриншоты браузера визуально проверены и оставлены среди игнорируемых artifacts. Исходные незакоммиченные NuGet.Config, README.md и dev.ps1 сохранены без изменений и исключены из коммита вместе с БД, bin/obj, node_modules, dist и результатами прогонов.
