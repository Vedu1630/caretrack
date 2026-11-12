# CareTrack – Hospital Patient Monitoring System
> **Smarter Patient Monitoring. Better Care.**

A modern, responsive healthcare management web application built as a **Technical Product Manager assessment for FactWise**. The system empowers viral quarantine and treatment facilities to manage patient body temperatures, doctor clinical rounds, discharge eligibility criteria, room occupancy, and epidemiological mortality statistics.

---

## 🌟 Key Product Features & Workflows

### 1. Role-Based Access Control (RBAC)
- **Facility Administrator** (`admin@caretrack.com` / `password123`):
  - Patient intake registration & room assignment (enforces 74-bed capacity).
  - Final administrative discharge authorization (frees isolation rooms).
  - Facility user management & security access governance.
- **Staff Nurse** (`nurse@caretrack.com` / `password123`):
  - Daily routine vitals logging (strict 1 entry per patient per day).
  - Duplicate prevention guardrails & error states.
  - Temperature correction workflow with mandatory clinical justifications & historical audit log.
- **Attending Physician / Doctor** (`doctor@caretrack.com` / `password123`):
  - Daily clinical rounds assessment & diagnostic directives.
  - Temperature validation requirement (warning triggered if temperature missing).
  - Emergency clinical override with mandatory audit reasoning.
  - Formal discharge recommendations once consecutive fever-free criteria are met.

---

### 2. Core Quarantine Discharge Protocol (3-Day Rule)
A patient is considered eligible for discharge strictly after **three consecutive complete days without fever** (`< 38.0°C`):
- **Day 1**: Fever detected (`≥ 38.0°C`) → Not eligible (Streak: 0).
- **Day 2**: Fever-free (`< 38.0°C`) → Streak: 1 day.
- **Day 3**: Fever-free (`< 38.0°C`) → Streak: 2 days.
- **Day 4**: Fever-free (`< 38.0°C`) → Streak: 3 days → **Eligible for Discharge!**
- **Critical rule**: If fever occurs on any day, the streak immediately resets to 0. Missing daily temperature readings do not count as fever-free days.

---

### 3. Epidemiological Analytics & Mortality Warning
- **Mortality Rate**: `(Total Deaths ÷ Total Admissions) × 100`
- **Success Rate**: `(Total Recovered ÷ Total Admissions) × 100`
- **Safety Threshold Alert**: Prominent red banner triggers automatically across the application whenever facility mortality exceeds **15.0%**.
- Includes a live **Spike Simulation Toggle** in the Analytics view to test threshold breaches and alerts on demand.

---

## 🛠️ Technology Stack
- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS (Strict Light Theme inspired by Linear & Stripe)
- **Icons**: Lucide React
- **Visualizations**: Recharts (Area charts, Bar charts, Donut charts)
- **Routing**: React Router DOM v6
- **Persistence**: Browser LocalStorage with automatic fallback and 1-click demo data reset

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/caretrack.git
cd CareTrack

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
The application will start locally at **`http://localhost:3000/`**.

### Building for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deploying to Vercel

CareTrack is ready to deploy directly to Vercel with zero additional configuration:

