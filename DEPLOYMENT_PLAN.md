# 🚀 WorkHub - CES System: Deployment Plan

This document outlines the strategy for deploying **WorkHub-CES** to a production environment.

---

## 🏗️ 1. Build & Publish Strategy

### **Frontend (React)**
The frontend needs to be compiled into static HTML/JS/CSS files.
- **Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Action**: These files will be served either by a dedicated web server (Nginx) or embedded into the .NET backend's `wwwroot`.

### **Backend (.NET 8)**
The API needs to be published in Release mode for performance optimization.
- **Command**: `dotnet publish -c Release -o ./publish`
- **Output**: A standalone folder containing the executable and DLLs.
- **Configuration**: `appsettings.Production.json` needs to be configured with production database credentials.

---

## 🌍 2. Hosting Options

### **Option A: Integrated Hosting (Recommended for Simplicity)**
Host the React app *inside* the .NET API.
1. Copy `frontend/dist/*` content to `backend/src/IssueTracker.API/wwwroot`.
2. Configure .NET middleware (`UseStaticFiles`, `MapFallbackToFile`) to serve the React app.
3. Deploy the single .NET application to IIS, Azure App Service, or a Linux VPS.

### **Option B: Decoupled Hosting (Recommended for Scale)**
Host Frontend and Backend separately.
1. **Frontend**: Deploy `dist` folder to Vercel, Netlify, or an S3 Bucket + CDN.
2. **Backend**: Deploy .NET API to a DigitalOcean Droplet, AWS EC2, or Azure Web App.
3. **Config**: Update Frontend's `VITE_API_URL` to point to the live Backend URL.

---

## 🗄️ 3. Database Strategy

### **Development (Current)**
- **Database**: SQLite (`app.db`).
- **Pros**: Zero setup, self-contained file.
- **Cons**: Not suitable for high-concurrency production.

### **Production**
- **Recommendation**: Switch to **SQL Server** or **PostgreSQL**.
- **Steps**:
    1. Update connection string in `appsettings.Production.json`.
    2. Run `dotnet ef database update` against the production server to create the schema.

---

## 📝 4. Step-by-Step Execution Plan

### **Phase 1: Preparation (Local)**
- [ ] Update CORS policy in Backend to allow production domain.
- [ ] Configure `appsettings.json` for production secrets.
- [ ] Run final production build locally to verify artifacts.

### **Phase 2: Build**
- [ ] Run `npm install && npm run build` (Frontend).
- [ ] Run `dotnet publish -c Release` (Backend).

### **Phase 3: Deployment (Simulation)**
- [ ] Create a local "Production" folder.
- [ ] Copy published backend files.
- [ ] Copy frontend build to `wwwroot`.
- [ ] Run the executable and test accessibility.

---

## ☁️ 3. Cloud Deployment (Render.com)

**Recommended for Free Tier Hosting** (Supports Docker + Persistent DB)

### **Prerequisites**
-   GitHub Repository updated with `Dockerfile`.
-   Render.com account.
-   Neon.tech (or Render) PostgreSQL database.

### **Steps**
1.  **Push Code**: Ensure all changes are on GitHub.
2.  **Create Service in Render**:
    -   Select **"New Web Service"**.
    -   Connect your GitHub repository.
    -   **Runtime**: Select **Docker**.
    -   **Region**: Choose closest to you (e.g., Singapore/Frankfurt).
3.  **Environment Variables**:
    -   Add `DefaultConnection`: `Host=[Host];Database=[DB];Username=[User];Password=[Pass];SSL Mode=Require;Trust Server Certificate=true`
    -   Add `ASPNETCORE_ENVIRONMENT`: `Production`
4.  **Deploy**: Render will build the Docker image and start the app.
