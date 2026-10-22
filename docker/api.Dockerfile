FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

# Planner consumes versioned Common packages; build them from the adjacent repository.
COPY --from=common /WitcherKM.Common.Core/WitcherKM.Common.Core.csproj /source/common/WitcherKM.Common.Core/
COPY --from=common /WitcherKM.Common.Core/Exceptions/ /source/common/WitcherKM.Common.Core/Exceptions/
COPY --from=common /WitcherKM.Common.Core/Middleware/ /source/common/WitcherKM.Common.Core/Middleware/
COPY --from=common /WitcherKM.Common.Domain/WitcherKM.Common.Domain.csproj /source/common/WitcherKM.Common.Domain/
COPY --from=common /WitcherKM.Common.Domain/Entities/ /source/common/WitcherKM.Common.Domain/Entities/
COPY --from=common /WitcherKM.Common.Orm/WitcherKM.Common.Orm.csproj /source/common/WitcherKM.Common.Orm/
COPY --from=common /WitcherKM.Common.Orm/Abstractions/ /source/common/WitcherKM.Common.Orm/Abstractions/
COPY --from=common /WitcherKM.Common.Orm/DI/ /source/common/WitcherKM.Common.Orm/DI/
COPY --from=common /WitcherKM.Common.Orm/Internal/ /source/common/WitcherKM.Common.Orm/Internal/
COPY --from=common /WitcherKM.Common.Orm/Repositories/ /source/common/WitcherKM.Common.Orm/Repositories/
RUN dotnet pack /source/common/WitcherKM.Common.Core/WitcherKM.Common.Core.csproj -c Release -o /packages \
    && dotnet pack /source/common/WitcherKM.Common.Domain/WitcherKM.Common.Domain.csproj -c Release -o /packages \
    && dotnet pack /source/common/WitcherKM.Common.Orm/WitcherKM.Common.Orm.csproj -c Release -o /packages

COPY src/ /source/planner/src/
COPY shared/ /source/planner/shared/
RUN dotnet restore /source/planner/src/WitcherKM.Planner.Api/WitcherKM.Planner.Api.csproj \
        --source /packages --source https://api.nuget.org/v3/index.json \
    && dotnet publish /source/planner/src/WitcherKM.Planner.Api/WitcherKM.Planner.Api.csproj \
        -c Release -o /publish --no-restore

FROM build AS test
COPY tests/ /source/planner/tests/
RUN dotnet restore /source/planner/tests/WitcherKM.Planner.Tests/WitcherKM.Planner.Tests.csproj \
        --source /packages --source https://api.nuget.org/v3/index.json \
    && dotnet test /source/planner/tests/WitcherKM.Planner.Tests/WitcherKM.Planner.Tests.csproj \
        -c Release --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
RUN mkdir -p /data && chown $APP_UID:$APP_UID /data
COPY --from=build /publish/ ./
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "WitcherKM.Planner.Api.dll"]
