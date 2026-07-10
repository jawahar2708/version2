/* ============================================================
   EDIT TEAM JAVASCRIPT
   Logic for searching, displaying and editing teams
   ============================================================ */

const MOCK_TEAMS = [
    {
        id: 'TEAM-001',
        name: 'Team Alpha',
        leader: 'Arun Kumar',
        members: ['Vikram', 'Priya Sharma', 'Rohan Mehta'],
        techStaff: 'Dr. Arvind Kumar',
        deadline: '2026-07-10',
        createdDate: '2026-01-15',
        status: 'Active'
    },
    {
        id: 'TEAM-002',
        name: 'Team Beta',
        leader: 'Sita Ram',
        members: ['Anjali', 'Kunal', 'Ramesh', 'Divya'],
        techStaff: 'Dr. Suresh Menon',
        deadline: '2026-08-20',
        createdDate: '2026-02-10',
        status: 'Completed'
    },
    {
        id: 'TEAM-003',
        name: 'Team Gamma',
        leader: 'Rahul Sharma',
        members: ['Amit Kumar'],
        techStaff: 'Anita Desai',
        deadline: '2026-09-01',
        createdDate: '2026-03-05',
        status: 'Active'
    }
];

let currentTeams = [...MOCK_TEAMS];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Initialize sidebar logic
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            overlay.classList.remove('active');
        });
    }

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

    initSearch();
    renderTable();
    initEditForm();
});

// Table Rendering & Searching
function initSearch() {
    document.getElementById('teamSearchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const idSearch = document.getElementById('searchTeamId').value.toLowerCase().trim();
        const nameSearch = document.getElementById('searchTeamName').value.toLowerCase().trim();

        currentTeams = MOCK_TEAMS.filter(t => {
            const matchId = t.id.toLowerCase().includes(idSearch);
            const matchName = t.name.toLowerCase().includes(nameSearch);
            if (idSearch && nameSearch) return matchId || matchName;
            if (idSearch) return matchId;
            if (nameSearch) return matchName;
            return true;
        });

        renderTable();
    });

    document.getElementById('resetSearchBtn').addEventListener('click', () => {
        document.getElementById('teamSearchForm').reset();
        currentTeams = [...MOCK_TEAMS];
        renderTable();
    });
}

function renderTable() {
    const tbody = document.getElementById('teamTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (currentTeams.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    currentTeams.forEach(team => {
        const badgeClass = team.status === 'Active' ? 'badge-active' :
            team.status === 'Completed' ? 'badge-completed' : 'badge-hold';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${team.id}</strong></td>
            <td>${team.name}</td>
            <td>${team.leader}</td>
            <td>${team.members.length} members</td>
            <td>${formatDate(team.createdDate)}</td>
            <td><span class="badge ${badgeClass}">${team.status}</span></td>
            <td class="actions-col">
                <div class="action-btn-group">
                    <button class="action-btn edit-btn" title="Edit team" onclick="openEditMode('${team.id}')">
                        <i data-lucide="edit-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function formatDate(ds) {
    const d = new Date(ds);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// Edit Form Logic
let editMemberCount = 0;

function openEditMode(teamId) {
    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (!team) return;

    // Switch views
    document.getElementById('teamListView').classList.add('hidden');
    document.getElementById('editTeamView').classList.remove('hidden');

    // Populate Fields
    document.getElementById('editingTeamNameHeader').textContent = team.name;
    document.getElementById('editItemTeamId').value = team.id;
    document.getElementById('editTeamName').value = team.name;
    document.getElementById('editTeamStatus').value = team.status;
    document.getElementById('editTeamLeader').value = team.leader;
    document.getElementById('editTechStaff').value = team.techStaff;
    document.getElementById('editProjectDeadline').value = team.deadline;

    // Populate Members
    const memContainer = document.getElementById('editMembersContainer');
    memContainer.innerHTML = '';
    editMemberCount = 0;

    if (team.members.length === 0) {
        addEditMemberRow();
    } else {
        team.members.forEach(m => addEditMemberRow(m));
    }

    updateEditMemberSummary();
}

function initEditForm() {
    document.getElementById('backToListBtn').addEventListener('click', closeEditMode);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditMode);

    document.getElementById('editAddMemberBtn').addEventListener('click', () => {
        if (editMemberCount >= 15) {
            showToast('Maximum 15 members allowed', 'warning');
            return;
        }
        addEditMemberRow();
        updateEditMemberSummary();
    });

    document.getElementById('editTeamForm').addEventListener('submit', (e) => {
        e.preventDefault();

        // Find team
        const tid = document.getElementById('editItemTeamId').value;
        const idx = MOCK_TEAMS.findIndex(t => t.id === tid);
        if (idx !== -1) {
            MOCK_TEAMS[idx].name = document.getElementById('editTeamName').value;
            MOCK_TEAMS[idx].status = document.getElementById('editTeamStatus').value;
            MOCK_TEAMS[idx].leader = document.getElementById('editTeamLeader').value;
            MOCK_TEAMS[idx].techStaff = document.getElementById('editTechStaff').value;
            MOCK_TEAMS[idx].deadline = document.getElementById('editProjectDeadline').value;

            // Collect members
            const mems = [];
            document.querySelectorAll('#editMembersContainer .member-input').forEach(inp => {
                if (inp.value.trim()) mems.push(inp.value.trim());
            });
            MOCK_TEAMS[idx].members = mems;

            showToast('Team details updated successfully!', 'success');

            currentTeams = [...MOCK_TEAMS];
            renderTable();
            setTimeout(closeEditMode, 800);
        }
    });
}

function closeEditMode() {
    document.getElementById('editTeamView').classList.add('hidden');
    document.getElementById('teamListView').classList.remove('hidden');
}

function addEditMemberRow(val = '') {
    editMemberCount++;
    const memContainer = document.getElementById('editMembersContainer');
    const row = document.createElement('div');
    row.className = 'member-input-row';
    row.innerHTML = `
        <span class="member-label">Member ${editMemberCount}</span>
        <input type="text" class="member-input" value="${val}" placeholder="Search by name or roll number...">
        <button type="button" class="remove-member-btn" title="Remove member"><i data-lucide="x"></i></button>
    `;

    memContainer.appendChild(row);
    lucide.createIcons();

    row.querySelector('.remove-member-btn').addEventListener('click', () => {
        row.remove();
        editMemberCount--;
        reindexEditMembers();
        updateEditMemberSummary();
    });

    row.querySelector('.member-input').addEventListener('input', updateEditMemberSummary);
}

function reindexEditMembers() {
    const rows = document.querySelectorAll('#editMembersContainer .member-input-row');
    let idx = 1;
    rows.forEach(r => {
        r.querySelector('.member-label').textContent = `Member ${idx}`;
        idx++;
    });
}

function updateEditMemberSummary() {
    let filled = 0;
    document.querySelectorAll('#editMembersContainer .member-input').forEach(inp => {
        if (inp.value.trim() !== '') filled++;
    });
    document.getElementById('editMembersCountText').textContent = `${filled} / 15 members`;
}

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
