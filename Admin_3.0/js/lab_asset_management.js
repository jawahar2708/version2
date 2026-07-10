/**
 * ============================================================
 * ILP RAPID PROTOTYPING LAB â€“ LAB ASSET MANAGEMENT
 * lab_asset_management.js
 *
 * Responsibilities:
 *  - Static mock data (Equipment, Components, Tools)
 *  - Category toggle (Equipment / Components / Tools)
 *  - Live search / filter
 *  - Dynamic table rendering with column headers per category
 *  - Pagination
 *  - Add / Edit modal with form validation
 *  - Character counter for Remarks textarea
 *  - Sidebar hamburger toggle (mobile)
 *  - Toast notifications
 *
 * NOTE: All data lives in JS arrays. To replace with a real API
 *       in the future, swap out the MOCK DATA section and the
 *       loadData() pattern â€“ no UI code changes needed.
 * ============================================================
 */

'use strict';

/* ============================================================
   MOCK DATA
   ============================================================ */

/** Equipment data */
let equipmentData = [
    {
        id: 1,
        eqpTypeId: 'EQP-001',
        name: '3D Printer',
        make: 'Creality',
        specification: 'Ender 3 V2',
        totalCount: 3,
        componentType: 'Manufacturing Equipment',
        lab: 'Mechanical Lab',
        remarks: 'Working Fine',
        quantity: 3,
    },
    {
        id: 2,
        eqpTypeId: 'EQP-002',
        name: 'Laser Cutter',
        make: 'Ortur',
        specification: 'Laser Master 2',
        totalCount: 10,
        componentType: 'Manufacturing Equipment',
        lab: 'Mechanical Lab',
        remarks: 'Service Due',
        quantity: 10,
    },
    {
        id: 3,
        eqpTypeId: 'EQP-003',
        name: 'CNC Machine',
        make: 'Genmitsu',
        specification: '3018-PRO',
        totalCount: 5,
        componentType: 'Manufacturing Equipment',
        lab: 'Manufacturing Lab',
        remarks: 'Operational',
        quantity: 5,
    }
];

/** Components data */
let componentsData = [
    {
        id: 1,
        eqpTypeId: 'CMP-001',
        name: 'Arduino Uno',
        make: 'Arduino',
        specification: 'ATmega328P',
        cost: 850,
        returnTimeline: 'Project Completion',
        totalCount: 40,
        componentType: 'Electronics',
        lab: 'Embedded Lab',
        cupboard: 'CUP-1',
        shelf1: 'A1',
        count1: 20,
        shelf2: 'A2',
        count2: 20,
        purpose: 'Student Projects',
        comments: 'Available',
        quantity: 40,
    },
    {
        id: 2,
        eqpTypeId: 'CMP-002',
        name: 'Raspberry Pi 4',
        make: 'Raspberry',
        specification: '8GB RAM',
        cost: 7000,
        returnTimeline: 'Project Completion',
        totalCount: 15,
        componentType: 'Embedded',
        lab: 'IoT Lab',
        cupboard: 'CUP-2',
        shelf1: 'B1',
        count1: 8,
        shelf2: 'B2',
        count2: 7,
        purpose: 'Research',
        comments: 'Limited',
        quantity: 15,
    }
];

/** Tools data */
let toolsData = [
    {
        id: 1,
        eqpTypeId: 'TLS-001',
        name: 'Screw Driver Set',
        make: 'Bosch',
        specification: 'Professional Kit',
        cost: 2500,
        returnTimeline: 'Project Completion',
        totalCount: 10,
        componentType: 'Hand Tool',
        lab: 'Mechanical Lab',
        cupboard: 'CUP-5',
        shelf1: 'A1',
        count1: 5,
        shelf2: 'A2',
        count2: 5,
        purpose: 'Maintenance',
        comments: 'Good Condition',
        quantity: 10,
    },
    {
        id: 2,
        eqpTypeId: 'TLS-002',
        name: 'Soldering Iron',
        make: 'Hakko',
        specification: '60W',
        cost: 3200,
        returnTimeline: 'Project Completion',
        totalCount: 12,
        componentType: 'Electronic Tool',
        lab: 'Embedded Lab',
        cupboard: 'CUP-6',
        shelf1: 'B1',
        count1: 6,
        shelf2: 'B2',
        count2: 6,
        purpose: 'PCB Assembly',
        comments: 'Available',
        quantity: 12,
    }
];

