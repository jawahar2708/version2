# Product Requirements Document (PRD)

## 1. Product Overview
**Name:** Rapid Prototyping Lab Management System (RPLMS) - Lab In-Charge Portal
**Purpose:** A digital platform to streamline the daily operations of a university or enterprise rapid prototyping lab. It digitizes asset management, team material requests, and equipment issue tracking.

## 2. Target Audience
*   **Primary User:** Lab In-Charge / System Administrator (The persona managing the portal).
*   **Secondary Users:** Lab Assistants, Student Teams, Researchers (who interact with the portal indirectly or through their own interface).

## 3. Key Objectives
*   Provide a centralized dashboard for complete visibility over lab operations.
*   Eliminate paper-based ledgers for equipment check-in/check-out.
*   Automate low-stock alerts and overdue return notifications.
*   Streamline the process of reporting damaged equipment and procuring replacements.

## 4. Functional Requirements

### 4.1 Dashboard
*   **KPIs:** Display active teams, pending requests, overdue returns, and open tickets.
*   **Quick Access:** Icon-based grid linking to all major system modules.
*   **Actionable Tables:** Immediate visibility into Overdue Returns and Inventory items requiring attention (Maintenance/Repairing).

### 4.2 Asset Management (Inventory)
*   **Categorization:** Must separate assets into Equipment, Components, and Tools.
*   **Tracking Details:** Must track Location (Lab), Storage (Cupboard, Shelf), Total Count, and Status.
*   **Bulk Operations:** Allow bulk upload/download of inventory using CSV/Excel formats.
*   **CRUD:** Ability to Create, Read, Update, and Delete inventory items.

### 4.3 Material Requests & Returns Workflow
*   **Requests:** Teams can request materials for time slots. Lab In-Charge can Approve or Reject.
*   **Returns:** Track issued items and flag them as "Overdue" if past the return timeline.
*   **Equipment Tracking:** Detailed view to see exactly which team holds which asset.

### 4.4 Ticket Management
*   **Damage Reports:** Track broken items, assess fine amounts, assign to specific teams, and track payment/resolution.
*   **Procurement:** Track low-stock items that have been requested from the administration for restocking.

### 4.5 Team Management
*   Directory of all active project teams, members count, and team leaders.
*   Detailed view per team (Team Workspace) to see their specific requests, returns, and tickets.

## 5. Non-Functional Requirements
*   **Performance:** UI should be snappy; data tables should support pagination and fast client-side filtering.
*   **Design/UX:** High-quality, modern, and premium design (glassmorphism, subtle gradients, clean typography) to reduce cognitive load on the Lab In-Charge.
*   **Scalability:** The system should eventually support concurrent users and hundreds of thousands of inventory records via backend processing.

## 6. Future Enhancements (Post-MVP)
*   Mobile application for scanning QR codes on equipment for instant check-in/check-out.
*   Automated email/SMS notifications to teams for overdue items.
*   Integration with university/enterprise ERP systems for automated procurement PO generation.
