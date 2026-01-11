# 🚀 WorkHub - CES System (Customer and Employee Service System)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Backend](https://img.shields.io/badge/.NET-8.0-purple.svg)
![Frontend](https://img.shields.io/badge/React-18-blue.svg)

A full-stack, enterprise-grade **Issue Tracking System** built with **Clean Architecture**. This application helps teams manage issues, assign tasks, track bugs, and collaborate in real-time with a secure, role-based environment.

---

## ✨ Key Features

- **🔐 Role-Based Access Control (RBAC)**: secure environment with distinct roles for Admins, Developers, QAs, and Clients.
- **💬 Real-time Collaboration**: Nested comments system on issues and tasks.
- **📜 Audit Trails**: Comprehensive audit logging for all critical actions (Create, Update, Delete).
- **🎨 Glassmorphism UI**: A stunning, modern user interface built with Tailwind CSS.
- **🗑️ Soft Deletes**: Data safety features ensuring no accidental permanent loss of records.
- **📊 Dynamic Dashboard**: Interactive dashboard with priority sorting, status filtering, and visual metrics.

---

## 🛠️ Technology Stack

### **Backend**
- **Framework**: ASP.NET Core Web API (.NET 8)
- **Database**: SQLite (Dev) / SQL Server (Prod ready)
- **ORM**: Entity Framework Core
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API layers)
- **Auth**: JWT Authentication with Claims

### **Frontend**
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Context API
- **Build**: Vite

---

## 🏗️ Architecture

The project follows the **Clean Architecture** principles to ensure separation of concerns and testability:

1.  **Domain Layer**: Core entities (`Issue`, `Task`, `Comment`) and enterprise logic.
2.  **Application Layer**: Business rules, DTOs, and Interfaces.
3.  **Infrastructure Layer**: Database context, Migrations, and external services.
4.  **API Layer**: RESTful Controllers and Middleware.

---

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)

### 1. Clone the Repository
```bash
git clone https://github.com/SarveeshK/Issue_Tracker.git
cd Issue_Tracker
```

### 2. Backend Setup
Navigate to the API folder and restore dependencies:
```bash
cd backend/src/IssueTracker.API
dotnet restore
dotnet ef database update --project ..\IssueTracker.Infrastructure --startup-project .
dotnet run
```
*The API will start at `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*The UI will launch at `http://localhost:5173`*

---

## 🛡️ Default Logins

To quickly test the specific roles, you can seed the database and use:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | Admin123! |
| **Developer** | dev@example.com | Dev123! |
| **Client** | client@example.com | Client123! |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any features or bug fixes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by SarveeshK
</p>