### Method A: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Run deploy from the project root
vercel
```

### Method B: Deploy via Vercel Web Dashboard (Git Integration)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your CareTrack repository.
4. Ensure the build settings are:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Vercel will build and assign a global HTTPS production URL.

---

## 📂 Project Structure

```
CareTrack/
├── index.html                   # HTML entry point with Inter Google Font
├── package.json                 # Project dependencies and build scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Custom healthcare design tokens & light theme
├── vite.config.js               # Vite config with modular vendor chunk splitting
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # App routes, RBAC providers & navigation guards
│   ├── index.css                # Global Tailwind CSS directives & scrollbar styles
│   ├── context/
│   │   ├── AuthContext.jsx      # Demo credentials & permission checks (can.*)
│   │   ├── PatientContext.jsx   # Patient state, 3-day fever calculations & business logic
│   │   └── ToastContext.jsx     # Modern non-blocking notifications
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx        # Status pills, fever indicators & counters
│   │   │   ├── Modal.jsx        # Accessible dialog wrapper
│   │   │   ├── ConfirmDialog.jsx# Critical action confirmation modal
│   │   │   ├── StatCard.jsx     # Enterprise KPI cards with trends & alerts
│   │   │   └── EmptyState.jsx   # Filter and search empty states
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # Fixed navigation bar with role switcher
│   │   │   ├── Topbar.jsx       # Header with alerts, breadcrumbs & search
│   │   │   └── Layout.jsx       # Responsive layout skeleton
│   │   ├── patients/
│   │   │   ├── PatientFormModal.jsx   # Registration form (capacity & room validator)
│   │   │   └── PatientDetailModal.jsx # Comprehensive patient dossier & history
│   │   ├── temperatures/
│   │   │   ├── RecordTempModal.jsx    # Vitals logger with duplicate detection
│   │   │   └── TempCorrectionModal.jsx# Audit-compliant correction workflow
│   │   └── doctors/
│   │       └── DoctorVisitModal.jsx   # Clinical assessment with emergency override
│   ├── pages/
│   │   ├── Login.jsx            # 1-Click role demo login screen
│   │   ├── Dashboard.jsx        # Executive facility overview & 6 primary KPIs
│   │   ├── Patients.jsx         # Census management with wing/status filters
│   │   ├── TemperatureMonitoring.jsx # Daily temperature table & cutoff settings
│   │   ├── DoctorVisits.jsx     # Clinical rounds & missing vitals enforcement
│   │   ├── DischargeManagement.jsx   # 3-day fever-free tracker & room release
│   │   ├── Analytics.jsx        # Epidemiological curves & mortality warning
│   │   └── UserManagement.jsx   # Hospital staff directory & RBAC matrix
│   └── utils/
│       ├── initialData.js       # 20+ realistic patients, logs & baseline stats
│       └── storage.js           # LocalStorage synchronizer with fallback
```

---

## 🧪 Demonstration Test Script for Product Evaluation

To quickly test the complete FactWise Technical Product Manager user journey:

1. **Admin Login**:
   - On `/login`, click **"Sarah Jenkins, MHA (Admin)"**.
   - Check Dashboard KPIs: Total Patients (74), Occupied Beds, Discharge Eligible, Total Recovered.
   - Click **"Register Patient"** → Register `PT-1021`, assign available Room `A-109`.
2. **Nurse Temperature Flow**:
   - In the left sidebar or top profile menu, click **"Nurse"** to switch persona.
   - Go to **Temperature Monitoring** (`/temperatures`).
   - Click **"Record Temperature"** for `PT-1003` → enter `36.6°C` → observe afebrile badge and streak update.
   - Attempt to record again for the same patient on the same day → Observe the **duplicate prevention warning** with link to the correction workflow.
3. **Doctor Clinical Rounds Flow**:
   - Switch persona to **"Doctor"**.
   - Go to **Doctor Visits** (`/doctor-visits`).
   - Notice patients awaiting temperature are highlighted.
   - Conduct rounds for an eligible patient (`PT-1017`) who has 3 consecutive fever-free days. Check **"Recommend Discharge"**.
4. **Administrative Discharge & Room Availability**:
   - Switch persona back to **"Admin"**.
   - Go to **Discharge Management** (`/discharge`).
   - Click **"Confirm Discharge"** on the recommended patient → Confirm modal dialog.
   - Note the room is immediately released, available bed count increases, and patient is archived under **Discharge History**.
5. **Mortality & Epidemiological Analytics**:
   - Go to **Analytics** (`/analytics`).
   - Verify formulas: Mortality Rate = `(Deaths / Admissions) * 100`, Success Rate = `(Recovered / Admissions) * 100`.
   - Click **"Simulate Spike (+6 Deaths)"** → Observe the system-wide **Critical Red Warning Banner** when mortality exceeds 15.0%.
