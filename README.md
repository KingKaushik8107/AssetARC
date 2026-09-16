# AssetArc -- Industrial Equipment Lifecycle Monitor

> A full-stack industrial asset lifecycle management and
> condition-monitoring platform built with React and Spring Boot.

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F)
![Database](https://img.shields.io/badge/Database-MySQL-4479A1)
![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Spring%20Security-purple)

## 📌 Overview

AssetArc is an industrial equipment lifecycle monitoring system designed
to manage equipment from registration through maintenance and reporting.

### Core capabilities

-   Industrial asset registration and lifecycle tracking
-   Condition monitoring using health score, vibration and temperature
-   Condition-based maintenance
-   Automatic critical maintenance escalation
-   Maintenance scheduling and technician task completion
-   Maintenance cost and activity reporting
-   Fleet-wide dashboard analytics
-   Role-Based Access Control (RBAC)
-   JWT-based stateless authentication

A key business rule is automatic escalation when `healthScore < 40`. The
system creates a `CRITICAL` `REPAIR` maintenance schedule and changes
the asset status to `UNDER_MAINTENANCE`.

## 🎯 Problem Statement

Industrial organizations may manage many machines and equipment assets
simultaneously. Without centralized lifecycle tracking and
condition-based maintenance, it can be difficult to:

-   Track asset information and lifecycle details
-   Identify deteriorating equipment
-   Respond quickly to critical health conditions
-   Coordinate maintenance activities
-   Maintain maintenance history and cost records
-   Obtain a fleet-wide operational overview

AssetArc addresses these requirements through a centralized web
application.

## ✨ Features

### Asset Registry

Authorized users can register and manage assets with:

-   Asset tag
-   Asset name
-   Category
-   Installation date
-   Purchase price
-   Expected lifespan
-   Current status
-   Current health

Supported categories:

`MANUFACTURING` · `LOGISTICS` · `UTILITIES` · `FACILITIES`

### Condition Monitoring

The system records:

-   Health score
-   Vibration level
-   Temperature in Celsius
-   Recording timestamp

Decommissioned assets are excluded from the live condition-monitoring
view.

### Automatic Critical Alert

When:

``` text
healthScore < 40
```

AssetArc automatically:

``` text
Create CRITICAL REPAIR maintenance schedule
                +
Set asset status to UNDER_MAINTENANCE
```

### Maintenance Scheduling

Maintenance types:

-   `ROUTINE`
-   `REPAIR`
-   `INSPECTION`

Priorities:

-   `LOW`
-   `MEDIUM`
-   `HIGH`
-   `CRITICAL`

High and critical maintenance priorities place the related asset in
`UNDER_MAINTENANCE`.

### Maintenance Completion

A maintenance technician submits:

-   Work description
-   Cost incurred
-   Technician information

The completion workflow updates related records transactionally:

``` text
Maintenance Log       → Created
Maintenance Schedule → COMPLETED
Asset Status          → ACTIVE
Asset Health          → 100
```

### Fleet Dashboard

The dashboard provides:

-   Total asset count
-   Active maintenance count
-   Average health score
-   Total fleet value
-   Asset status distribution

### Maintenance Reports

Reports include:

-   Total maintenance spend
-   Total interventions
-   Maintenance date
-   Asset tag
-   Technician
-   Work description
-   Maintenance cost

## 👥 Roles and Access Control

  -----------------------------------------------------------------------
  Role                                Main Responsibilities
  ----------------------------------- -----------------------------------
  `ASSET_MANAGER`                     Asset management, decommissioning,
                                      maintenance scheduling and reports

  `MAINTENANCE_TECHNICIAN`            Health recording and maintenance
                                      task completion

  `OPERATIONS_SUPERVISOR`             Fleet/dashboard operational
                                      visibility

  `SYSTEM_ADMIN`                      Administrative asset and
                                      maintenance operations
  -----------------------------------------------------------------------

Authorization is enforced on protected backend endpoints using Spring
Security and method-level role checks.

## 🏗️ Architecture

``` text
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│                                             │
│ Login • Dashboard • Assets • Maintenance   │
│ Health Monitor • Reports                   │
└──────────────────────┬──────────────────────┘
                       │
                 Axios / REST API
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             Spring Boot Backend             │
│                                             │
│ Controllers → Services → Repositories      │
│                                             │
│ Spring Security + JWT                       │
│ Spring Data JPA                             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                  MySQL                      │
│                                             │
│ Users • Assets • Health Metrics             │
│ Maintenance Schedules • Maintenance Logs    │
└─────────────────────────────────────────────┘
```

## 🔄 Maintenance Workflow

``` text
Asset Registration
       ↓
Condition Monitoring
       ↓
Health Metric Recorded
       ↓
   Health < 40?
      /    \
    YES     NO
     ↓       ↓
Critical     Continue
Repair       Monitoring
     ↓
UNDER_MAINTENANCE
     ↓
Maintenance Task
     ↓
Technician Completes Task
     ↓
Maintenance Log Created
     ↓
Schedule = COMPLETED
Asset = ACTIVE
Health = 100
     ↓
Reports & Fleet Analytics
```

## 🧰 Technology Stack

### Frontend

-   React
-   Redux Toolkit
-   React Redux
-   Axios
-   React Router DOM
-   Custom CSS

### Backend

-   Java 17+
-   Spring Boot 3.x
-   Spring Data JPA
-   Spring Security
-   JJWT
-   Lombok
-   Maven

### Database

-   MySQL

### Security

-   Spring Security
-   JWT
-   HS256 signing
-   BCrypt password encoding
-   Role-Based Access Control
-   Stateless authentication

## 🗂️ Project Structure

### Backend

``` text
backend/
├── Controller Layer
│   ├── AuthController
│   ├── AssetController
│   ├── ConditionMonitoringController
│   ├── HealthController
│   ├── MaintenanceController
│   └── DashboardController
├── Service Layer
│   ├── AuthService
│   ├── AssetService
│   ├── ConditionMonitoringService
│   ├── MaintenanceService
│   └── DashboardService
├── Repository Layer
│   ├── SystemUserRepository
│   ├── IndustrialAssetRepository
│   ├── HealthMetricRepository
│   ├── MaintenanceScheduleRepository
│   └── MaintenanceLogRepository
├── Entity / Model Layer
├── DTO Layer
├── Security Layer
└── Exception Layer
```

### Frontend

``` text
frontend/
├── components/
├── pages/
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── assetService.js
│   └── maintenanceService.js
├── store/
│   ├── index.js
│   └── slices/
│       ├── authSlice.js
│       ├── assetSlice.js
│       └── maintenanceSlice.js
└── hooks/
```

## 🗃️ Core Data Model

### SystemUser

``` text
id
username
password
role
```

### IndustrialAsset

``` text
id
assetTag
name
category
installDate
purchasePrice
expectedLifespanYears
currentStatus
currentHealth
```

### HealthMetric

``` text
id
assetId
healthScore
vibrationLevel
temperatureCelsius
recordedAt
```

### MaintenanceSchedule

``` text
id
assetId
plannedDate
maintenanceType
priority
status
```

### MaintenanceLog

``` text
id
assetId
scheduleId
technicianId
completionDate
workDescription
costIncurred
```

## 🔐 Authentication Flow

``` text
User
 ↓
Login Form
 ↓
POST /api/auth/login
 ↓
Spring Security Authentication
 ↓
User Validation
 ↓
JWT Generated
 ↓
Frontend Stores Session Information
 ↓
Axios Adds:
Authorization: Bearer <token>
 ↓
Protected API
```

The frontend uses an Axios interceptor to attach the JWT to
authenticated API requests.

If a protected endpoint returns `401 Unauthorized`, the frontend clears
the stored user session and redirects to `/login`.

## 🌐 REST API

### Authentication

  Method   Endpoint               Access
  -------- ---------------------- --------
  POST     `/api/auth/register`   Public
  POST     `/api/auth/login`      Public

### Assets

  Method   Endpoint              Access
  -------- --------------------- -----------------------------
  GET      `/api/assets/stats`   Authenticated
  GET      `/api/assets`         Authenticated
  GET      `/api/assets/{id}`    Authenticated
  POST     `/api/assets`         Asset Manager, System Admin
  PUT      `/api/assets/{id}`    Asset Manager, System Admin
  DELETE   `/api/assets/{id}`    Asset Manager, System Admin

### Health Monitoring

  Method   Endpoint                    Access
  -------- --------------------------- ------------------------
  POST     `/api/monitoring/metrics`   Authenticated
  POST     `/api/health/record`        Maintenance Technician

### Maintenance

  Method   Endpoint                       Access
  -------- ------------------------------ -----------------------------
  GET      `/api/maintenance/schedules`   Authenticated
  GET      `/api/maintenance/logs`        Authenticated
  POST     `/api/maintenance/schedule`    Asset Manager, System Admin
  POST     `/api/maintenance/complete`    Maintenance Technician
  DELETE   `/api/maintenance/logs/{id}`   Asset Manager, System Admin

### Dashboard

  Method   Endpoint                 Access
  -------- ------------------------ ---------------------
  GET      `/api/dashboard/stats`   Authenticated Roles

## ⚙️ Getting Started

### Prerequisites

Install:

-   Java 17 or later
-   Maven
-   Node.js and npm
-   MySQL
-   Git

### Clone

``` bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd AssetArc
```

### Database

Create/configure the MySQL database according to your local
`application.properties`.

Do **not** commit production passwords, JWT secrets or other sensitive
credentials to GitHub.

### Run Backend

``` bash
cd backend
mvn spring-boot:run
```

### Run Frontend

Open another terminal:

``` bash
cd frontend
npm install
npm start
```

## 🧪 Testing

The project specification requires:

-   Frontend testing with Jest / React Testing Library
-   Backend testing with TestNG

Run the test commands configured in the project.

The supplied project requirements also state that existing test files
should not be modified and that the specified naming conventions must be
followed.

## 🖥️ UI Modules

-   **Operations Dashboard** --- fleet KPIs, status distribution and
    fleet health overview
-   **Industrial Assets** --- search, pagination, health, status,
    details and decommissioning
-   **Maintenance Schedule** --- pending tasks, priority and technician
    completion workflow
-   **Live Condition Monitoring** --- health, vibration and temperature
-   **Reports** --- maintenance spend, interventions and maintenance
    activity

## 🚨 Business Rules

  -----------------------------------------------------------------------
  Condition                           System Behavior
  ----------------------------------- -----------------------------------
  `healthScore < 40`                  Create `CRITICAL` `REPAIR` schedule
                                      and set asset to
                                      `UNDER_MAINTENANCE`

  Priority = `HIGH`                   Set asset to `UNDER_MAINTENANCE`

  Priority = `CRITICAL`               Set asset to `UNDER_MAINTENANCE`

  Technician completes pending task   Create log, complete schedule,
                                      activate asset and set health to
                                      `100`

  Task is completed/cancelled         Return business validation conflict

  Asset is decommissioned             Prevent normal active-asset
                                      operations
  -----------------------------------------------------------------------

## 📊 Example

``` text
Asset: CNC-202
       ↓
Health Score: 35
       ↓
35 < 40
       ↓
CRITICAL REPAIR
       ↓
UNDER_MAINTENANCE
       ↓
Technician performs maintenance
       ↓
Maintenance Log created
       ↓
Schedule = COMPLETED
Asset = ACTIVE
Health = 100
```

## 🔮 Future Enhancements

Potential next-stage improvements:

-   Real industrial IoT sensor integration
-   Real-time telemetry streaming
-   Historical health trend visualization
-   Predictive failure analysis
-   Machine-learning-based failure prediction
-   Maintenance forecasting
-   Advanced fleet analytics
-   Critical equipment notifications
-   Stronger audit controls
-   Production-grade secret management
-   Restricted CORS configuration
-   Cloud deployment

## ⚠️ Prototype Notes

The current specification includes demonstration-oriented behavior,
including computed telemetry values for the Health Monitor and a fixed
dashboard average health value in the specified service implementation.

For production, telemetry should be connected to real sensor data and
dashboard metrics should be dynamically calculated from authoritative
data.

The specification also describes maintenance logs as immutable while
defining a maintenance-log deletion endpoint. This should be clarified
before treating the system as a production audit ledger.

## 📚 Documentation

The project documentation covers:

-   Project overview
-   Technology stack
-   Project structure
-   Dependencies and configuration
-   Database configuration
-   Entity models
-   Repositories
-   Service layer
-   Controller layer
-   Security implementation
-   Exception handling
-   DTOs
-   API endpoints
-   Frontend components
-   Axios configuration
-   Redux configuration
-   Demo UI

## 🤝 Contribution

1.  Create a feature branch.
2.  Implement and test your changes.
3.  Keep existing test files unchanged unless the project requirements
    allow modifications.
4.  Follow the project's naming conventions.
5.  Create a pull request with a clear description.

## 📄 License

No license is specified in the current project documentation.

If you publish this project as open source, add an appropriate license.

------------------------------------------------------------------------

## ⭐ AssetArc

**Industrial Equipment Lifecycle Monitor**

**Monitor → Alert → Maintain → Report**

Built with React, Spring Boot and MySQL.