/* ============================================================
   STATE
   ============================================================ */
let currentCategory = 'equipment'; // 'equipment' | 'components' | 'tools'
let editingId = null;               // null = add mode, integer = edit mode
let currentPage = 1;
const ROWS_PER_PAGE = 5;

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const searchInput = document.getElementById('searchInput');
const addAssetBtn = document.getElementById('addAssetBtn');
const addAssetBtnText = document.getElementById('addAssetBtnText');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const tableTitle = document.getElementById('tableTitle');
const tableCount = document.getElementById('tableCount');
const paginationInfo = document.getElementById('paginationInfo');
const paginationCtrl = document.getElementById('paginationControls');

// Modal DOM
const equipmentModal = document.getElementById('equipmentModal');
const modalHeading = document.getElementById('modalHeading');
const modalSubheading = document.getElementById('modalSubheading');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const submitModalBtn = document.getElementById('submitModalBtn');
const submitBtnLabel = document.getElementById('submitBtnLabel');
const equipmentForm = document.getElementById('equipmentForm');

// Form fields (Common)
const fEqpTypeId = document.getElementById('fEqpTypeId');
const fName = document.getElementById('fName');
const fQuantity = document.getElementById('fQuantity');
const fMake = document.getElementById('fMake');
const fSpecification = document.getElementById('fSpecification');
const fComponentType = document.getElementById('fComponentType');
const fLab = document.getElementById('fLab');

// Form fields (Eqp)
const fRemarks = document.getElementById('fRemarks');
const charCount = document.getElementById('charCount');

// Form fields (Cmp / Tool)
const fCost = document.getElementById('fCost');
const fReturnTimeline = document.getElementById('fReturnTimeline');
const fCupboard = document.getElementById('fCupboard');
const fShelf1 = document.getElementById('fShelf1');
const fCount1 = document.getElementById('fCount1');
const fShelf2 = document.getElementById('fShelf2');
const fCount2 = document.getElementById('fCount2');
const fPurpose = document.getElementById('fPurpose');
const fComments = document.getElementById('fComments');

// Error spans
const errEqpTypeId = document.getElementById('errEqpTypeId');
const errName = document.getElementById('errName');
const errQuantity = document.getElementById('errQuantity');
const errMake = document.getElementById('errMake');
const errLab = document.getElementById('errLab');

// Toast
const toastContainer = document.getElementById('toastContainer');

// Sidebar
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburgerBtn = document.getElementById('hamburgerBtn');

/* ============================================================
   COLUMN DEFINITIONS
   ============================================================ */

const EQUIPMENT_COLUMNS = [
    { key: 'id', label: 'Sl No' },
    { key: 'name', label: 'Component Name' },
    { key: 'make', label: 'Make' },
    { key: 'specification', label: 'Specification / Version' },
    { key: 'totalCount', label: 'Total Count' },
    { key: 'componentType', label: 'Component Type' },
    { key: 'lab', label: 'Lab' },
    { key: 'remarks', label: 'Remarks' },
    { key: '_actions', label: 'Actions' },
];

