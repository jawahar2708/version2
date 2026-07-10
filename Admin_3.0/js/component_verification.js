/**
 * Component Verification Module
 * Frontend-only mock data implementation
 */

// Mock Data
const faculties = [
    { id: 'FAC-001', name: 'Dr. Aravind Kumar', role: 'Technical Faculty', teams: 3, pending: 5 },
    { id: 'FAC-002', name: 'Dr. Meena R', role: 'Lab In-Charge', teams: 4, pending: 2 },
    { id: 'FAC-003', name: 'Dr. Karthik S', role: 'Technical Faculty', teams: 2, pending: 8 },
    { id: 'FAC-004', name: 'Dr. Lakshmi N', role: 'Project Coordinator', teams: 5, pending: 0 },
    { id: 'FAC-005', name: 'Dr. Rahul Sharma', role: 'Technical Faculty', teams: 3, pending: 1 },
    { id: 'FAC-006', name: 'Dr. Priya Sharma', role: 'Lab In-Charge', teams: 1, pending: 4 }
];

let requestsData = [
    {
        id: 'CRQ-001',
        teamId: 'TEAM-001',
        teamName: 'Team Alpha',
        project: 'AI-Powered Inventory Management System',
        purpose: 'IoT Gateway Development',
        requestedOn: '15 May 2026',
        deadline: '15 Jul 2026',
        components: [
            { id: 'c1', name: 'Raspberry Pi', qty: 2, status: 'Pending' },
            { id: 'c2', name: 'Power Supply', qty: 2, status: 'Pending' }
        ]
    },
    {
        id: 'CRQ-002',
        teamId: 'TEAM-001',
        teamName: 'Team Alpha',
        project: 'AI-Powered Inventory Management System',
        purpose: 'Sensor Node Assembly',
        requestedOn: '16 May 2026',
        deadline: '20 Jul 2026',
        components: [
            { id: 'c3', name: 'Arduino Uno', qty: 5, status: 'Approved' },
            { id: 'c4', name: 'Ultrasonic Sensors', qty: 10, status: 'Approved' }
        ]
    },
    {
        id: 'CRQ-003',
        teamId: 'TEAM-002',
        teamName: 'Team Beta',
        project: 'Smart Healthcare Wearable',
        purpose: 'Vitals Monitoring Prototype',
        requestedOn: '18 May 2026',
        deadline: '01 Aug 2026',
        components: [
            { id: 'c5', name: 'ESP32 Module', qty: 3, status: 'Pending' },
            { id: 'c6', name: 'Heart Rate Sensor', qty: 3, status: 'Pending' },
            { id: 'c7', name: 'OLED Display', qty: 1, status: 'Pending' }
        ]
    },
    {
        id: 'CRQ-004',
        teamId: 'TEAM-003',
        teamName: 'Team Gamma',
        project: 'Automated Drone Delivery',
        purpose: 'Flight Controller Testing',
        requestedOn: '10 May 2026',
        deadline: '10 Jun 2026',
        components: [
            { id: 'c8', name: 'Pixhawk 4', qty: 1, status: 'Rejected' },
            { id: 'c9', name: 'Brushless Motors', qty: 4, status: 'Rejected' },
            { id: 'c10', name: 'LiPo Battery 4S', qty: 2, status: 'Rejected' }
        ]
    }
];

let activeFacultyId = null;
let currentModalRequestId = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

function initApp() {
    renderFacultyGrid();

    // Event listeners for view toggling
    document.getElementById('backToFacultyBtn').addEventListener('click', () => {
        document.getElementById('requestVerificationView').classList.add('hidden');
        document.getElementById('facultySelectionView').classList.remove('hidden');
        document.getElementById('mainHeaderSubtitle').textContent = 'Select a faculty member to review and verify component requests submitted by assigned teams.';
    });

    // Filters
    document.getElementById('searchInput').addEventListener('input', filterRequests);
    document.getElementById('teamFilter').addEventListener('change', filterRequests);
    document.getElementById('statusFilter').addEventListener('change', filterRequests);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Modal
    document.getElementById('closeComponentsModal').addEventListener('click', closeModal);
    document.getElementById('selectAllCheckbox').addEventListener('change', toggleAllCheckboxes);
    document.getElementById('approveSelectedBtn').addEventListener('click', () => handleBulkAction('Approved'));
    document.getElementById('rejectSelectedBtn').addEventListener('click', () => handleBulkAction('Rejected'));

    // Setup Top Navigation
    document.getElementById('hamburgerBtn').addEventListener('click', () => {
        document.getElementById('sidebar').style.transform = 'translateX(0)';
        document.getElementById('sidebarOverlay').classList.add('active');
    });

    document.getElementById('sidebarOverlay').addEventListener('click', () => {
        document.getElementById('sidebar').style.transform = '';
        document.getElementById('sidebarOverlay').classList.remove('active');
    });

    // Dropdown functionality for sidebar
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = btn.closest('.nav-group');
            const menu = group.querySelector('.dropdown-menu');
            const isActive = btn.classList.contains('active');
            
            document.querySelectorAll('.dropdown-toggle').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
            
            if (!isActive) {
                btn.classList.add('active');
                if (menu) menu.classList.add('active');
            }
        });
    });
}

