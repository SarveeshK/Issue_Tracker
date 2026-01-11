# 🚀 WorkHub - CES System
### Customer and Employee Service System

![Status](https://img.shields.io/badge/Status-Live_Production-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Deployment](https://img.shields.io/badge/Deployed_on-Render-purple)

## 🚀 Live Demo
**Access the Production System here:** [https://issue-tracker-13zc.onrender.com](https://issue-tracker-13zc.onrender.com)
*(Login credentials provided in the Project Report)*

## 📖 Project Overview
![AI Assisted](https://img.shields.io/badge/Built%20With-AI%20Assistance-blueviolet)

**WorkHub-CES** is a comprehensive, enterprise-grade solution designed to streamline interactions between customers and employees. Built with a modern tech stack and Clean Architecture principles, it offers robust role-based access control, real-time collaboration, and secure data management.

---

## 🛠️ Technology Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

### **Backend**
![.NET Core](https://img.shields.io/badge/.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![Entity Framework](https://img.shields.io/badge/Entity%20Framework-512BD4?style=for-the-badge&logo=.net&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

---

## ✨ Key Features

- **🔐 Role-Based Access Control (RBAC)**
  - Strictly separated environments for **Clients** (Users) and **Employees** (Developers/Admins).
  - Secure data filtering: Clients only see and manage issues explicitly associated with their account.

- **💬 Real-Time Collaboration**
  - Threaded **Comments System** on Issues and Tasks.
  - **Anonymized Support**: To maintain professional boundaries, employee identities are anonymized for client users through role‑aware DTO mapping ("techsupport@macs.com").

- **📜 Comprehensive Audit Logs**
  - Activity timeline tracking every creation, update, and deletion.
  - **Soft Deletes**: Data preservation structure.

- **🎨 Modern UI/UX**
  - **Glassmorphism** design using Tailwind CSS.
  - Interactive **Dashboard** with priority sorting (High/Medium/Low) and status indicators.

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- .NET 8 SDK

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/SarveeshK/Issue_Tracker.git
    ```

2.  **Backend Setup**
    ```bash
    cd backend/src/IssueTracker.API
    dotnet run
    ```
    *Server starts on http://localhost:5000*

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Client starts on http://localhost:5173*

---

## 🤖 AI Assistance
AI agents were used as architectural assistants and implementation accelerators, while all core design decisions, data modeling, and system integration were authored, validated, and owned by the developer. The agents assisted with:
-   **Clean Architecture** design.
-   **Full-stack implementation** (React + .NET).
-   **Debugging and Refactoring** complex logic.
-   **Security auditing** (RBAC & Anonymization).

---

<p align="center">
  Document prepared by the WorkHub Engineering Team with AI‑assisted tooling
</p>