const COMPONENT_TOOL_COLUMNS = [
    { key: 'id', label: 'Sl No' },
    { key: 'name', label: 'Component Name' },
    { key: 'make', label: 'Make' },
    { key: 'specification', label: 'Specification / Version' },
    { key: 'cost', label: 'Cost (â‚¹)' },
    { key: 'returnTimeline', label: 'Return Timeline' },
    { key: 'totalCount', label: 'Total Count' },
    { key: 'componentType', label: 'Component Type' },
    { key: 'lab', label: 'Lab' },
    { key: 'cupboard', label: 'Cupboard Stored In' },
    { key: 'shelf1', label: 'Shelf 1' },
    { key: 'count1', label: 'Count 1' },
    { key: 'shelf2', label: 'Shelf 2' },
    { key: 'count2', label: 'Count 2' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'comments', label: 'Comments' },
    { key: '_actions', label: 'Actions' },
];

/* ============================================================
   UTILITY
   ============================================================ */

/**
 * Returns the active dataset based on current category.
 * Front-end always reads from module-level arrays so that edits
 * persist across searches/page turns within the session.
 */
function getActiveData() {
    if (currentCategory === 'equipment') return equipmentData;
    if (currentCategory === 'components') return componentsData;
    return toolsData;
}

/** Returns columns for current category */
function getActiveColumns() {
    return currentCategory === 'equipment'
        ? EQUIPMENT_COLUMNS
        : COMPONENT_TOOL_COLUMNS;
}

/** Returns the human-readable category title */
function getCategoryTitle() {
    if (currentCategory === 'equipment') return 'Equipment';
    if (currentCategory === 'components') return 'Components';
    return 'Tools';
}

/** Show a toast message */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'check-circle' : 'x-circle';
    toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => toast.remove(), 3200);
}

/** Escape HTML to prevent XSS in rendered table cells */
function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ============================================================
   SEARCH FILTER
   ============================================================ */

/** Filter dataset using the current search query */
function filterData(data) {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return data;
    return data.filter(row =>
        Object.values(row).some(v =>
            String(v).toLowerCase().includes(q)
        )
    );
}

/* ============================================================
   TABLE RENDERING
   ============================================================ */

/** Build and inject the <thead> row */
function renderHead() {
    const cols = getActiveColumns();
    tableHead.innerHTML = `
    <tr>
      ${cols.map(c => `<th>${c.label}</th>`).join('')}
    </tr>
  `;
}

/**
 * Render a single cell value.
 * Special handling: _actions renders the edit icon button.
 */
function renderCell(col, row) {
    if (col.key === '_actions') {
        return `
      <td>
        <button
          class="action-btn-edit"
          aria-label="Edit ${esc(row.name)}"
          onclick="openEditModal(${row.id})"
        >
          <i data-lucide="pencil"></i>
        </button>
      </td>
    `;
    }
    return `<td>${esc(row[col.key])}</td>`;
}

/** Main render: filter â†’ paginate â†’ inject rows */
function renderTable() {
    const data = getActiveData();
    const cols = getActiveColumns();
    const filtered = filterData(data);

    // Clamp currentPage
    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const pageRows = filtered.slice(start, start + ROWS_PER_PAGE);

    // Update header row
    renderHead();

    // Update title & count
    tableTitle.textContent = getCategoryTitle();
    tableCount.textContent = `Showing ${filtered.length} record${filtered.length !== 1 ? 's' : ''}`;

    // Empty state
    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.querySelector('.table-responsive table').style.display = 'none';
    } else {
        emptyState.classList.add('hidden');
        document.querySelector('.table-responsive table').style.display = '';

        tableBody.innerHTML = pageRows.map((row, idx) => {
            // Renumber Sl No to be within the current page context
            const displayRow = { ...row, id: start + idx + 1 };
            return `<tr>${cols.map(c => renderCell(c, displayRow)).join('')}</tr>`;
        }).join('');
    }

    // Re-initialise Lucide icons for dynamically inserted SVGs
    lucide.createIcons();

    // Pagination
    renderPagination(filtered.length, totalPages);
}

/* ============================================================
   PAGINATION
   ============================================================ */

