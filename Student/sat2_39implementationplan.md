# Feedback Implementation Plan

## User Review Required
Please review this implementation plan. It addresses all the points from the UX review, ordered by difficulty from easiest (top) to hardest (bottom), allowing us to knock out the quick wins immediately.

## Open Questions
- **Bulk Action Bar:** For the Component/Tool checkboxes, there is actually bulk-action logic in the code, but it is completely hidden until a box is checked. Should we make the bulk-action bar visible but disabled by default, or just completely remove the checkboxes?
- **Card Styling Rule:** The feedback suggests picking either a border *or* a shadow for cards, not both. Do you prefer we strip shadows (flatter look) or strip borders (floating look)?
- **Shared Chrome Consolidation:** The app is currently built as separate HTML files (Multi-Page Application). Consolidating the shared chrome (sidebar/header) into one layout is a major architectural change. Would you like to proceed with a simple JS-based include system, or migrate to a framework, or just fix the drift manually for now?

## Proposed Implementation Plan

### Tier 1: Quick Wins (Easy)
These are minor text, CSS, and HTML tweaks that can be done immediately.
1. **Fix Placeholder Text:** Replace "Hello, Student Name!" in `dashboard.html` with real data ("Trainee1") and replace "Faculty Name" in `completedprojects.html` with "Dr. R. Kumar".
2. **Fix Terminology Drift:** Rename "Days Left" to "Days Remaining" on the Project Overview header in `ongoingprojects.html`.
3. **Fix Breadcrumb Mismatch:** Update the header top bar in `myprofile.html` to correctly say "My Profile" instead of the copied "Knowledge Base" text.
4. **Remove Redundant Stage Number:** Delete the "Stage Number: 3" field in the Stage Information panel, as it duplicates the "Stage 3 of 10" badge right above it.
5. **Label Eye Icons:** Add clear tooltips/labels or distinct icons for the two identical eye icons in `knowledgebase.html` (e.g., Views vs. Approvals).
6. **Color Condition Pills:** Add colored backgrounds to the "Good", "Fair", and "Excellent" pills in the Returns Log to match the established design system, rather than flat gray.
7. **Fix "View Details" Button:** In the Returns Log table, change the bare text link to the standard outlined button treatment used elsewhere.
8. **Fix Redundant Progress Display:** In the Overall Progress card, remove either the ring or the progress bar, as displaying 40% twice in the same small card is redundant.

### Tier 2: Logic & State (Medium)
These involve JavaScript state management and CSS consistency.
9. **Fix Current Stage Contradiction:** The most critical data bug. Ensure the Project Overview header ("Prototype Development"), the stepper (Stage 3: "Design & Analysis"), and the footer text all agree on the same current stage.
10. **Fix Sidebar Active State:** Update the routing/navigation logic so the sidebar retains the "My Projects" or "Dashboard" active highlight even when deep inside a project's sub-tabs. Convert the "Back to Project" link into a proper breadcrumb.
11. **Enforce Border OR Shadow Rule:** Do a global CSS pass to strip either the borders or the box-shadows from all `.card` elements, enforcing a single consistent rule.
12. **Address Checkbox/Bulk-Action UI:** Either make the bulk-action bar explicitly visible to justify the checkboxes on Component/Tool cards, or remove the checkboxes entirely.

### Tier 3: Layout Redesigns (Hard)
These require structural HTML and CSS redesigns of specific components.
13. **Collapse Knowledge Base Filters:** Redesign the toolbar in `knowledgebase.html` to hide the 5 complex dropdowns behind a popover/modal, exposing only the 2-3 most important filters directly on the bar.
14. **Loosen 10-Stage Stepper:** Adjust the CSS of the horizontal stepper to prevent the number, name, and status from packing too tightly at a 10-stage density.
15. **Dashboard Hero Redesign:** Give the Dashboard's "Current Project" card a large, prominent hero treatment, and demote the 8 uniform stat tiles to a smaller secondary row.
16. **Design Empty States:** Build custom empty-state graphics and copy for the bottom halves of sparse pages (Dashboard, Completed Projects, Enquiry, Profile) to replace the dead canvas.

### Tier 4: Architectural (Very Hard)
These require significant refactoring of the codebase.
17. **Standardize Catalog-Card Template:** Unify the 4 different visual card languages (Equipment, Components, Tools, Knowledge Base) into a single, reusable HTML component structure with a fixed aspect ratio and grid density.
18. **Consolidate Shared Chrome:** Refactor the multi-page architecture so the sidebar and header are rendered from a single source of truth, preventing the drift of active states and placeholder texts across pages.
