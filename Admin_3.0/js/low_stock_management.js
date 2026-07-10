/**
 * Low Stock Management Module
 * Frontend-only mock data implementation
 */

// Mock Data
let requestsData = [
    {
        id: "LSR-001",
        component: "IR Proximity Sensor",
        category: "Sensors â€¢ Electronics Lab",
        quantity: 44,
        available: 0,
        lab: "Embedded Lab",
        raisedBy: "Dr. Priya Sharma",
        facultyId: "FAC-001",
        date: "10 Jul 2026",
        priority: "Critical",
        status: "Pending",
        notes: "Urgent replacement required for student projects"
    },
    {
        id: "LSR-002",
        component: "Linear Rod 8mm (300mm)",
        category: "Mechanical â€¢ Mechanical Lab",
        quantity: 42,
        available: 2,
        lab: "Mechanical Lab",
        raisedBy: "Dr. Aravind Kumar",
        facultyId: "FAC-002",
        date: "09 Jul 2026",
        priority: "Critical",
        status: "Pending",
        notes: "Vendor preference: Robu.in or local electronics hardware shop."
    },
    {
        id: "LSR-003",
        component: "Timing Belt GT2 (1m)",
        category: "Mechanical â€¢ Fabrication Lab",
        quantity: 95,
        available: 1,
        lab: "Manufacturing Lab",
        raisedBy: "Dr. Aravind Kumar",
        facultyId: "FAC-002",
        date: "09 Jul 2026",
        priority: "Medium",
        status: "Received",
        notes: "Needed for 3D printer maintenance."
    },
    {
        id: "LSR-004",
        component: "Arduino Uno R3",
        category: "Microcontrollers â€¢ Embedded Lab",
        quantity: 20,
        available: 5,
        lab: "Embedded Lab",
        raisedBy: "Dr. Meena R",
        facultyId: "FAC-003",
        date: "08 Jul 2026",
        priority: "High",
        status: "Resolved",
        notes: "Restocking for the upcoming embedded systems workshop."
    },
    {
        id: "LSR-005",
        component: "Raspberry Pi 4 Model B",
        category: "Microcomputers â€¢ AI Lab",
        quantity: 15,
        available: 0,
        lab: "AI Lab",
        raisedBy: "Dr. Karthik S",
        facultyId: "FAC-004",
        date: "11 Jul 2026",
        priority: "Critical",
        status: "Pending",
        notes: "Immediate requirement for deep learning edge deployment."
    },
    {
        id: "LSR-006",
        component: "Laser Cutter Lens (Focal length 50.8mm)",
        category: "Optics â€¢ Fabrication Lab",
        quantity: 2,
        available: 0,
        lab: "Fabrication Lab",
        raisedBy: "Dr. Lakshmi N",
        facultyId: "FAC-005",
        date: "05 Jul 2026",
        priority: "Critical",
        status: "Received",
        notes: "Current lens is cracked, preventing all acrylic cutting."
    },
    {
        id: "LSR-007",
        component: "NEMA 17 Stepper Motor",
        category: "Actuators â€¢ Mechanical Lab",
        quantity: 25,
        available: 4,
        lab: "Mechanical Lab",
        raisedBy: "Dr. Aravind Kumar",
        facultyId: "FAC-002",
        date: "10 Jul 2026",
        priority: "Medium",
        status: "Pending",
        notes: ""
    },
    {
        id: "LSR-008",
        component: "ESP32 Development Board",
        category: "Microcontrollers â€¢ IoT Lab",
        quantity: 50,
        available: 10,
        lab: "IoT Lab",
        raisedBy: "Dr. Priya Sharma",
        facultyId: "FAC-001",
        date: "12 Jul 2026",
        priority: "High",
        status: "Pending",
        notes: "Mandatory for the new IoT curriculum starting next month."
    },
    {
        id: "LSR-009",
        component: "Jumper Wires (M-M, M-F, F-F)",
        category: "Consumables â€¢ Electronics Lab",
        quantity: 500,
        available: 50,
        lab: "Embedded Lab",
        raisedBy: "Dr. Meena R",
        facultyId: "FAC-003",
        date: "07 Jul 2026",
        priority: "Low",
        status: "Resolved",
        notes: "Bulk order for general lab usage."
    },
    {
        id: "LSR-010",
        component: "Filament PLA (1KG, White)",
        category: "Consumables â€¢ Fabrication Lab",
        quantity: 10,
        available: 2,
        lab: "Fabrication Lab",
        raisedBy: "Dr. Lakshmi N",
        facultyId: "FAC-005",
        date: "11 Jul 2026",
        priority: "High",
        status: "Pending",
        notes: "Printing queues are backed up due to filament shortage."
    }
];

let currentModalRequestId = null;
let actionToConfirm = null; // 'Received' or 'Resolved'

// DOM Elements & Initialization
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

