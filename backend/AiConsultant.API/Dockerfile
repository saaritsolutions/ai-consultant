# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore as distinct layer
COPY ["AiConsultant.API/AiConsultant.API.csproj", "AiConsultant.API/"]
COPY ["AiConsultant.Core/AiConsultant.Core.csproj", "AiConsultant.Core/"]
COPY ["AiConsultant.Infrastructure/AiConsultant.Infrastructure.csproj", "AiConsultant.Infrastructure/"]
RUN dotnet restore "AiConsultant.API/AiConsultant.API.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/AiConsultant.API"
RUN dotnet build "AiConsultant.API.csproj" -c Release -o /app/build

# ── Stage 2: Publish ──────────────────────────────────────────────────────────
FROM build AS publish
RUN dotnet publish "AiConsultant.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ── Stage 3: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "AiConsultant.API.dll"]
