# WitcherKM.Planner

## Dev на Windows

Нужны .NET SDK 10 и Node.js 24 LTS (с npm). После установки перезапустите Rider и терминал.
В Rider выберите .NET SDK 10; скрипт также проверяет SDK в `%USERPROFILE%\.dotnet`.

Расположите репозитории рядом:

```text
RiderProjects/
  WitcherKM.Common/
  WitcherKM.Planner/
```

Первичная подготовка из папки Planner:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1 setup
```

Скрипт собирает пакеты WitcherKM.Common (Core, Domain, Orm) из соседнего репозитория
в artifacts/nuget, восстанавливает и собирает .NET-решение, устанавливает npm-пакеты
вместе с devDependencies из package-lock.json и собирает фронтенд.
Папка artifacts не хранится в Git. При другом расположении Common передайте `-CommonPath C:\path\WitcherKM.Common`.
Версии Common должны соответствовать PackageReference в Planner (сейчас 0.1.5).

Запуск в двух терминалах из папки Planner:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1 api
```

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1 web
```

Фронтенд: http://localhost:5173. API и Swagger: http://localhost:5062/swagger.
Vite проксирует /api на порт 5062. SQLite не требует отдельного сервера;
приложение само применяет миграции при запуске и создаёт локальную planner.db.

Для фронтенда можно также выполнить `npm.cmd ci --include=dev`, затем `npm.cmd run dev`
из папки scripts. Vite, React, TypeScript и типы устанавливаются локально;
глобальная установка Vite не нужна.
## Ключ MediatR

API требует `MediatR:LicenseKey` и без него завершает запуск.
Для локальной разработки один раз запустите настройку. Скрипт скрыто запросит ключ
и запишет его в .NET User Secrets проекта API:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1 configure
```

Скрипт `dev.ps1 api` использует сохранённый ключ автоматически.
User Secrets хранятся вне репозитория и предназначены только для разработки.
Не сохраняйте рабочий ключ в Git, `shared/appsettings.json` или исходном коде.

## Запуск и проверка в Docker

Нужны Docker Desktop с Docker Compose 2.17+ и соседний репозиторий `WitcherKM.Common`
версии 0.1.5. Docker собирает образы из **локальных файлов** обоих репозиториев:
команды ниже сами не выполняют `git pull`, `git commit` или `git push`.
Для Docker не требуется устанавливать .NET SDK и Node.js на компьютер.

Из папки проекта запустите один файл:

```powershell
powershell -ExecutionPolicy Bypass -File .\docker.ps1
```

Его можно вызвать и по полному пути из любого терминала либо выбрать для файла
`docker.ps1` действие «Выполнить с помощью PowerShell» в Проводнике. При первом
запуске скрипт скрыто запросит ключ MediatR и запишет его в `secrets/MediatR__LicenseKey`.
Каталог исключён из Git и Docker-контекста. Docker Compose подключает файл только к API;
ключ не входит в образ. При обновлениях вводить его снова не нужно. Это обычный файл
на вашем компьютере: ограничьте доступ к нему и храните резервную копию отдельно.
Ключ из .NET User Secrets в контейнер автоматически не переносится.
Старый локальный `.env` с `MEDIATR_LICENSE_KEY` больше не используется; после проверки
нового запуска его можно удалить.

Один запуск обновляет базовые образы, собирает API и фронтенд, выполняет backend-тесты,
frontend-тесты и lint, затем пересоздаёт контейнеры и проверяет HTTP-ответы клиента
и API. Если проверка не прошла, запущенные контейнеры не обновляются. Браузерные
Playwright-тесты в этот сценарий не входят.

При необходимости запустите только проверку, без обновления контейнеров:

```powershell
powershell -ExecutionPolicy Bypass -File .\docker.ps1 check
```

Откройте http://localhost:8080. Фронтенд и `/api` доступны через один адрес
только с этого компьютера; внешний порт привязан к `127.0.0.1`.
API слушает только внутреннюю сеть Docker. При первом запуске API применяет миграции;
SQLite хранится в постоянном томе `planner-data` и сохраняется при пересоздании контейнеров.

После правок в локальных файлах повторите ту же команду без параметров. Проверьте
приложение в браузере и только затем отправляйте свои коммиты в Git. Если обновляете
код из удалённого репозитория, выполните `git pull` отдельно перед запуском скрипта.
Сам скрипт не выполняет `git pull` или `git push`.

Для просмотра логов: `powershell -ExecutionPolicy Bypass -File .\docker.ps1 logs`.
Для остановки: `powershell -ExecutionPolicy Bypass -File .\docker.ps1 stop`.
`stop` сохраняет том с базой; не используйте `docker compose down -v`, если нужны данные.
Для доступа из интернета потребуется отдельно настроить HTTPS и защиту доступа к приложению.
Шаблон запуска готовых образов на собственном сервере находится в [deploy/README.md](deploy/README.md).
Схема источников конфигурации описана в [docs/architecture/configuration.md](docs/architecture/configuration.md).
