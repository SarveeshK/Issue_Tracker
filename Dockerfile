# Stage 1: Build React Frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app/backend
COPY backend/src/IssueTracker.Domain/ ./src/IssueTracker.Domain/
COPY backend/src/IssueTracker.Application/ ./src/IssueTracker.Application/
COPY backend/src/IssueTracker.Infrastructure/ ./src/IssueTracker.Infrastructure/
COPY backend/src/IssueTracker.API/ ./src/IssueTracker.API/
WORKDIR /app/backend/src/IssueTracker.API
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/publish .
# Copy Frontend build to wwwroot
COPY --from=frontend-build /app/frontend/dist ./wwwroot
# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "IssueTracker.API.dll"]
