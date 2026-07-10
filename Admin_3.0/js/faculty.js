/* ============================================================
   FACULTY LIST JAVASCRIPT
   ============================================================ */

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let currentSort = { column: 'name', order: 'asc' };
let activeFacultyId = null;
let facultyData = [];

document.addEventListener('DOMContentLoaded', () => {
    facultyData = (window.__RPL_DB__ && window.__RPL_DB__.faculty) ? window.__RPL_DB__.faculty : [];
    lucide.createIcons();
    fetchNavigation();
    initFiltersAndSearch();
    initModals();
    updateSummaryCards();
    renderTable();
});

/* ============================================================
   SIDEBAR NAV
   ============================================================ */
function fetchNavigation() {
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = btn.closest('.nav-group');
            const menu = group.querySelector('.dropdown-menu');
            const isActive = btn.classList.contains('active');
            document.querySelectorAll('.dropdown-toggle').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
            if (!isActive) { btn.classList.add('active'); if (menu) menu.classList.add('active'); }
        });
    });
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); overlay.classList.remove('active'); });
}

/* ============================================================
   SUMMARY CARDS
   ============================================================ */
function updateSummaryCards() {
    const total = facultyData.length;
    // Simple mock: "assigned" = status Active, "unassigned" = status Inactive
    const assigned = facultyData.filter(f => f.status === 'Active').length;
    const unassigned = total - assigned;

    document.getElementById('totalFaculty').textContent = total;
    document.getElementById('assignedFaculty').textContent = assigned;
    document.getElementById('unassignedFaculty').textContent = unassigned;
}

/* ============================================================
   TABLE & FILTER
   ============================================================ */
function initFiltersAndSearch() {
    document.getElementById('facultySearch').addEventListener('input', () => { currentPage = 1; renderTable(); });
    document.getElementById('statusFilter').addEventListener('change', () => { currentPage = 1; renderTable(); });
    document.querySelectorAll('#facultyTable th').forEach(th => {
        th.addEventListener('click', () => {
            const index = Array.from(th.parentNode.children).indexOf(th);
            if (index === 1) handleSort('id');
            else if (index === 2) handleSort('name');
        });
    });
}

function handleSort(key) {
    if (currentSort.column === key) currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    else { currentSort.column = key; currentSort.order = 'asc'; }
    renderTable();
}

