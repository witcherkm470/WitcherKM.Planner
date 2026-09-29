# Backend

## Используемый стек

- .NET 10 и ASP.NET Core Web API;
- MediatR 14.2.0;
- Entity Framework Core 10.0.11 с SQLite;
- Swashbuckle.AspNetCore 10.2.3 для Swagger;
- пакеты `WitcherKM.Common.Core`, `WitcherKM.Common.Domain`, `WitcherKM.Common.Orm` версии 0.1.5.

API запускается из `WitcherKM.Planner.Api/Program.cs`. В Development подключаются Swagger и Swagger UI. API загружает `shared/appsettings.json` и при запуске вызывает `Database.MigrateAsync()` через `ApplyDatabaseMigrationsAsync`.

## Правила текущих слоёв

### Domain

Содержит доменные сущности, перечисления состояний и проверки в методах предметной модели. В рамках DDD здесь остаются инварианты и поведение предметной модели; не переносить их в контроллеры, DTO или UI. Доменные ошибки выражаются через используемые Common abstractions.

### Application

Содержит классы сценариев с вложенными `Command`/`Query` и `Handler`. Обработчики регистрируются MediatR из assembly `Application`. Команды изменения используют `IUnitOfWorkManager`: создают unit of work, вызывают репозиторий и фиксируют изменения методом `CommitAsync`.

### Application.Common

Содержит общие прикладные модели, расширения маппинга и прикладные исключения.

### Infrastructure

Содержит `DbContext`, EF Core-конфигурации, миграции и реализации репозиториев. Репозитории регистрируются в DI как scoped.

### Api

Контроллеры принимают request-модели и передают команды/запросы в `IMediator`. Глобальный `UseCustomExceptionMiddleware` подключается из `WitcherKM.Common.Core`; его точный формат HTTP-ошибок в этом репозитории не определяется.

## Persistence и миграции

- `DbContext` содержит `DbSet`, а правила их хранения задаются конфигурациями EF Core.
- Провайдер базы данных и строка подключения настраиваются через конфигурацию приложения.
- Конфигурации сущностей применяются методом `ApplyConfigurationsFromAssembly`.
- Связи и правила удаления задаются конфигурациями EF Core.
- Миграции находятся в `Infrastructure/Migrations` и применяются API при старте. Изменение persistent-модели требует новой миграции.

## DI

`Api` собирает приложение через расширения DI слоёв. Infrastructure регистрирует контекст, unit of work и репозитории; Application регистрирует MediatR. Необходимые настройки берутся из конфигурации приложения.

## API

Контроллеры реализуют HTTP-адаптацию сценариев чтения и изменения данных. Актуальные URL и контракты следует брать из относящихся к задаче контроллера и request-моделей: в этой документации не следует создавать новый контракт без спецификации.

Строгий порядок выполнения backend-задач находится в [rules/backend.md](../rules/backend.md).