function initApp() {
    renderTable();

    // Filters
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('teamFilter') ? document.getElementById('teamFilter').addEventListener('change', renderTable) : null;
    document.getElementById('statusFilter').addEventListener('change', renderTable);
    document.getElementById('labFilter').addEventListener('change', renderTable);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Modal Events
    document.getElementById('closeRequestModal').addEventListener('click', closeReqModal);
    document.getElementById('modalBtnClose').addEventListener('click', closeReqModal);
    document.getElementById('modalBtnAction').addEventListener('click', handleModalActionClick);

    // Confirmation Modal Events
    document.getElementById('closeConfirmModal').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmBtnCancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmBtnYes').addEventListener('click', executeStatusChange);

    // Setup Top Navigation Interactions
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

function getBadgeHtml(status) {
    if (status === 'Received') return '<span class="badge badge-blue">Received</span>';
    if (status === 'Resolved') return '<span class="badge badge-green">Resolved</span>';
    return '<span class="badge badge-orange">Pending</span>'; // Pending defaults to orange
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('labFilter').value = 'All';
    document.getElementById('statusFilter').value = 'All';
    renderTable();
}

function renderTable() {
    const searchStr = document.getElementById('searchInput').value.toLowerCase();
    const labFilter = document.getElementById('labFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filtered = requestsData.filter(req => {
        const matchSearch = req.id.toLowerCase().includes(searchStr) ||
            req.component.toLowerCase().includes(searchStr) ||
            req.lab.toLowerCase().includes(searchStr) ||
            req.raisedBy.toLowerCase().includes(searchStr);
        const matchLab = labFilter === 'All' || req.lab === labFilter;
        const matchStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchSearch && matchLab && matchStatus;
    });

    updateSummaryCards(filtered);

    const tbody = document.getElementById('lowStockTbody');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 24px;">No requests found matching your filters.</td></tr>`;
        return;
    }

    filtered.forEach((req, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight:600;">${req.id}</td>
            <td style="font-weight:500; color:var(--text-primary);">${req.component}</td>
            <td style="text-align:right;">${req.quantity}</td>
            <td style="text-align:right;">${req.available}</td>
            <td>${req.lab}</td>
            <td>${req.raisedBy}</td>
            <td>${req.date}</td>
            <td>${getBadgeHtml(req.status)}</td>
            <td style="text-align:center;">
                <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px; border:none; background:rgba(79,70,229,0.1); color:var(--primary);" onclick="openViewModal('${req.id}')">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function updateSummaryCards(visibleRequests) {
    let pending = 0;
    let received = 0;
    let resolved = 0;

    requestsData.forEach(req => { // Summaries usually reflect total data, not just filtered. But user said "automatically update when status change"
        if (req.status === 'Pending') pending++;
        if (req.status === 'Received') received++;
        if (req.status === 'Resolved') resolved++;
    });

    document.getElementById('statTotal').textContent = requestsData.length;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statReceived').textContent = received;
    document.getElementById('statResolved').textContent = resolved;
}

// Modal Logic
window.openViewModal = function (reqId) {
    currentModalRequestId = reqId;
    const req = requestsData.find(r => r.id === reqId);

    document.getElementById('mReqId').textContent = req.id;
    document.getElementById('mRaisedBy').textContent = req.raisedBy;
    document.getElementById('mFacultyId').textContent = req.facultyId;
    document.getElementById('mLab').textContent = req.lab;
    document.getElementById('mRaisedDate').textContent = req.date;
    document.getElementById('mStatus').innerHTML = getBadgeHtml(req.status);

    // Build components list (to match screenshot style)
    const container = document.getElementById('modalComponentsContainer');
    container.innerHTML = `
        <div class="procurement-card">
            <div class="pc-info">
                <h4>${req.component}</h4>
                <p>${req.category} â€¢ Available ${req.available} pcs</p>
            </div>
            <div class="pc-qty">
                <div class="pc-qty-box">
                    <span class="val">${req.quantity}</span>
                    <span class="lbl">Order qty</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('mNotes').textContent = req.notes || "No additional notes provided.";

    // Action button states
    const actionBtn = document.getElementById('modalBtnAction');
    actionBtn.style.display = 'inline-block';
    actionBtn.className = 'btn btn-primary';

    if (req.status === 'Pending') {
        actionBtn.textContent = 'Received';
        actionBtn.className = 'btn btn-received';
        actionBtn.style.backgroundColor = '#3b82f6'; // Match received badge color
    } else if (req.status === 'Received') {
        actionBtn.textContent = 'Resolved';
        actionBtn.className = 'btn btn-resolved';
        actionBtn.style.backgroundColor = '#22c55e'; // Match resolved badge color
    } else {
        actionBtn.style.display = 'none'; // No actions needed for resolved
    }

    document.getElementById('viewRequestModal').classList.add('active');
};

function closeReqModal() {
    document.getElementById('viewRequestModal').classList.remove('active');
    currentModalRequestId = null;
}

function handleModalActionClick() {
    const req = requestsData.find(r => r.id === currentModalRequestId);

    if (req.status === 'Pending') {
        actionToConfirm = 'Received';
    } else if (req.status === 'Received') {
        actionToConfirm = 'Resolved';
    }

    document.getElementById('confirmMessage').textContent = `Mark this request as ${actionToConfirm}?`;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    actionToConfirm = null;
}

function executeStatusChange() {
    if (!currentModalRequestId || !actionToConfirm) return;

    const req = requestsData.find(r => r.id === currentModalRequestId);
    req.status = actionToConfirm;

    closeConfirmModal();
    closeReqModal();
    renderTable(); // This updates table, badges, and dashboard summary cards

    showToast(`Request ${req.id} marked as ${actionToConfirm}!`);
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
    toast.style.zIndex = '9999';

    const container = document.getElementById('toastContainer');
    if (!container) return;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

