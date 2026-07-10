/* ============================================================
   TRAINEE LIST JAVASCRIPT
   ============================================================ */

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let currentSort = { column: 'name', order: 'asc' };
let activeTraineeId = null;
let traineeData = [];

document.addEventListener('DOMContentLoaded', () => {
    traineeData = (window.__RPL_DB__ && window.__RPL_DB__.trainees) ? window.__RPL_DB__.trainees : [];
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
    const total = traineeData.length;
    const assigned = traineeData.filter(t => t.status === 'Active').length;
    const unassigned = total - assigned;

    document.getElementById('totalTrainees').textContent = total;
    document.getElementById('assignedTrainees').textContent = assigned;
    document.getElementById('unassignedTrainees').textContent = unassigned;
}

/* ============================================================
   TABLE & FILTER
   ============================================================ */
function initFiltersAndSearch() {
    document.getElementById('traineeSearch').addEventListener('input', () => { currentPage = 1; renderTable(); });
    document.getElementById('statusFilter').addEventListener('change', () => { currentPage = 1; renderTable(); });
    document.querySelectorAll('#traineeTable th').forEach(th => {
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
    const searchVal = document.getElementById('traineeSearch').value.toLowerCase().trim();
    const statusVal = document.getElementById('statusFilter').value;

    let filtered = traineeData.filter(t => {
        const matchSearch = (t.name || '').toLowerCase().includes(searchVal) || (t.id || '').toLowerCase().includes(searchVal);
        const matchStatus = (statusVal === 'All') || (t.status === statusVal);
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

    const tbody = document.getElementById('traineeTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (paginated.length === 0) {
        emptyState.classList.remove('hidden');
        document.getElementById('traineeTable').classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        document.getElementById('traineeTable').classList.remove('hidden');
        paginated.forEach((t, idx) => {
            const siNo = startIdx + idx + 1;
            const badgeClass = t.status === 'Active' ? 'badge-active' : 'badge-inactive';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${siNo}</td>
                <td><strong>${t.id || ''}</strong></td>
                <td>${t.name || ''}</td>
                <td>${t.role || 'Trainee'}</td>
                <td><span class="badge ${badgeClass}">${t.status || ''}</span></td>
                <td class="actions-col">
                    <button class="action-btn" title="View details" onclick="openTraineeModal('${t.id}')">
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
    bind('closeTraineeModalBtn', closeTraineeModal);
    bind('cancelEditBtn', () => setModalMode('view'));
    bind('editModeBtn', () => setModalMode('edit'));
    bind('deleteBtn', () => document.getElementById('confirmDeleteModal').classList.add('active'));
    bind('closeDeleteModalBtn', () => document.getElementById('confirmDeleteModal').classList.remove('active'));
    bind('cancelDeleteBtn', () => document.getElementById('confirmDeleteModal').classList.remove('active'));
    bind('confirmDeleteBtn', confirmDeleteForm);
    document.getElementById('editTraineeForm').addEventListener('submit', (e) => { e.preventDefault(); saveEditForm(); });
}

function openTraineeModal(id) {
    activeTraineeId = id;
    const t = traineeData.find(x => x.id === id);
    if (!t) return;

    // Populate View (8 fields only)
    document.getElementById('viewId').textContent = t.id || '-';
    document.getElementById('viewName').textContent = t.name || '-';
    document.getElementById('viewEmail').textContent = t.email || '-';
    document.getElementById('viewPhone').textContent = t.phone || '-';
    document.getElementById('viewGender').textContent = t.gender || '-';
    document.getElementById('viewDob').textContent = formatDate(t.dob) || '-';
    document.getElementById('viewRole').textContent = t.role || '-';
    document.getElementById('viewStatus').textContent = t.status || '-';

    // Populate Edit (8 fields only)
    document.getElementById('editId').value = t.id || '';
    document.getElementById('editName').value = t.name || '';
    document.getElementById('editEmail').value = t.email || '';
    document.getElementById('editPhone').value = t.phone || '';
    document.getElementById('editGender').value = t.gender || 'Male';
    document.getElementById('editDob').value = t.dob || '';
    document.getElementById('editRole').value = t.role || '';
    document.getElementById('editStatus').value = t.status || 'Active';

    setModalMode('view');
    document.getElementById('traineeModal').classList.add('active');
}

function closeTraineeModal() {
    document.getElementById('traineeModal').classList.remove('active');
    activeTraineeId = null;
}

function setModalMode(mode) {
    const show = (id) => document.getElementById(id).classList.remove('hidden');
    const hide = (id) => document.getElementById(id).classList.add('hidden');
    if (mode === 'edit') { hide('viewTraineeMode'); hide('viewModalFooter'); show('editTraineeMode'); show('editModalFooter'); }
    else { hide('editTraineeMode'); hide('editModalFooter'); show('viewTraineeMode'); show('viewModalFooter'); }
}

function saveEditForm() {
    if (!activeTraineeId) return;
    const idx = traineeData.findIndex(t => t.id === activeTraineeId);
    if (idx !== -1) {
        traineeData[idx].name = document.getElementById('editName').value.trim();
        traineeData[idx].email = document.getElementById('editEmail').value.trim();
        traineeData[idx].phone = document.getElementById('editPhone').value.trim();
        traineeData[idx].gender = document.getElementById('editGender').value;
        traineeData[idx].dob = document.getElementById('editDob').value;
        traineeData[idx].role = document.getElementById('editRole').value.trim();
        traineeData[idx].status = document.getElementById('editStatus').value;
        showToast('Trainee updated successfully.', 'success');
        updateSummaryCards();
        renderTable();
        openTraineeModal(activeTraineeId);
    }
}

function confirmDeleteForm() {
    if (activeTraineeId) {
        const idx = traineeData.findIndex(t => t.id === activeTraineeId);
        if (idx !== -1) { traineeData.splice(idx, 1); showToast('Trainee deleted.', 'success'); updateSummaryCards(); renderTable(); }
    }
    document.getElementById('confirmDeleteModal').classList.remove('active');
    closeTraineeModal();
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
