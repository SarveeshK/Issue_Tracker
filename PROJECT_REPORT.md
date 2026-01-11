# WorkHub - CES System
## Customer and Employee Service System: Project Report

---

### 1. Executive Summary
**WorkHub-CES** is a modern, enterprise-grade web application designed to bridge the gap between customers (Clients) and technical teams (Employees). It serves as a centralized platform for tracking issues, managing tasks, and facilitating seamless communication.

Built with a **Clean Architecture** philosophy, the system ensures scalability, maintainability, and security. It leverages the power of **.NET 8** for a high-performance backend and **React 18** for a responsive, dynamic frontend.

> **Note**: AI agents were used as architectural assistants and implementation accelerators, while all core design decisions, data modeling, and system integration were authored, validated, and owned by the developer.

---

### 2. Core Functional Modules

#### A. Role-Based Access Control (RBAC)
The system enforces strict security boundaries based on user roles:
-   **Clients ("User")**: Restricted environment. Can only view and manage issues explicitly associated with their account.
-   **Employees**: Access to assigned tasks and collaborative features.
-   **Admins**: Full system oversight.

#### B. Real-Time Collaboration
-   **Threaded Comments**: Users can discuss issues in threaded conversations.
-   **Anonymized Support**: To maintain professional boundaries, employee identities are anonymized for client users through role‑aware DTO mapping, presenting comments under a generic support identity ("techsupport@macs.com").

#### C. Audit & Compliance
-   **Activity Timeline**: A visual log of every critical action (Creation, Assignment, Status Change), providing total transparency.
-   **Soft Deletes**: Data is never essentially lost; entities are "soft deleted" to preserve historical integrity.

---

### 3. Technical Architecture

The solution follows the **Clean Architecture** (Onion Architecture) pattern, strictly separating concerns to ensure business rules remain framework‑agnostic and independently testable:

1.  **Domain Layer** (Inner Circle)
    -   *Pure C# Entities*: `Issue`, `Task`, `Comment`, `AuditLog`.
    -   *Enterprise Logic*: Validation rules and domain events.
    -   *Dependencies*: None.

2.  **Application Layer**
    -   *Orchestration*: Use Cases and Service interfaces (`IIssueService`).
    -   *DTOs*: Decoupled data contracts for API communication.
    -   *Role Logic*: Handling anonymization and permission checks.

3.  **Infrastructure Layer**
    -   *Persistence*: Entity Framework Core with SQLite for local development, with a schema fully compatible with MySQL for production deployment.
    -   *Migrations*: Database schema management.
    -   *Repositories*: Generic Repository implementation.

4.  **Presentation Layer (API)**
    -   *Endpoints*: RESTful controllers exposing resources.
    -   *Security*: JWT Token generation and Claims middleware.

5.  **Frontend (Client)**
    -   *Stack*: React 18, TypeScript, Tailwind CSS, Vite.
    -   *State*: Context API (`AuthContext`) for global session management.
    -   *UI Components*: Reusable, accessible components (`CommentsSection`, `ActivityTimeline`).

---

### 4. Challenges & AI-Driven Solutions

Developing WorkHub-CES involved overcoming significant complexities. Here is how AI assistance accelerated the process:

| Challenge | Technical Hurdle | AI Solution |
| :--- | :--- | :--- |
| **Data Privacy** | Clients needed to see strictly their own data without complex query logic in every controller. | AI suggested and implemented **Server-Side Filtering** within the Service layer, injecting `CurrentUserId` into repository queries automatically. |
| **Privacy Anonymization** | Client users should not see individual employee names in comments to prevent harassment. | Designed a dynamic **DTO Mapping Strategy** that checks `RequesterRole` and masks `UserName` on the fly before data leaves the API. |
| **Complex UI State** | The `TaskDetail` page required syncing comments, logs, and task data simultaneously. | AI architected a **Unified Component Structure** using custom hooks and distinct `useEffect` dependencies to manage asynchronous data fetching without race conditions. |
| **Database Migrations** | Multi-project solution caused EF tool failures (`DbContext` not found). | AI provided precise EF Core CLI targeting strategies using `--project` and `--startup-project` flags, enabling reliable migrations in a multi‑project Clean Architecture setup. |

---

### 📅 Future Roadmap
- [x] **Phase 1**: Core CRUD & Authentication (Completed)
- [x] **Phase 2**: Advanced RBAC & Security (Completed)
- [x] **Phase 3**: UI Polish & Anonymization (Completed)
- [x] **Phase 4**: Cloud Deployment & Containerization (Completed - Live on Render)
-   **🔔 Notification Engine**: Email and real-time socket alerts for task assignments.
-   **📎 File Attachments**: Azure Blob Storage integration for screenshot uploads.
-   **🧩 Kanban Board**: Interactive drag‑and‑drop board for visual task management.

---

<p align="center">
  <em>Document prepared by the WorkHub Engineering Team with AI‑assisted tooling</em>
</p>
