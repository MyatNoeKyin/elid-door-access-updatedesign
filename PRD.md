# Product Requirements Document (PRD)

## Document Information

- **Document Title:** ELID Access Control Dashboard System PRD
- **Version:** 2.0
- **Last Updated:** August 04, 2025
- **Author:** Business Analyst
- **Status:** In Development

## Revision History

| Version | Date | Author | Changes |
| ------- | ---- | ------ | ------- |
| 1.0 | July 10, 2025 | Business Analyst | Initial draft |
| 2.0 | August 04, 2025 | Business Analyst | Updated tech stack, added timeline & milestones |

---

## 1. Executive Summary

### Project Overview

**Project Name:** ELID Access Control Dashboard System (ELID DAS)  
**Project Type:** Web-based Access Control Management Platform  
**Industry/Domain:** Physical Security and Access Control  
**Target Users:** B2B - Facility Managers, Security Administrators, System Operators

### Project Description

The ELID Access Control Dashboard System is a comprehensive web-based platform designed to manage physical access control across multi-tenant buildings and facilities. Built on Strapi CMS and Next.js, it provides centralized management of users, access credentials, doors, controllers, and security policies with real-time monitoring and reporting capabilities.

### Key Objectives

- Enable centralized management of physical access control across multiple facilities
- Provide real-time monitoring and instant response to security events
- Reduce manual access management time by 70%
- Ensure 100% audit trail accuracy for compliance requirements
- Support seamless migration from legacy access control systems

---

## 2. Scope & Constraints

### In Scope

1. **Dashboard Overview and Statistics** - Real-time system monitoring with key metrics and alerts
2. **User Management System** - Complete user lifecycle management including profile creation, credential assignment, and access control
3. **System Configuration Management** - Comprehensive setup and configuration of controllers, doors, areas, floors, and devices
4. **Access Rights Management** - Time-based access control, holiday schedules, and permission assignments
5. **Card and Credential Management** - Support for access cards, PINs, fingerprints, and temporary credentials
6. **Audit and Logging System** - Complete access history tracking and compliance reporting
7. **Multi-tenant Support** - Organization and department-based access segregation
8. **Real-time Monitoring** - Live status updates of doors, controllers, and access events
9. **Legacy System Integration** - Data migration and synchronization with existing systems

### Out of Scope

- Mobile application development
- Facial recognition features
- Video surveillance integration
- Visitor management system
- IoT sensor integration beyond door controllers

### Constraints

- **Technical:** Must use Node.js (Strapi) backend and Next.js frontend
- **Business:** Annual maintenance budget of SGD 3,240 per year (20% of development cost)
- **Platform:** Web-based application requiring modern browser support
- **Performance:** System must support up to 10,000 concurrent users and 100,000 access events daily
- **Network:** Requires stable network connectivity for real-time monitoring
- **Integration:** Must integrate with existing SKTES controller infrastructure
- **Security:** Must meet industry security standards for physical access control
- **Migration:** Must ensure data integrity during migration from legacy systems

### Dependencies

- **External APIs:** SKTES Controller System API
- **Third-party Services:** 
  - SSL/TLS Certificate providers
  - Fingerprint hardware SDK
  - Biometric reader integration libraries
- **Internal Systems:**
  - Legacy Access Control System (for data migration)
  - PostgreSQL Database System
  - Strapi CMS platform
  - Next.js Framework

---

## 3. User Personas & Journey

### Primary Personas

1. **Security Administrator**
   - Role: Manages day-to-day security operations and access control
   - Goals: Monitor access events in real-time, respond quickly to incidents, manage user credentials efficiently
   - Pain Points: Multiple disconnected systems, manual tracking, delayed incident response
   - Technical Level: Intermediate

2. **Facility Manager**
   - Role: Oversees overall facility security strategy and compliance
   - Goals: View high-level dashboards, generate compliance reports, manage security policies
   - Pain Points: Lack of centralized visibility, difficult compliance reporting, inefficient resource utilization
   - Technical Level: Beginner to Intermediate

3. **System Operator**
   - Role: Technical staff responsible for system configuration and maintenance
   - Goals: Configure hardware, manage integrations, monitor system performance
   - Pain Points: Complex hardware integration, limited diagnostic tools, manual configuration
   - Technical Level: Advanced

### User Journey Map

```
Security Administrator Journey:
1. Login → 2. Dashboard View → 3. Monitor Events → 4. Manage Access → 5. Generate Reports
   ↓           ↓                  ↓                 ↓                  ↓
   Auth        Real-time data     Alert handling   Permission grant   Audit trail

Facility Manager Journey:
1. Login → 2. Overview Dashboard → 3. Check Compliance → 4. Review Reports
   ↓           ↓                      ↓                    ↓
   Auth        KPI metrics           Policy status        Export data

System Operator Journey:
1. Login → 2. System Config → 3. Hardware Setup → 4. Integration Test → 5. Monitor Health
   ↓           ↓                ↓                   ↓                    ↓
   Auth        Settings         Controller config   Connectivity        Performance
```

---

## 4. Functional Requirements

### Core Features

