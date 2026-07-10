/* ============================================================
   PROJECT DETAILS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initApp();
});

function initApp() {
    // Sidebar dropdown
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

    // Mobile sidebar
    document.getElementById('hamburgerBtn').addEventListener('click', () => {
        document.getElementById('sidebar').style.transform = 'translateX(0)';
        document.getElementById('sidebarOverlay').classList.add('active');
    });

    document.getElementById('sidebarOverlay').addEventListener('click', () => {
        document.getElementById('sidebar').style.transform = '';
        document.getElementById('sidebarOverlay').classList.remove('active');
    });

    document.getElementById('closeTeamModal').addEventListener('click', () => {
        document.getElementById('teamModal').classList.remove('active');
    });

    document.getElementById('closeTeamBtn').addEventListener('click', () => {
        document.getElementById('teamModal').classList.remove('active');
    });

    renderStages();
    updateDonutChart(40);
}

function openTeamModal() {
    document.getElementById('teamModal').classList.add('active');
}

function renderStages() {
    const stages = [
        "Problem Statement",
        "Ideation & Context",
        "Design Phase",
        "Product Dev",
        "Testing & Valid",
        "Iteration",
        "Adv Prototype",
        "Evaluation",
        "Documentation",
        "Deployment"
    ];

    const currentStageIndex = 2; // "Design Phase" (0-indexed, so 2) is active, previous are completed

    const container = document.getElementById('stagesContainer');
    
    // Draw the nodes
    let html = '';
    stages.forEach((st, idx) => {
        let stateClass = '';
        if (idx < currentStageIndex) stateClass = 'completed';
        else if (idx === currentStageIndex) stateClass = 'active';

        const iconOrNum = idx < currentStageIndex ? `<i data-lucide="check"></i>` : (idx + 1);

        html += `
            <div class="step-node ${stateClass}">
                <div class="step-circle">${iconOrNum}</div>
                <div class="step-label">${st}</div>
            </div>
        `;
    });

    // Calculate fill percentage for line
    const fillPercent = (currentStageIndex / (stages.length - 1)) * 100;
    
    // Add lines
    html += `
        <div class="stepper-line"></div>
        <div class="stepper-line-fill" style="width: calc(${fillPercent}% - 40px);"></div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
}

function updateDonutChart(percent) {
    const radius = 64; // from SVG
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    const fillCircle = document.getElementById('donutFill');
    fillCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    fillCircle.style.strokeDashoffset = offset;
}
