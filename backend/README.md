# SAHAYA Humanitarian Aid Platform — Enterprise Backend
> **SE205.3 Software Architecture Coursework 2026** | NSBM Green University Town  
> **Architecture:** C# ASP.NET Core .NET 9 Web API + Microsoft SQL Server + Clean Microservices Architecture + YARP API Gateway  

---

## 🏛️ Architecture Overview

The backend is structured into vertical-slice microservices routed via a central API Gateway:

```text
sahaya-backend/
├── Sahaya.sln
└── src/
    ├── Sahaya.Gateway/          (Port: 5000) YARP API Gateway, Reverse Proxy & CORS
    ├── Sahaya.Common/           Shared Entities, Enums (UserRole), Result Pattern
    └── Services/
        ├── Identity.API/        (Port: 5001) Member 1: Auth, RBAC, Users SQL Server DB
        ├── Assistance.API/      (Port: 5002) Member 2: Citizen SOS & Household Profiles
        ├── Coordination.API/    (Port: 5003) Member 3: Crisis Triage & Incident Hub
        ├── Logistics.API/       (Port: 5004) Member 4: Shelters & Warehouse Depot
        ├── AIIntelligence.API/  (Port: 5005) Member 5: AI Decision Engine & Overrides
        └── Operations.API/      (Port: 5006) Member 6: Volunteers, GIS & Donations
```

---

## 🚀 How to Run Member 1 (Identity API & Gateway)

### 1. Run Identity API (Port 5001)
```bash
cd src/Services/Identity.API
dotnet run
```
* **Swagger UI:** [http://localhost:5001](http://localhost:5001)

### 2. Run API Gateway (Port 5000)
```bash
cd src/Sahaya.Gateway
dotnet run
```
* **Gateway Status:** [http://localhost:5000](http://localhost:5000)

---

## 🔑 Seeded Demo Credentials (BCrypt)
| Role | Email | Password |
|:---|:---|:---|
| **System Administrator** | `admin@sahaya.org` | `Admin@123` |
| **Emergency Coordinator** | `coordinator@sahaya.org` | `Coordinator@123` |
| **Affected Citizen** | `citizen@sahaya.org` | `Citizen@123` |
