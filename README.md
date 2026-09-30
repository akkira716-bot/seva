# SEVA: Mother & Child Care Platform

> **Sustained Maternal & Early-Childhood Vitality and Care**  
> An evidence-based, privacy-first web application designed for parents, caregivers, and clinical teams based on the WHO Digital Health Data Governance Blueprint.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)

---

## 🏛 Architecture Blueprint & Development Stages

The platform is designed and implemented across four distinct modular stages as outlined in [BLUEPRINT.md](./BLUEPRINT.md):

```
       ┌─────────────────────────────────────────────────────────────┐
       │                   SEVA Application Core                     │
       └──────┬──────────────────────┬────────────────────────┬──────┘
              │                      │                        │
       ┌──────▼────────┐     ┌───────▼────────┐       ┌───────▼──────┐
       │ Stage 1       │     │ Stage 2        │       │ Stage 3      │
       │ Public Info & │     │ Personal       │       │ Optional     │
       │ Care Directory│     │ Organizer      │       │ Care Tracker │
       └───────────────┘     └────────────────┘       └──────────────┘
                                     │
                             ┌───────▼────────┐
                             │ Stage 4        │
                             │ Admin Review & │
                             │ FHIR Clinic    │
                             └────────────────┘
```

### 1. Stage 1: Public Information Site & Care Directory (Completed & Pushed)
- **Responsive Web Portal**: Mobile-first design for families and caregivers.
- **Reviewed Content Library**: Articles categorized by stage (Pregnancy, Postpartum, Baby Care) with clinical reviewer attribution badges, review dates, and urgent warning callouts.
- **Verified Care Directory**: Filterable directory for midwives, OB-GYNs, lactation consultants, and pediatric clinics with insurance and telehealth indicators.
- **Emergency Red Flag Matrix**: Triage guidance with 24/7 hotline links (911, 988, 1-833-9-HELP4MOMS) accessible without an account.
- **WHO Privacy Benchmark**: Zero tracking and no sign-up required for public health browsing.

### 2. Stage 2: Personal Organizer & Accounts (Completed & Pushed)
- User accounts with language & notification preferences.
- Saved visits and appointments with linked care providers.
- "Questions to Ask" visit checklist pre-populated by pregnancy trimester and pediatric age.
- Right to be Forgotten: One-click complete account deletion and JSON data export.

### 3. Stage 3: Optional Tracking (Care Logs) (Completed & Pushed)
- Baby feeding (breast/bottle/solids), sleep duration, and diaper logs.
- Visual daily summaries and activity timelines.
- Strict data isolation: care logs segregated from public search indexes.
- Configurable data retention policies and single-click history purge.

### 4. Stage 4: Admin & Clinical Review Portal + Clinic Integrations (Completed & Pushed)
- Role-Based Access Control (Admin, Clinical Reviewer, Content Editor).
- Editorial workflow: Draft ➔ Clinical Review ➔ Editorial Review ➔ Publish ➔ Retire.
- Provider credential verification and directory management.
- Privacy-preserving operational and security audit logging.
- HL7 FHIR standard interoperability mock endpoints (`/api/fhir/Patient`, `/api/fhir/Appointment`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/akkira716-bot/seva.git
cd seva

# Install dependencies
npm install

# Build production bundle
npm run build

# Start production server
npm start

# Or run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
