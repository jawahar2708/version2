/* ============================================================
   CREATE TEAM JAVASCRIPT
   Form logic, dynamic members, and live summary sync
   ============================================================ */

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

    // Form logic initialization
    initCreateTeamForm();
});

function initCreateTeamForm() {
    const maxMembers = 15;
    let memberCount = 1;

    const projectNameInput = document.getElementById('projectName');
    const leaderInput = document.getElementById('teamLeader');
    const membersContainer = document.getElementById('membersContainer');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const techStaffInput = document.getElementById('techStaff');
    const deadlineInput = document.getElementById('projectDeadline');
    const membersCountText = document.getElementById('membersCountText');

    // Summary elements
    const summaryProject = document.getElementById('summaryProject');
    const summaryLeader = document.getElementById('summaryLeader');
    const summaryMembers = document.getElementById('summaryMembers');
    const summaryStaff = document.getElementById('summaryStaff');
    const summaryDeadline = document.getElementById('summaryDeadline');

    // Live Sync inputs to summary
    if (projectNameInput) {
        projectNameInput.addEventListener('input', () => {
            summaryProject.textContent = projectNameInput.value.trim() || 'Not entered';
        });
    }

    leaderInput.addEventListener('input', () => {
        summaryLeader.textContent = leaderInput.value.trim() || 'Not selected';
    });

    techStaffInput.addEventListener('input', () => {
        summaryStaff.textContent = techStaffInput.value.trim() || 'Not selected';
    });

    deadlineInput.addEventListener('change', () => {
        summaryDeadline.textContent = deadlineInput.value || 'Not selected';
    });

    function syncMemberSummary() {
        const inputs = Array.from(membersContainer.querySelectorAll('.member-input'));
        const filled = inputs.filter(inp => inp.value.trim() !== '').length;
        membersCountText.textContent = `${memberCount} / 15 members added`;

        if (filled === 0 && memberCount === 1 && inputs[0].value.trim() === '') {
            summaryMembers.textContent = 'No members added';
        } else {
            summaryMembers.textContent = `${filled} members added`;
        }
    }

    // Attach listeners to initial member input
    membersContainer.querySelectorAll('.member-input').forEach(inp => {
        inp.addEventListener('input', syncMemberSummary);
    });

    // Add member row logic
    addMemberBtn.addEventListener('click', () => {
        if (memberCount >= maxMembers) {
            showToast('Maximum 15 members allowed', 'warning');
            return;
        }

        memberCount++;

        const row = document.createElement('div');
        row.className = 'member-input-row';
        row.dataset.index = memberCount;
        row.innerHTML = `
            <span class="member-label">Member ${memberCount} *</span>
            <input type="text" class="member-input" required placeholder="Search by name or roll number...">
            <button type="button" class="remove-member-btn" title="Remove member"><i data-lucide="x"></i></button>
        `;

        membersContainer.appendChild(row);
        lucide.createIcons();
        syncMemberSummary();

        // Listen for input
        row.querySelector('.member-input').addEventListener('input', syncMemberSummary);

        // Listen for remove
        row.querySelector('.remove-member-btn').addEventListener('click', () => {
            row.remove();
            memberCount--;
            reindexMembers();
            syncMemberSummary();
        });

        // Enable first remove button if > 1 member
        if (memberCount > 1) {
            membersContainer.querySelector('.remove-member-btn').removeAttribute('disabled');
        }
    });

    function reindexMembers() {
        const rows = membersContainer.querySelectorAll('.member-input-row');
        let index = 1;
        rows.forEach(row => {
            row.dataset.index = index;
            row.querySelector('.member-label').textContent = `Member ${index} *`;
            index++;
        });

        // Disable remove on first input if it's the only one
        if (rows.length <= 1) {
            rows[0].querySelector('.remove-member-btn').setAttribute('disabled', 'true');
        }
    }

    // Form submission
    document.getElementById('createTeamForm').addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation happens via HTML5 required attributes

        // Simulate save
        showToast('Team created successfully!', 'success');

        setTimeout(() => {
            // Reset form
            document.getElementById('resetBtn').click();
        }, 1500);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('createTeamForm').reset();

        // Remove extra member rows
        const rows = membersContainer.querySelectorAll('.member-input-row');
        rows.forEach((row, idx) => {
            if (idx > 0) row.remove();
        });
        memberCount = 1;
        membersContainer.querySelector('.remove-member-btn').setAttribute('disabled', 'true');

        // Reset summary
        summaryProject.textContent = 'Not entered';
        summaryLeader.textContent = 'Not selected';
        summaryMembers.textContent = 'No members added';
        summaryStaff.textContent = 'Not selected';
        summaryDeadline.textContent = 'Not selected';
        membersCountText.textContent = '1 / 15 members added';

        showToast('Form reset', 'info');
    });
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