function renderPagination(total, totalPages) {
    const start = (currentPage - 1) * ROWS_PER_PAGE + 1;
    const end = Math.min(currentPage * ROWS_PER_PAGE, total);

    paginationInfo.textContent = total > 0
        ? `Showing ${start}â€“${end} of ${total} records`
        : 'No records';

    // Build page buttons
    let html = '';

    // Prev
    html += `
    <button class="page-btn" id="prevPageBtn" ${currentPage <= 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
      <i data-lucide="chevron-left"></i>
    </button>
  `;

    // Numbered pages (show max 5 around current)
    for (let p = 1; p <= totalPages; p++) {
        if (
            p === 1 || p === totalPages ||
            (p >= currentPage - 1 && p <= currentPage + 1)
        ) {
            html += `<button class="page-btn${p === currentPage ? ' active' : ''}" onclick="changePage(${p})">${p}</button>`;
        } else if (p === currentPage - 2 || p === currentPage + 2) {
            html += `<span style="padding:0 4px;color:var(--text-muted)">â€¦</span>`;
        }
    }

    // Next
    html += `
    <button class="page-btn" ${currentPage >= totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
      <i data-lucide="chevron-right"></i>
    </button>
  `;

    paginationCtrl.innerHTML = html;
    lucide.createIcons();
}

/** Called by pagination button onclick */
function changePage(page) {
    currentPage = page;
    renderTable();
}

/* ============================================================
   CATEGORY TOGGLE
   ============================================================ */

document.getElementById('categoryToggle').addEventListener('click', e => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;

    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = btn.dataset.category;
    currentPage = 1;
    searchInput.value = '';

    // Update the Add button text contextually
    if (currentCategory === 'equipment') {
        addAssetBtnText.textContent = 'Add Equipment';
    } else if (currentCategory === 'components') {
        addAssetBtnText.textContent = 'Add Component';
    } else {
        addAssetBtnText.textContent = 'Add Tool';
    }

    renderTable();
});

/* ============================================================
   LIVE SEARCH
   ============================================================ */

searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderTable();
});

/* ============================================================
   MODAL â€“ OPEN / CLOSE
   ============================================================ */

/* ============================================================
   MODAL â€“ DISPLAY LOGIC
   ============================================================ */

/** Hides/shows specific fields in the modal depending on current category */
function toggleModalFields() {
    const eqpFields = document.querySelectorAll('.eqp-field');
    const extraFields = document.querySelectorAll('.extra-field');

    if (currentCategory === 'equipment') {
        eqpFields.forEach(el => el.style.display = 'block');
        extraFields.forEach(el => el.style.display = 'none');
    } else {
        eqpFields.forEach(el => el.style.display = 'none');
        extraFields.forEach(el => el.style.display = 'block');
    }
}

/* ============================================================
   MODAL â€“ OPEN / CLOSE
   ============================================================ */

/** Open the Add Asset modal (clear form) */
addAssetBtn.addEventListener('click', () => {
    editingId = null;
    let typeName = getCategoryTitle();

    modalHeading.textContent = `Add ${typeName.slice(0, -1)}`; // removing plural 's'
    modalSubheading.textContent = `Asset Information Â· Create new ${typeName.slice(0, -1)}`;
    submitBtnLabel.textContent = `Create ${typeName.slice(0, -1)}`;

    // Update submit icon
    submitModalBtn.querySelector('i').setAttribute('data-lucide', 'plus-circle');

    toggleModalFields();
    clearForm();
    clearErrors();
    equipmentModal.classList.add('active');
    lucide.createIcons();
    fEqpTypeId.focus();
});

