# WorkHub (CES System) Project Report

## 1. Project Overview
The **Issue Tracker** is a full-stack web application designed to help teams track issues, bugs, and tasks efficiently. It features a robust role-based access control (RBAC) system, allowing different user types (Admins, Developers, QAs, Managers, and Clients) to interact with the system according to their permissions.

## 2. Technology Stack

### Frontend
- **Framework**: React 18 (with Hooks and Functional Components)
- **Language**: TypeScript (for strong typing and safety)
- **Build Tool**: Vite (for fast development and bundling)
- **Styling**: Tailwind CSS (Utility-first CSS framework for modern UI)
- **Routing**: React Router DOM (v6)
- **State Management**: Context API (AuthContext for user sessions)
- **HTTP Client**: Axios (with centralized interceptors in `api.ts`)
- **Icons**: Heroicons (via inline SVGs)

### Backend
- **Framework**: ASP.NET Core Web API (.NET 8.0)
- **ORM**: Entity Framework Core (Code-First approach)
- **Database**: SQLite (for development portability)
- **Authentication**: JWT (JSON Web Tokens) with Claims-based authorization.
- **Architecture**: Clean Architecture / N-Layered Architecture.

## 3. Architecture Hierarchy

The project follows a **Clean Architecture** pattern to separate concerns and ensure maintainability.

### Backend Structure
1.  **IssueTracker.Domain**: The core of the application.
    -   *Entities*: Database models (`Issue`, `Task`, `User`, `Comment`, `AuditLog`).
    -   *Interfaces*: Repository contracts (`IRepository<T>`).
    -   *Enums/Constants*: `Role`, `Status`, `Priority`.
    -   *Dependencies*: None. Pure C#.

2.  **IssueTracker.Application**: Business logic layer.
    -   *DTOs (Data Transfer Objects)*: Objects for API communication (`IssueDto`, `CreateCommentDto`), decoupled from entities.
    -   *Services*: Business rules (`IssueService`, `TaskService`, `AuthService`).
    -   *Interfaces*: Service contracts (`IIssueService`).

3.  **IssueTracker.Infrastructure**: External concerns.
    -   *Data*: DbContext (`IssueTrackerContext`) and Migrations.
    -   *Repositories*: Implementation of data access (`GenericRepository<T>`).

4.  **IssueTracker.API**: The entry point.
    -   *Controllers*: RESTful endpoints (`IssuesController`, `AuthController`).
    -   *Program.cs*: Dependency Injection (DI) setup and Middleware configuration.

### Frontend Structure
-   **src/pages**: Main views (`Dashboard`, `IssueDetail`, `TaskDetail`, `Login`).
-   **src/components**: Reusable UI blocks (`CommentsSection`, `ActivityTimeline`, `Layout`).
-   **src/services**: API communication logic (`api.ts`).
-   **src/context**: Global state providers (`AuthContext.tsx`).
-   **src/types**: TypeScript interfaces syncing with Backend DTOs.

## 4. Key Features Implemented
-   **Role-Based Security**: Clients (`User` role) are strictly sandboxed to their own issues. Employees (`Developer`, `QA`) generally focus on assigned tasks. Admins have full control.
-   **Audit Logging**: Every major action (Create, Update, Delete) is logged and displayed in an interactive timeline.
-   **Soft Deletes**: Entities are marked as `IsDeleted` instead of being removed, preserving history.
-   **Comments System**: Threaded discussions on both Issues and Tasks.
-   **Modern Dashboard**: Color-coded priorities, status badges, and intuitive sorting (Open > Closed).

## 5. Challenges & Solutions

Throughout the development lifecycle, we encountered several challenges. Here is how we overcame them:

### A. Database Migrations & Context
-   **Challenge**: The Backend utilizes a multi-project solution. Running `dotnet ef` commands often failed because the tool couldn't locate the `DbContext` or the startup project.
-   **Solution**: We adopted strict command syntax using explicit flags:
    `dotnet ef migrations add <Name> --project ..\IssueTracker.Infrastructure --startup-project .`
    This ensured the tooling knew exactly where the Models lived and where the configuration was.

### B. Missing Comments Table
-   **Challenge**: After implementing the Comments code, the feature failed silently (500 Internal Error) because the database table didn't exist.
-   **Solution**: We investigated the `Migrations` folder, realized the `AddComments` migration was never created, generated it, and applied it.

### C. Role-Based Data Filtering
-   **Challenge**: Initially, the `GetAllIssues` endpoint returned everything. We needed Clients to only see *their* issues without creating separate "Client" endpoints.
-   **Solution**: We implemented **Server-Side Filtering** in `IssueService`. By passing the `currentUserId` and `role` to the service method, we dynamically filtered the generic repository query, ensuring security at the data access level over simple UI hiding.

### D. Frontend State & UI Breakages
-   **Challenge**: The `TaskDetail` page became unstable/broken due to partial updates and mixed logic during the rapid iteration of the API.
-   **Solution**: We performed a **Complete Component Rewrite**. Instead of patching lines, we rewrote `TaskDetail.tsx` from scratch to ensure clean state management, proper hook usage, and integration of the new `CommentsSection` component.

### E. File Locking
-   **Challenge**: `IssueTracker.API.exe` would often lock database files or DLLs, preventing builds or migrations.
-   **Solution**: We utilized the `taskkill /F /IM IssueTracker.API.exe` command to forcefully free resources before backend operations.

## 6. Future Roadmap
-   **Email Notifications**: Send alerts on task assignment.
-   **File Attachments**: Allow image uploads for bugs.
-   **Kanban Board**: Drag-and-drop status updates.
