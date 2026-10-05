# Проверки

- Backend: tests/WitcherKM.Planner.Tests, xUnit. DomainTests проверяет модель; ApplicationIntegrationTests вызывает реальные обработчики с Common unit of work, EF Core, миграциями и отдельной временной SQLite-базой для каждого теста. Эти интеграционные тесты не запускают HTTP-host и не используют пользовательскую planner.db.
- Frontend: Vitest + Testing Library в scripts/tests, jsdom. API-функции заменяются контролируемыми ответами; проверяется видимое поведение форм/страниц, а не структура исходного текста.
- Browser smoke: Playwright в scripts/e2e, отдельный Vite на 127.0.0.1:5179, API подменяется только внутри тестового браузера. Это проверка браузерного UX, не полная HTTP-интеграция с backend.
- Команды: dotnet test WitcherKM.Planner.sln; dotnet build WitcherKM.Planner.sln; в scripts — npm test, npm run lint, npm run build, npm run test:e2e. Требуется .NET SDK 10; при системном SDK 9 использовать установленный %USERPROFILE%/.dotnet/dotnet.exe.
- Правило неизменности тестовых ожиданий и процесс проверки см. [.agents/skills/testing](../../.agents/skills/testing/SKILL.md).

Для browser smoke нужен Chromium Playwright (npx playwright install chromium). На этой машине использован уже установленный Edge: в PowerShell $env:PLAYWRIGHT_CHANNEL='msedge'; npm run test:e2e. Результаты находятся в artifacts/playwright и не коммитятся. Настоящий HTTP-host с пользовательским ключом MediatR этим набором не запускается.

Дополнительные suites: DomainInvariantTests — атомарность отказа редактирования, Canceled-идея, терминальная защита удаления и повторное закрытие проекта; interaction-regressions.test.tsx — порядок ответов/актуальный callback/размонтирование, селект и имена диалогов; route-regressions.test.tsx — изоляция редакторов трёх карточек. interaction-regressions.spec.ts дополняет браузерный прогон формой общей фичи, ошибкой/повтором сохранения, возвратом фокуса и прямым переходом истории между задачами.