function renderFacultyGrid() {
    const grid = document.getElementById('facultyGrid');
    grid.innerHTML = '';

    faculties.forEach(faculty => {
        const card = document.createElement('div');
        card.className = 'faculty-card';
        card.innerHTML = `
            <div class="fc-header">
                <div class="fc-avatar">
                    <i data-lucide="user"></i>
                </div>
                <div class="fc-info">
                    <h3>${faculty.name}</h3>
                    <p>${faculty.role}</p>
                    <span class="fc-badge-id">${faculty.id}</span>
                </div>
            </div>
            <div class="fc-stats">
                <div class="fc-stat">
                    <span class="lbl">Assigned Teams</span>
                    <span class="val">${faculty.teams}</span>
                </div>
                <div class="fc-stat" style="text-align:right;">
                    <span class="lbl">Pending Requests</span>
                    <span class="val ${faculty.pending > 0 ? 'pending' : ''}">${faculty.pending}</span>
                </div>
            </div>
            <button class="fc-action">
                View Requests <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
            </button>
        `;

        card.addEventListener('click', () => openFacultyView(faculty));
        grid.appendChild(card);
    });

    // Re-init icons for dynamic content
    lucide.createIcons();
}

function openFacultyView(faculty) {
    activeFacultyId = faculty.id;
    document.getElementById('mainHeaderSubtitle').textContent = `Review component requests for ${faculty.name}`;

    document.getElementById('facultySelectionView').classList.add('hidden');
    document.getElementById('requestVerificationView').classList.remove('hidden');

    populateTeamFilter();
    renderRequests();
}

/**
 * Calculates the overall status of a request based on its components.
 * If all are Approved -> Approved
 * If all are Rejected -> Rejected
 * Otherwise -> Pending
 */
function getOverallStatus(components) {
    if (components.length === 0) return 'Pending';
    const approvedCount = components.filter(c => c.status === 'Approved').length;
    const rejectedCount = components.filter(c => c.status === 'Rejected').length;

    if (approvedCount === components.length) return 'Approved';
    if (rejectedCount === components.length) return 'Rejected';
    return 'Pending';
}

function getBadgeHtml(status) {
    if (status === 'Approved') return '<span class="badge badge-success">Approved</span>';
    if (status === 'Rejected') return '<span class="badge badge-danger" style="background:#fee2e2;color:#dc2626;">Rejected</span>';
    return '<span class="badge badge-warning">Pending</span>';
}

function populateTeamFilter() {
    const filter = document.getElementById('teamFilter');
    const uniqueTeams = [...new Set(requestsData.map(r => r.teamName))];

    filter.innerHTML = '<option value="All">All Teams</option>';
    uniqueTeams.forEach(team => {
        const opt = document.createElement('option');
        opt.value = team;
        opt.textContent = team;
        filter.appendChild(opt);
    });
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('teamFilter').value = 'All';
    document.getElementById('statusFilter').value = 'All';
    renderRequests();
}

function filterRequests() {
    renderRequests();
}

