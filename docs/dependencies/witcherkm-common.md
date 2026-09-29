# Использование WitcherKM.Common

Planner использует пакеты `WitcherKM.Common.Core`, `WitcherKM.Common.Domain` и `WitcherKM.Common.Orm` версии 0.1.5. Их исходный код в репозитории отсутствует; ниже отражены только публичные возможности, которые видны по использованию Planner.

## WitcherKM.Common.Core

| Используемая возможность | Где используется                                  |
| --- |---------------------------------------------------|
| `DomainException` | Доменные проверки в `Project`, `Feature`, `Idea`. |
| `EntityNotFoundException` | Обработчики Application при отсутствии объекта.   |
| `UseCustomExceptionMiddleware()` | Конвейер API в `Program.cs`.                      |

Пример из `Project`:

```csharp
if (string.IsNullOrWhiteSpace(value))
    throw new DomainException("Project name cannot be empty");
```

## WitcherKM.Common.Domain

| Используемая возможность | Где используется |
| --- | --- |
| `IEntity` | Реализуется сущностями `Project`, `Feature`, `Idea`. |

## WitcherKM.Common.Orm

| Используемая возможность | Где используется |
| --- | --- |
| `IEntityRepository<TEntity>` | Базовый контракт `IProjectRepository`, `IFeatureRepository`, `IIdeaRepository`. |
| `EntityRepository<TEntity, TContext>` | Базовый класс реализаций репозиториев. |
| `IUnitOfWorkManager` | Создание unit of work в командах Application. |
| `AddUnitOfWork<TContext>()` | Регистрация unit of work в Infrastructure. |

Пример из обработчика `AddProject`:

```csharp
using var unitOfWork = _unitOfWorkManager.Create();
await _projectRepository.AddAsync(project, cancellationToken);
await unitOfWork.CommitAsync(cancellationToken);
```

При реализации следует предпочитать уже используемые абстракции `WitcherKM.Common.*`, а не создавать их дубликаты. Если нужной возможности в Common нет или её API невозможно определить по пакету и существующему коду, агент не должен выдумывать контракт: это требует отдельного уточнения или исследования доступной документации пакета.