function renderTable() {
    const searchVal = document.getElementById('facultySearch').value.toLowerCase().trim();
    const statusVal = document.getElementById('statusFilter').value;

    let filtered = facultyData.filter(f => {
        const matchSearch = f.name.toLowerCase().includes(searchVal) || f.id.toLowerCase().includes(searchVal);
        const matchStatus = (statusVal === 'All') || (f.status === statusVal);
        return matchSearch && matchStatus;
    });

    filtered.sort((a, b) => {
        let valA = (a[currentSort.column] || '').toLowerCase();
        let valB = (b[currentSort.column] || '').toLowerCase();
        if (valA < valB) return currentSort.order === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.order === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const tbody = document.getElementById('facultyTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (paginated.length === 0) {
        emptyState.classList.remove('hidden');
        document.getElementById('facultyTable').classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        document.getElementById('facultyTable').classList.remove('hidden');
        paginated.forEach((f, idx) => {
            const siNo = startIdx + idx + 1;
            const badgeClass = f.status === 'Active' ? 'badge-active' : 'badge-inactive';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${siNo}</td>
                <td><strong>${f.id}</strong></td>
                <td>${f.name}</td>
                <td>${f.role}</td>
                <td><span class="badge ${badgeClass}">${f.status}</span></td>
                <td class="actions-col">
                    <button class="action-btn" title="View details" onclick="openFacultyModal('${f.id}')">
                        <i data-lucide="eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
    lucide.createIcons();
}

document.getElementById('prevPageBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
document.getElementById('nextPageBtn').addEventListener('click', () => { currentPage++; renderTable(); });

/* ============================================================
   MODALS
   ============================================================ */
function initModals() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    bind('closeFacultyModalBtn', closeFacultyModal);
    bind('cancelEditBtn', () => setModalMode('view'));
    bind('editModeBtn', () => setModalMode('edit'));
    bind('deleteBtn', () => document.getElementById('confirmDeleteModal').classList.add('active'));
    bind('closeDeleteModalBtn', () => document.getElementById('confirmDeleteModal').classList.remove('active'));
    bind('cancelDeleteBtn', () => document.getElementById('confirmDeleteModal').classList.remove('active'));
    bind('confirmDeleteBtn', confirmDeleteForm);
    document.getElementById('editFacultyForm').addEventListener('submit', (e) => { e.preventDefault(); saveEditForm(); });
}

function openFacultyModal(id) {
    activeFacultyId = id;
    const f = facultyData.find(x => x.id === id);
    if (!f) return;

    // Populate View (8 fields only)
    document.getElementById('viewId').textContent = f.id || '-';
    document.getElementById('viewName').textContent = f.name || '-';
    document.getElementById('viewEmail').textContent = f.email || '-';
    document.getElementById('viewPhone').textContent = f.phone || '-';
    document.getElementById('viewGender').textContent = f.gender || '-';
    document.getElementById('viewDob').textContent = formatDate(f.dob) || '-';
    document.getElementById('viewRole').textContent = f.role || '-';
    document.getElementById('viewStatus').textContent = f.status || '-';

    // Populate Edit (8 fields only)
    document.getElementById('editId').value = f.id || '';
    document.getElementById('editName').value = f.name || '';
    document.getElementById('editEmail').value = f.email || '';
    document.getElementById('editPhone').value = f.phone || '';
    document.getElementById('editGender').value = f.gender || 'Male';
    document.getElementById('editDob').value = f.dob || '';
    document.getElementById('editRole').value = f.role || '';
    document.getElementById('editStatus').value = f.status || 'Active';

    setModalMode('view');
    document.getElementById('facultyModal').classList.add('active');
}

function closeFacultyModal() {
    document.getElementById('facultyModal').classList.remove('active');
    activeFacultyId = null;
}

function setModalMode(mode) {
    const show = (id) => document.getElementById(id).classList.remove('hidden');
    const hide = (id) => document.getElementById(id).classList.add('hidden');
    if (mode === 'edit') { hide('viewFacultyMode'); hide('viewModalFooter'); show('editFacultyMode'); show('editModalFooter'); }
    else { hide('editFacultyMode'); hide('editModalFooter'); show('viewFacultyMode'); show('viewModalFooter'); }
}

function saveEditForm() {
    if (!activeFacultyId) return;
    const idx = facultyData.findIndex(f => f.id === activeFacultyId);
    if (idx !== -1) {
        facultyData[idx].name = document.getElementById('editName').value.trim();
        facultyData[idx].email = document.getElementById('editEmail').value.trim();
        facultyData[idx].phone = document.getElementById('editPhone').value.trim();
        facultyData[idx].gender = document.getElementById('editGender').value;
        facultyData[idx].dob = document.getElementById('editDob').value;
        facultyData[idx].role = document.getElementById('editRole').value.trim();
        facultyData[idx].status = document.getElementById('editStatus').value;
        showToast('Faculty updated successfully.', 'success');
        updateSummaryCards();
        renderTable();
        openFacultyModal(activeFacultyId);
    }
}

function confirmDeleteForm() {
    if (activeFacultyId) {
        const idx = facultyData.findIndex(f => f.id === activeFacultyId);
        if (idx !== -1) { facultyData.splice(idx, 1); showToast('Faculty member deleted.', 'success'); updateSummaryCards(); renderTable(); }
    }
    document.getElementById('confirmDeleteModal').classList.remove('active');
    closeFacultyModal();
}

function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
    toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}"></i><p>${message}</p>`;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000);
}
