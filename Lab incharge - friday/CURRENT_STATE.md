# Current State Document: RPLMS

## 1. Project Phase
The project is currently in the **Functional Prototype Phase**. It operates completely on the client side without a dedicated backend server or persistent remote database.

## 2. Implemented Features
*   **Global Layout:** Sidebar navigation and top header (including a notification center dummy) are abstracted into `common.js` and successfully inject into all major pages.
*   **Dashboard (`index.html`):** Renders personalized greetings, KPI summary blocks, overdue returns table, and an inventory attention table. Modules link out accurately.
*   **Inventory Management (`inventory.html`):** 
    *   Three tabbed views: Equipment, Components, Tools.
    *   Filtering, pagination, and sorting logic are implemented in `inventory.js`.
    *   Bulk upload via CSV functionality implemented (using SheetJS).
*   **Data Seeding:** A robust `DEFAULT_DATABASE` resides in `common.js` which automatically populates `localStorage` with:
    *   21 Teams
    *   20+ Inventory items
    *   40+ Material Requests
    *   40+ Material Returns
    *   Dynamic ticket generation up to 32 entries.

## 3. Current Limitations & Technical Debt
*   **No Real Backend:** All data is saved in `localStorage`. Clearing browser data wipes out user actions. Multi-user collaboration (e.g., between Lab In-Charge and a Student) is impossible on different machines.
*   **Authentication Bypass:** The `checkAuth()` function is currently commented out in `common.js` (Lines 449-459) to allow auto-login for testing purposes.
*   **Static Data Mutation:** While the UI has functions to delete or edit (e.g., `deleteEquipment` in `inventory.js`), deep CRUD functionality across all modules is incomplete. Relationships between items (e.g., a ticket tied to specific equipment) are loosely coupled by strings rather than enforced foreign keys.
*   **Pagination:** Is implemented solely on the client side, meaning all data is loaded into memory first before paginating.

## 4. Next Steps for Development
1.  **Backend Integration:** Replace `getDB()` and `setDB()` in `common.js` with REST/GraphQL API calls to a Node.js/Python backend.
2.  **Database Migration:** Move `localStorage` schema to a relational database (PostgreSQL) or NoSQL (MongoDB).
3.  **Authentication Implementation:** Implement JWT-based authentication and Role-Based Access Control (RBAC) (Lab Incharge vs. Team Member).
4.  **Real-time Capabilities:** Add WebSockets for live notifications when a team requests a component or raises a ticket.
