# Architecture Document: Rapid Prototyping Lab Management System (RPLMS)

## 1. Overview
The Rapid Prototyping Lab Management System (RPLMS) is a web-based dashboard designed for the Lab In-Charge to manage inventory, track equipment, process material requests and returns, oversee teams, and manage support tickets. 

## 2. Technology Stack
*   **Frontend HTML:** Semantic HTML5 for layout and structure.
*   **Frontend CSS:** Custom Vanilla CSS. Uses modern CSS techniques (variables, flexbox, grid, transitions) and a glassmorphism/premium UI approach.
*   **Frontend JavaScript:** Vanilla JavaScript (ES6+). DOM manipulation, event listeners, array manipulation, and template literal rendering.
*   **Data Persistence Layer:** Client-side `localStorage`. Acts as a mock database for rapid prototyping without a backend server.
*   **External Libraries:** 
    *   Google Fonts (Plus Jakarta Sans)
    *   XLSX (SheetJS) for Excel/CSV bulk import/export functionalities (inferred from `inventory.js`).

## 3. Project Structure
```text
/
├── index.html                  # Main Dashboard view
├── inventory.html              # Inventory listing (Equipment, Components, Tools)
├── inventory-edit.html         # Edit specific inventory item
├── equipment-details.html      # Deep dive into equipment usage
├── equipment-tracking.html     # Track checked-out equipment
├── low-stock.html              # Alerts for low inventory items
├── material-requests.html      # Approve/reject component requests
├── material-returns.html       # Track component/equipment returns
├── tickets.html                # Issue and procurement ticketing system
├── teams.html                  # Manage active student/research teams
├── team-workspace.html         # Per-team focused views
├── login.html                  # Authentication entry point
├── myprofile.html / profile.html # User settings
├── css/
│   ├── style.css               # Global styles, variables, utility classes
│   ├── lowstock.css            # Scoped styles for low stock
│   └── myprofile.css           # Scoped styles for profile
└── js/
    ├── common.js               # Global state (DB init), Sidebar/Header injection
    ├── dashboard.js            # Dashboard KPI logic and recent activities
    ├── inventory.js            # Inventory table rendering, filtering, bulk upload
    ├── equipment.js            # Equipment tracking logic
    ├── tickets.js              # Ticket management logic
    ├── teams.js                # Team rendering logic
    ├── material-request.js     # Request approval workflow
    ├── material-return.js      # Return tracking workflow
    └── validation.js           # Form validations
```

## 4. State Management & Data Layer
The application uses a simulated relational database stored in the browser's `localStorage` under the key `rplms_db`. It is initialized by `common.js` if the DB version is out of date or missing.

### Core Collections:
*   **currentUser:** Details of the logged-in user (e.g., Dr. Priya Sharma, Lab Incharge).
*   **notifications:** List of recent alerts and actions.
*   **teams:** Registered lab teams, their leaders, and active project counts.
*   **equipment / components / tools:** Three distinct inventory arrays with metadata (make, specs, count, lab location, cupboard/shelf tracking).
*   **materialRequests / materialReturns:** Workflow items tracking items checked out by or returned from teams.
*   **tickets:** Damage reports, procurement requests, and general support tickets.

## 5. UI/UX Architecture
*   **Component Injection:** `common.js` injects the Sidebar and Header dynamically via `renderBaseLayout(activeMenu)` to prevent code duplication across HTML files.
*   **Responsive Design:** CSS Grid and Flexbox are used heavily, falling back from multi-column grids to single columns via media queries for tablet/mobile.
*   **Interactivity:** Action modals, toast notifications, search debouncing, and pagination are handled via Vanilla JS DOM manipulation without heavyweight frameworks like React or Vue.
