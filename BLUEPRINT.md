# Mother and Child Care Platform (SEVA)
## System Architecture Blueprint & Implementation Roadmap

> **Platform Name:** SEVA (Sustained Maternal & Early-Childhood Vitality and Care)  
> **Reference Guidance:** WHO Digital Health Data Governance Guidelines ([WHO 9789240064355](https://www.who.int/publications/i/item/9789240064355))

---

## 1. System Architecture Overview

```mermaid
flowchart TB
    U[Parents and Caregivers] --> WEB[Responsive Website & PWA]
    P[Care Providers & Clinical Reviewers] --> ADMIN[Admin & Reviewer Portal]

    WEB --> EDGE[Edge CDN & Web Application Firewall]
    ADMIN --> EDGE
    EDGE --> API[Application API Gateway]

    API --> AUTH[Authentication & Access Control (RBAC)]
    API --> APP[Application Modules]
    
    subgraph Modular Application Core
        APP --> MOD_ACC[Accounts & Privacy Module]
        APP --> MOD_CONTENT[Reviewed Content Module]
        APP --> MOD_DIR[Care Provider Directory]
        APP --> MOD_APPT[Personal Appointments]
        APP --> MOD_CARE[Isolated Care Logs]
        APP --> MOD_NOTIF[Notification Service]
        APP --> MOD_ADMIN[Workflow & Audit Service]
    end

    APP --> DB[(Relational Database / Persistent Store)]
    APP --> SEARCH[Public Content & Directory Search Index]
    APP --> MSG[Privacy-Preserving Notification Gateway]
    APP --> FHIR[HL7 FHIR Interoperability Stubs]
    API --> LOGS[Operational & Security Audit Logs (PII Sanitized)]
```

---

## 2. Phased Staging Breakdown

| Stage / Part | Scope & Deliverables | Privacy & Security Boundary |
|---|---|---|
| **Part 1: Stage 1** | **Public Information Site**<br>• Responsive web frontend (mobile/desktop)<br>• Clinically reviewed content library (Pregnancy, Postpartum, Baby Care)<br>• Verified care provider directory & search<br>• Urgent-help & red-flag emergency protocols | • Read-only public access<br>• Zero user tracking or mandatory sign-up<br>• Clinical reviewer badges & attribution |
| **Part 2: Stage 2** | **Personal Organizer & Accounts**<br>• User accounts with notification & language preferences<br>• Private appointment scheduler & visit notes<br>• "Questions to Ask" checklist organizer<br>• Data export (JSON) and complete account deletion | • Strict user ownership validation<br>• Account-level private note isolation<br>• Full GDPR / WHO data portability & right-to-be-forgotten |
| **Part 3: Stage 3** | **Optional Tracking (Care Logs)**<br>• Baby feeding (breast/bottle/solids), sleep, diaper, medication, growth logs<br>• Interactive daily & weekly activity timelines<br>• User-configurable retention policies | • Care logs segregated from public search indexes<br>• Complete purge & clear history controls<br>• Optional participation without impacting public browsing |
| **Part 4: Stage 4** | **Admin Reviewer Portal & Clinic Integrations**<br>• Multi-role portal (Admin, Clinical Reviewer, Editor)<br>• Content lifecycle workflow (Draft ➔ Clinical Review ➔ Editorial ➔ Published ➔ Retired)<br>• Provider credential verification workflow<br>• Operational & security audit logging (no sensitive health notes logged)<br>• HL7 FHIR R4 Patient/Appointment integration endpoints | • Role-based access control (RBAC)<br>• Clinical audit trails for all guidance updates<br>• Standard healthcare interoperability ready |

---

## 3. Data Privacy & WHO Compliance Principles

1. **Minimization:** Only gather health data explicitly required for features the user opts into.
2. **Segregation:** Public articles and provider search indices are strictly separated from private personal health logs and appointment notes.
3. **No Sensitive Health Data in Telemetry:** Ordinary server logs never record appointment notes, care logs, search history tied to users, or tokens.
4. **Portability & Erasure:** Users can download their complete record at any time or trigger total deletion with immediate database purge.