1. **User Management**
   - Description: Complete lifecycle management of users and their access credentials
   - User Stories:
     - As a Security Administrator, I want to create new user profiles so that I can grant building access
     - As a Security Administrator, I want to assign access cards so that users can enter authorized areas
     - As a Facility Manager, I want to bulk import users so that I can onboard multiple employees efficiently
   - Acceptance Criteria:
     - [ ] User profile creation with photo upload
     - [ ] Access card assignment and activation
     - [ ] Fingerprint enrollment capability
     - [ ] Department and organization assignment
     - [ ] Bulk import/export functionality
     - [ ] User deactivation and reactivation

2. **Access Control Management**
   - Description: Configure and manage door access permissions and schedules
   - User Stories:
     - As a Security Administrator, I want to set time-based access so that users can only enter during authorized hours
     - As a System Operator, I want to configure door controllers so that they enforce access policies
   - Acceptance Criteria:
     - [ ] Door and controller configuration
     - [ ] Time zone and schedule management
     - [ ] Holiday schedule configuration
     - [ ] Emergency lockdown procedures
     - [ ] Area and floor mapping
     - [ ] Access level hierarchies

3. **Real-time Monitoring**
   - Description: Live monitoring of access events and system status
   - User Stories:
     - As a Security Administrator, I want to see real-time access events so that I can respond to security incidents
     - As a Facility Manager, I want to receive alerts so that I'm notified of security violations
   - Acceptance Criteria:
     - [ ] Live door status display
     - [ ] Real-time event feed
     - [ ] Security alert notifications
     - [ ] Access violation detection
     - [ ] Controller online/offline status
     - [ ] Emergency response activation

4. **Reporting & Analytics**
   - Description: Comprehensive reporting for compliance and analysis
   - User Stories:
     - As a Facility Manager, I want to generate compliance reports so that I can meet regulatory requirements
     - As a Security Administrator, I want to view access patterns so that I can identify anomalies
   - Acceptance Criteria:
     - [ ] Customizable report templates
     - [ ] Access history reports
     - [ ] Audit trail generation
     - [ ] User activity reports
     - [ ] System performance metrics
     - [ ] Export to PDF/Excel formats

### Business Process Flows

1. **User Management**
   - User registration and profile creation
   - Credential assignment (card, PIN, fingerprint)
   - Department/organization assignment
   - Access permission configuration
   - Profile modification and updates
   - User deactivation/deletion

2. **Access Control Process**
   - Access request initiation
   - Credential validation
   - Permission verification
   - Time/schedule check
   - Access grant/deny decision
   - Event logging

3. **Data Management**
   - User data CRUD operations
   - Access log retention
   - Configuration backup/restore
   - Data export for compliance
   - Legacy data migration
   - Real-time synchronization

4. **Reporting & Analytics**
   - Daily access reports
   - Security incident reports
   - Compliance audit reports
   - User activity analytics
   - System performance dashboards

---

## 5. Sample User Interactions

### Scenario 1: Creating a New User with Access Card

```
Admin: Clicks "Add New User" button
System: Displays user creation form
Admin: Enters user details (name, email, department) and uploads photo
System: Validates data and saves user profile
Admin: Assigns access card number and selects access levels
System: Activates card and displays confirmation "User created successfully with card #12345"
Admin: Sets time-based access schedule (Mon-Fri, 8AM-6PM)
System: Saves schedule and shows "Access permissions configured"
```

### Scenario 2: Emergency Lockdown Activation

```
Security: Detects security threat and clicks "Emergency Lockdown"
System: Displays confirmation dialog "Activate emergency lockdown for all doors?"
Security: Confirms lockdown activation
System: Immediately locks all doors and sends alerts to all administrators
Security: Reviews locked door status on dashboard
System: Shows all doors in "LOCKED - EMERGENCY" status with timestamp
```

### Scenario 3: Generating Compliance Report

```
Manager: Navigates to Reports section
System: Displays available report types
Manager: Selects "Monthly Compliance Audit" and date range
System: Generates report with access logs, user changes, and security events
Manager: Clicks "Export to PDF"
System: Downloads formatted PDF report with digital signature
```

---

## 6. Data Requirements

### Data Model Overview

```
[Users] ──1:N──> [Credentials] ──N:M──> [Access_Levels]
    │                  │                      │
    └──1:N──> [Departments]                  │
                       │                      │
              [Doors] ──N:M──> [Controllers] ─┘
                       │
                   [Access_Logs]
```

### Entity Definitions

#### Users

| Field Name | Data Type | Mandatory | Description/Rules |
| ---------- | --------- | --------- | ----------------- |
| id | UUID | Yes | Primary key |
| email | VARCHAR(255) | Yes | Unique, valid email format |
| first_name | VARCHAR(100) | Yes | User's first name |
| last_name | VARCHAR(100) | Yes | User's last name |
| department_id | UUID | Yes | Foreign key to departments |
| photo_url | VARCHAR(500) | No | Profile photo URL |
| status | ENUM | Yes | Active/Inactive/Suspended |
| created_at | Timestamp | Yes | Auto-generated |
| updated_at | Timestamp | Yes | Auto-updated |

#### Credentials