function renderRequests() {
    const searchStr = document.getElementById('searchInput').value.toLowerCase();
    const teamFilter = document.getElementById('teamFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filtered = requestsData.filter(req => {
        const overall = getOverallStatus(req.components);
        const matchSearch = req.id.toLowerCase().includes(searchStr) ||
            req.purpose.toLowerCase().includes(searchStr) ||
            req.components.some(c => c.name.toLowerCase().includes(searchStr));
        const matchTeam = teamFilter === 'All' || req.teamName === teamFilter;
        const matchStatus = statusFilter === 'All' || overall === statusFilter;
        return matchSearch && matchTeam && matchStatus;
    });

    updateSummaryCards(filtered);

    // Group by Team
    const grouped = {};
    filtered.forEach(req => {
        if (!grouped[req.teamName]) grouped[req.teamName] = { project: req.project, requests: [] };
        grouped[req.teamName].requests.push(req);
    });

    const container = document.getElementById('teamsContainer');
    container.innerHTML = '';

    if (Object.keys(grouped).length === 0) {
        container.innerHTML = `<div class="empty-state">No component requests found.</div>`;
        return;
    }

    for (const [teamName, data] of Object.entries(grouped)) {
        const card = document.createElement('div');
        card.className = 'team-card';

        // Header
        const header = document.createElement('div');
        header.className = 'team-header';
        header.innerHTML = `
            <div class="team-header-left">
                <div class="team-name"><i data-lucide="users"></i> ${teamName}</div>
                <div class="team-project">Project: ${data.project}</div>
            </div>
            <div class="team-req-count">${data.requests.length} Request(s)</div>
        `;
        card.appendChild(header);

        // Table
        const tableResponsive = document.createElement('div');
        tableResponsive.className = 'table-responsive';
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>REQUEST ID</th>
                    <th>REQUESTED COMPONENTS</th>
                    <th>PURPOSE</th>
                    <th>OVERALL STATUS</th>
                    <th>REQUESTED ON</th>
                    <th>DEADLINE</th>
                    <th style="min-width: 140px;">ACTIONS</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');
        data.requests.forEach(req => {
            const tr = document.createElement('tr');

            const badgesHtml = req.components.map(c => `<span class="comp-badge">${c.name} (${c.qty})</span>`).join('');

            const overallStatus = getOverallStatus(req.components);

            tr.innerHTML = `
                <td style="font-weight:600;">${req.id}</td>
                <td><div class="req-components-cell">${badgesHtml}</div></td>
                <td>${req.purpose}</td>
                <td>${getBadgeHtml(overallStatus)}</td>
                <td>${req.requestedOn}</td>
                <td>${req.deadline}</td>
                <td>
                    <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px; background:var(--sidebar-bg); color:#fff; border:none;" onclick="openModal('${req.id}')">View Components</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tableResponsive.appendChild(table);
        card.appendChild(tableResponsive);
        container.appendChild(card);
    }

    lucide.createIcons();
}

function updateSummaryCards(visibleRequests) {
    let total = visibleRequests.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    visibleRequests.forEach(req => {
        const status = getOverallStatus(req.components);
        if (status === 'Pending') pending++;
        if (status === 'Approved') approved++;
        if (status === 'Rejected') rejected++;
    });

    document.getElementById('statTotalRequests').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statRejected').textContent = rejected;
}

// Modal Logic
window.openModal = function (reqId) {
    currentModalRequestId = reqId;
    const req = requestsData.find(r => r.id === reqId);

    document.getElementById('modalTeamNameSub').textContent = `Manage components for ${req.teamName}`;
    document.getElementById('mReqId').textContent = req.id;
    document.getElementById('mReqTeam').textContent = req.teamName;
    document.getElementById('mReqDate').textContent = req.requestedOn;
    document.getElementById('mReqDeadline').textContent = req.deadline;
    document.getElementById('mReqPurpose').textContent = req.purpose;

    const tbody = document.getElementById('modalComponentsTbody');
    tbody.innerHTML = '';

    req.components.forEach(comp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-cid="${comp.id}" ${comp.status !== 'Pending' ? 'disabled' : ''}></td>
            <td style="font-weight:500;">${comp.name}</td>
            <td>${comp.qty}</td>
            <td>${getBadgeHtml(comp.status)}</td>
        `;
        // Make entire row clickable for checkbox unless disabled
        if (comp.status === 'Pending') {
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const cb = tr.querySelector('input[type="checkbox"]');
                    cb.checked = !cb.checked;
                    updateSelectAllState();
                }
            });
        }
        tbody.appendChild(tr);
    });

    document.getElementById('selectAllCheckbox').checked = false;
    document.getElementById('viewComponentsModal').classList.add('active');

    // Add event listeners tracking row checkboxes to update header checkbox
    document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.addEventListener('change', updateSelectAllState);
    });
};

function closeModal() {
    document.getElementById('viewComponentsModal').classList.remove('active');
    currentModalRequestId = null;
}

function toggleAllCheckboxes() {
    const isChecked = document.getElementById('selectAllCheckbox').checked;
    document.querySelectorAll('.row-checkbox:not([disabled])').forEach(cb => {
        cb.checked = isChecked;
    });
}

function updateSelectAllState() {
    const boxes = Array.from(document.querySelectorAll('.row-checkbox:not([disabled])'));
    if (boxes.length === 0) {
        document.getElementById('selectAllCheckbox').checked = false;
        return;
    }
    const allChecked = boxes.every(cb => cb.checked);
    document.getElementById('selectAllCheckbox').checked = allChecked;
}

function handleBulkAction(newStatus) {
    const boxes = document.querySelectorAll('.row-checkbox:checked:not([disabled])');
    if (boxes.length === 0) return;

    const cIds = Array.from(boxes).map(cb => cb.getAttribute('data-cid'));
    const req = requestsData.find(r => r.id === currentModalRequestId);

    let changed = false;
    req.components.forEach(c => {
        if (cIds.includes(c.id)) {
            c.status = newStatus;
            changed = true;
        }
    });

    if (changed) {
        // Re-render modal to show updated badges and disable checkboxes
        openModal(currentModalRequestId);
        // Refresh the main page table
        renderRequests();
        showToast(`Selected components marked as ${newStatus}!`, 'success');
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.padding = '12px 20px';
    toast.style.background = '#fff';
    toast.style.borderLeft = type === 'success' ? '4px solid var(--success)' : '4px solid var(--danger)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.borderRadius = '4px';
    toast.style.marginBottom = '10px';
    toast.style.fontWeight = '500';
    toast.style.animation = 'slideInRight 0.3s forwards';
    toast.textContent = message;

    const container = document.getElementById('toastContainer');
    if (!container) return; // safeguard
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