/** Open the Edit modal pre-filled with row data */
function openEditModal(id) {
    editingId = id;
    const data = getActiveData();
    const row = data.find(r => r.id === id);
    if (!row) return;

    let typeName = getCategoryTitle();
    modalHeading.textContent = `Edit ${typeName.slice(0, -1)}`;
    modalSubheading.textContent = `Asset Information Â· Update existing ${typeName.slice(0, -1)}`;
    submitBtnLabel.textContent = `Update ${typeName.slice(0, -1)}`;

    submitModalBtn.querySelector('i').setAttribute('data-lucide', 'save');

    toggleModalFields();
    clearErrors();

    // Fill form fields
    fEqpTypeId.value = row.eqpTypeId || '';
    fName.value = row.name || '';
    fQuantity.value = row.quantity || '';
    fMake.value = row.make || '';
    fSpecification.value = row.specification || '';
    fComponentType.value = row.componentType || '';
    fLab.value = row.lab || '';

    // Eqp fields
    fRemarks.value = row.remarks || '';
    charCount.textContent = (row.remarks || '').length;

    // Extra fields
    fCost.value = row.cost || '';
    fReturnTimeline.value = row.returnTimeline || '';
    fCupboard.value = row.cupboard || '';
    fShelf1.value = row.shelf1 || '';
    fCount1.value = row.count1 || '';
    fShelf2.value = row.shelf2 || '';
    fCount2.value = row.count2 || '';
    fPurpose.value = row.purpose || '';
    fComments.value = row.comments || '';

    equipmentModal.classList.add('active');
    lucide.createIcons();
    fName.focus();
}

/** Close modal */
function closeModal() {
    equipmentModal.classList.remove('active');
    editingId = null;
}

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// Close on backdrop click
equipmentModal.addEventListener('click', e => {
    if (e.target === equipmentModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && equipmentModal.classList.contains('active')) closeModal();
});

/* ============================================================
   CHARACTER COUNTER
   ============================================================ */

fRemarks.addEventListener('input', () => {
    charCount.textContent = fRemarks.value.length;
});

/* ============================================================
   FORM VALIDATION
   ============================================================ */

const REQUIRED_FIELDS = [
    { el: fEqpTypeId, err: errEqpTypeId, label: 'EQP TYPE ID is required' },
    { el: fName, err: errName, label: 'Name is required' },
    { el: fQuantity, err: errQuantity, label: 'Available Quantity is required' },
    { el: fMake, err: errMake, label: 'Make is required' },
    { el: fLab, err: errLab, label: 'Lab is required' },
];

/** Validate a single field and show/clear its error */
function validateField(field) {
    const { el, err, label } = field;
    const val = el.value.trim();
    if (!val) {
        err.textContent = label;
        el.classList.add('error');
        return false;
    }
    // Quantity must be a non-negative number
    if (el === fQuantity && (isNaN(Number(val)) || Number(val) < 0)) {
        err.textContent = 'Enter a valid non-negative number';
        el.classList.add('error');
        return false;
    }
    err.textContent = '';
    el.classList.remove('error');
    return true;
}

/** Validate all required fields; return true if all pass */
function validateForm() {
    return REQUIRED_FIELDS.map(validateField).every(Boolean);
}

/** Attach blur-time validation to each required field */
REQUIRED_FIELDS.forEach(field => {
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => {
        if (field.el.classList.contains('error')) validateField(field);
    });
});

/** Clear all field error states */
function clearErrors() {
    REQUIRED_FIELDS.forEach(({ el, err }) => {
        err.textContent = '';
        el.classList.remove('error');
    });
}

/** Reset all form fields to empty */
function clearForm() {
    fEqpTypeId.value = '';
    fName.value = '';
    fQuantity.value = '';
    fMake.value = '';
    fSpecification.value = '';
    fComponentType.value = '';
    fLab.value = '';

    // Eqp fields
    fRemarks.value = '';
    charCount.textContent = '0';

    // Extra fields
    fCost.value = '';
    fReturnTimeline.value = '';
    fCupboard.value = '';
    fShelf1.value = '';
    fCount1.value = '';
    fShelf2.value = '';
    fCount2.value = '';
    fPurpose.value = '';
    fComments.value = '';
}