| Field Name | Data Type | Mandatory | Description/Rules |
| ---------- | --------- | --------- | ----------------- |
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to users |
| credential_type | ENUM | Yes | Card/PIN/Fingerprint/Temp |
| credential_value | VARCHAR(255) | Yes | Encrypted storage |
| valid_from | Timestamp | Yes | Activation date |
| valid_until | Timestamp | No | Expiration date |
| status | ENUM | Yes | Active/Inactive/Lost |

#### Access_Logs

| Field Name | Data Type | Mandatory | Description/Rules |
| ---------- | --------- | --------- | ----------------- |
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to users |
| door_id | UUID | Yes | Foreign key to doors |
| access_time | Timestamp | Yes | Event timestamp |
| access_result | ENUM | Yes | Granted/Denied |
| denial_reason | VARCHAR(255) | No | If denied, why |
| controller_id | UUID | Yes | Foreign key to controllers |

### Data Validation Rules

- Email addresses must be unique and valid format
- Card numbers must be unique across the system
- PIN must be 4-8 digits
- Fingerprint data must be encrypted at rest
- Access logs must be immutable once created
- User deletion must soft-delete with data retention for audit
- Time schedules must not overlap for the same user
- Department hierarchy must maintain referential integrity

---

## 7. Technical Specifications

### Technology Stack

- **Frontend:** Next.js (React-based framework)
- **Backend:** Node.js with Strapi CMS
- **Database:** PostgreSQL
- **Real-time:** WebSocket connections
- **State Management:** Zustand
- **UI Components:** Modern UI framework (Tailwind CSS)
- **Authentication:** JWT-based
- **Hosting:** Cloud provider (AWS/Azure/GCP)
- **CDN:** CloudFlare

### Integration Requirements

- **Payment Gateway:** N/A
- **Email Service:** SMTP service for notifications
- **SMS Service:** Optional for critical alerts
- **Analytics:** Google Analytics for usage tracking
- **Hardware Integration:** SKTES Controller API
- **Biometric Devices:** Fingerprint reader SDK
- **Legacy System:** REST API for data migration

### Security Requirements

- Authentication method: JWT with refresh tokens
- Authorization levels: Super Admin, Admin, Operator, Viewer
- Data encryption: AES-256 at rest, TLS 1.3 in transit
- Password policy: Minimum 8 characters, complexity requirements
- Session management: 30-minute idle timeout
- Compliance: ISO 27001, SOC 2 Type II

### Performance Requirements

- Page load time: < 2 seconds
- API response time: < 500 ms
- Real-time event latency: < 500 ms
- Concurrent users: 10,000
- Daily access events: 100,000+
- Database queries: < 100 ms
- Uptime SLA: 99.5%

---

## 8. Success Metrics

### Key Performance Indicators (KPIs)

- **System Performance:** Response time < 2 seconds for all operations
- **User Adoption:** 90% of intended users actively using within 30 days
- **Operational Efficiency:** 70% reduction in manual access management time
- **Security Compliance:** 100% audit trail accuracy
- **System Availability:** 99.5% uptime during business hours
- **ROI Achievement:** Cost recovery within 12 months

### Analytics Tracking

- User login frequency and duration
- Most used features and workflows
- Access grant/deny ratios
- Peak usage times and load patterns
- Error rates and system failures
- Report generation frequency
- Emergency procedure activations
- Data export volumes

---

## 9. Project Timeline & Resources

### Timeline

- **Start Date:** July 1, 2025
- **Duration:** 6 months
- **Major Milestones:**
  - Milestone 1: July 31, 2025 - Foundation & Core Backend Complete
  - Milestone 2: August 31, 2025 - Frontend Development Complete
  - Milestone 3: September 30, 2025 - User Management & Integration Ready
  - Milestone 4: October 31, 2025 - Access Control Features Integrated
  - Milestone 5: November 30, 2025 - Testing & Optimization Complete
  - Milestone 6: December 31, 2025 - Legacy Migration & Full Deployment

### Resources

- **Development Team:** 4-5 developers (2 backend, 2 frontend, 1 full-stack)
- **Budget Range:** Development cost + SGD 3,240/year maintenance
- **Additional Resources:**
  - 1 UI/UX Designer
  - 1 QA Engineer
  - 1 Project Manager
  - 1 DevOps Engineer (part-time)
  - SKTES technical support (as needed)

---

## 10. Open Questions & Assumptions

### Open Questions

1. What is the specific data format and API structure of the legacy system for migration?
2. Are there any specific biometric device models that must be supported?
3. What are the exact compliance requirements for audit log retention period?
4. Should the system support multiple languages/localization?
5. Are there any specific network security requirements for controller communication?
6. What is the expected growth rate for users and doors over the next 3 years?

### Assumptions

1. SKTES controllers have a documented API that supports all required operations
2. Legacy system data is accessible and in a structured format
3. Network infrastructure can support WebSocket connections for real-time features
4. Users have modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
5. Fingerprint hardware is compatible with standard biometric libraries
6. PostgreSQL database can be scaled horizontally if needed
7. Cloud hosting environment provides auto-scaling capabilities
8. Email notifications are sufficient for non-critical alerts

---