/* ============================================================
   FORM SUBMIT â€“ ADD / EDIT
   ============================================================ */

submitModalBtn.addEventListener('click', () => {
    if (!validateForm()) return;

    // Gather base data
    const formData = {
        eqpTypeId: fEqpTypeId.value.trim(),
        name: fName.value.trim(),
        quantity: Number(fQuantity.value.trim()),
        make: fMake.value.trim(),
        specification: fSpecification.value.trim(),
        componentType: fComponentType.value.trim(),
        lab: fLab.value.trim(),
        totalCount: Number(fQuantity.value.trim()),
    };

    // Attach category-specific data
    if (currentCategory === 'equipment') {
        formData.remarks = fRemarks.value.trim();
    } else {
        formData.cost = fCost.value ? parseFloat(fCost.value) : 0;
        formData.returnTimeline = fReturnTimeline.value.trim();
        formData.cupboard = fCupboard.value.trim();
        formData.shelf1 = fShelf1.value.trim();
        formData.count1 = fCount1.value ? parseInt(fCount1.value, 10) : 0;
        formData.shelf2 = fShelf2.value.trim();
        formData.count2 = fCount2.value ? parseInt(fCount2.value, 10) : 0;
        formData.purpose = fPurpose.value.trim();
        formData.comments = fComments.value.trim();
    }

    const data = getActiveData();

    if (editingId === null) {
        // â”€â”€ ADD NEW RECORD â”€â”€
        const newId = data.length > 0
            ? Math.max(...data.map(r => r.id)) + 1
            : 1;

        const newRow = {
            id: newId,
            ...formData
        };

        data.push(newRow);
        updateStats();
        showToast(`Asset "${formData.name}" added successfully.`, 'success');
    } else {
        // â”€â”€ EDIT EXISTING RECORD â”€â”€
        const idx = data.findIndex(r => r.id === editingId);
        if (idx !== -1) {
            data[idx] = { ...data[idx], ...formData };
        }
        showToast(`Asset "${formData.name}" updated successfully.`, 'success');
    }

    closeModal();
    renderTable();
});

/* ============================================================
   STATS CALCULATION
   ============================================================ */

/** Recalculate and display the three summary cards */
function updateStats() {
    const all = [...equipmentData, ...componentsData, ...toolsData];
    document.getElementById('statTotal').textContent = all.length;
    // For demo: Available = units not flagged for repair
    document.getElementById('statAvailable').textContent = all.filter(r =>
        !(r.remarks || '').toLowerCase().includes('repair') &&
        !(r.remarks || '').toLowerCase().includes('service') &&
        !(r.remarks || '').toLowerCase().includes('calibration') &&
        !(r.remarks || '').toLowerCase().includes('pending')
    ).length;
    document.getElementById('statMaintenance').textContent = all.filter(r =>
        (r.remarks || '').toLowerCase().includes('repair') ||
        (r.remarks || '').toLowerCase().includes('service') ||
        (r.remarks || '').toLowerCase().includes('calibration') ||
        (r.remarks || '').toLowerCase().includes('pending')
    ).length;
}

/* ============================================================
   SIDEBAR (Mobile hamburger toggle)
   ============================================================ */

hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

/* Sidebar dropdown toggle */
const dropdownToggle = document.querySelector('.dropdown-toggle');
if (dropdownToggle) {
    dropdownToggle.addEventListener('click', () => {
        const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        dropdownToggle.setAttribute('aria-expanded', String(!isExpanded));
        dropdownToggle.classList.toggle('active');
        document.getElementById('manageTeamsDropdown').classList.toggle('active');
    });
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
    updateStats();
    renderTable();
    lucide.createIcons();
}

// Expose to global scope for inline onclick handlers
window.openEditModal = openEditModal;
window.changePage = changePage;

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

