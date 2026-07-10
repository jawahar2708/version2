/* ============================================================
   ILP RAPID PROTOTYPING LAB - DASHBOARD JAVASCRIPT
   Dashboard-only logic, data, and interactivity
   ============================================================ */

/* ------------------------------------------------------------
   STORAGE KEY - localStorage key for dashboard data
   ------------------------------------------------------------ */
const STORAGE_KEY = 'ilp_dashboard_v3';

/* ------------------------------------------------------------
   PROJECT STATUS COLORS - Donut chart segment colors
   ------------------------------------------------------------ */
const STATUS_COLORS = {
  'Not Started': '#3b82f6',
  'In Progress': '#60a5fa',
  'Under Review': '#f59e0b',
  'Completed': '#22c55e'
};

/* ------------------------------------------------------------
   DEFAULT DATA - Seed data for dashboard widgets
   ------------------------------------------------------------ */
const DEFAULT_DATA = {
  admin: {
    name: 'Admin Name',
    role: 'Administrator',
    employeeId: 'ADM-001',
    email: 'admin@ilp.com',
    phone: '9876543210',
    department: 'Rapid Prototyping Lab',
    joinedOn: 'January 2026'
  },
  isLoggedIn: true,
  students: [
    { id: 'STU-001', name: 'Rahul Sharma', team: 'Team Alpha' },
    { id: 'STU-002', name: 'Priya Patel', team: 'Team Beta' },
    { id: 'STU-003', name: 'Amit Kumar', team: 'Team Gamma' }
  ],
  staff: [
    { id: 'STF-001', name: 'Dr. Suresh Menon', role: 'Technical Mentor' },
    { id: 'STF-002', name: 'Anita Desai', role: 'Lab Engineer' },
    { id: 'STF-003', name: 'Vikram Singh', role: 'Project Supervisor' }
  ],
  teams: [
    { id: 'TEAM-001', name: 'Team Alpha', project: 'Smart IoT Sensor', members: 4 },
    { id: 'TEAM-002', name: 'Team Beta', project: 'Robotic Arm Controller', members: 3 },
    { id: 'TEAM-003', name: 'Team Gamma', project: '3D Printing Optimizer', members: 5 }
  ],
  projects: [
    { id: 'PRJ-001', name: 'Design Phase (Stage 3) Submission', team: 'Team Alpha', deadline: '2026-05-20', status: 'In Progress' },
    { id: 'PRJ-002', name: 'Product Development (Stage 4)', team: 'Team Beta', deadline: '2026-07-15', status: 'Not Started' },
    { id: 'PRJ-003', name: 'Testing & Validation (Stage 5)', team: 'Team Gamma', deadline: '2026-07-29', status: 'Under Review' },
    { id: 'PRJ-004', name: 'Prototype Assembly', team: 'Team Alpha', deadline: '2026-04-15', status: 'Completed' },
    { id: 'PRJ-005', name: 'Research Documentation', team: 'Team Beta', deadline: '2026-08-20', status: 'In Progress' }
  ],
  notifications: [
    { id: 1, message: 'New deadline approaching for Team Alpha', time: '2 hours ago', read: false, type: 'deadline' },
    { id: 2, message: 'Ticket requires attention', time: '5 hours ago', read: false, type: 'ticket' },
    { id: 3, message: 'Team Beta submitted Stage 4 report', time: '1 day ago', read: false, type: 'project' }
  ]
};

/* In-memory application state */
let appData = {};

/* ------------------------------------------------------------
   DOM READY - Initialize dashboard on page load
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  lucide.createIcons();

  checkAuthState();
  initSidebar();
  initHeader();
  initModals();
  initLogin();
  initDashboardActions();

  renderDashboard();
  renderProfileModal();
  renderNotifications();
  updateNotificationBadge();
});

/* ============================================================
   DATA MANAGEMENT
   ============================================================ */

/** Load data from localStorage or use defaults */
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appData = { ...DEFAULT_DATA, ...JSON.parse(saved) };
    } catch (e) {
      appData = { ...DEFAULT_DATA };
    }
  } else {
    appData = { ...DEFAULT_DATA };
    saveData();
  }
}

/** Save current data to localStorage */
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

/* ============================================================
   AUTHENTICATION - Login / sign out
   ============================================================ */

/** Show login screen or dashboard based on auth state */
function checkAuthState() {
  const loginScreen = document.getElementById('loginScreen');
  const appWrapper = document.getElementById('appWrapper');

  if (appData.isLoggedIn) {
    loginScreen.classList.add('hidden');
    appWrapper.style.display = 'flex';
  } else {
    loginScreen.classList.remove('hidden');
    appWrapper.style.display = 'none';
  }
}

/** Handle login form submission */
function initLogin() {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email === 'admin@ilp.com' && password === 'admin123') {
      appData.isLoggedIn = true;
      saveData();
      checkAuthState();
      showToast('Welcome back!', 'success');
    } else {
      showToast('Invalid email or password', 'error');
    }
  });
}

/** Sign out and show login screen */
function signOut() {
  appData.isLoggedIn = false;
  saveData();
  closeModal('signOutModal');
  checkAuthState();
  showToast('You have been signed out', 'success');
}

/* ============================================================
   SIDEBAR - Mobile toggle
   ============================================================ */

function initSidebar() {
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('active');
  });

  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

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

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

/* ============================================================
   HEADER - Notifications and profile
   ============================================================ */

function initHeader() {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');

  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    notificationDropdown.classList.remove('active');
  });

  notificationDropdown.addEventListener('click', (e) => e.stopPropagation());

  document.getElementById('markAllReadBtn').addEventListener('click', () => {
    appData.notifications.forEach(n => { n.read = true; });
    saveData();
    renderNotifications();
    updateNotificationBadge();
    showToast('All notifications marked as read', 'success');
  });

  document.getElementById('profileBtn').addEventListener('click', () => {
    openModal('profileModal');
  });
}

/* ============================================================
   MODALS - Profile and sign out
   ============================================================ */

function initModals() {
  document.getElementById('closeProfileModal').addEventListener('click', () => closeModal('profileModal'));
  document.getElementById('closeProfileBtn').addEventListener('click', () => closeModal('profileModal'));

  document.getElementById('editProfileBtn').addEventListener('click', () => {
    closeModal('profileModal');
    openEditProfileModal();
  });

  document.getElementById('closeEditProfileModal').addEventListener('click', () => closeModal('editProfileModal'));
  document.getElementById('cancelEditProfile').addEventListener('click', () => closeModal('editProfileModal'));
  document.getElementById('saveEditProfile').addEventListener('click', saveProfile);

  document.getElementById('signOutBtn').addEventListener('click', () => openModal('signOutModal'));
  document.getElementById('closeSignOutModal').addEventListener('click', () => closeModal('signOutModal'));
  document.getElementById('cancelSignOut').addEventListener('click', () => closeModal('signOutModal'));
  document.getElementById('confirmSignOut').addEventListener('click', signOut);

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  lucide.createIcons();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function openEditProfileModal() {
  const admin = appData.admin;
  document.getElementById('editName').value = admin.name;
  document.getElementById('editEmail').value = admin.email;
  document.getElementById('editPhone').value = admin.phone;
  document.getElementById('editDepartment').value = admin.department;
  openModal('editProfileModal');
}

function saveProfile() {
  appData.admin.name = document.getElementById('editName').value;
  appData.admin.email = document.getElementById('editEmail').value;
  appData.admin.phone = document.getElementById('editPhone').value;
  appData.admin.department = document.getElementById('editDepartment').value;
  saveData();
  closeModal('editProfileModal');
  updateHeaderProfile();
  renderProfileModal();
  showToast('Profile updated successfully', 'success');
}

/* ============================================================
   DASHBOARD ACTIONS - Quick actions and view-all buttons
   ============================================================ */

function initDashboardActions() {
  document.getElementById('viewAllProjectsBtn').addEventListener('click', () => {
    showToast('Projects page will be added in the full application', 'warning');
  });

  document.getElementById('viewAllDeadlinesBtn').addEventListener('click', () => {
    showToast('Showing all upcoming deadlines on dashboard', 'success');
    renderDeadlines(true);
  });

    document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === "Add New Trainee" || action === "Add Faculty") {
        window.location.href = "add_profiles.html";
      } else if (action === "Create New Team") {
        window.location.href = "create_team.html";
      } else if (action === "View Faculty List") {
        window.location.href = "faculty.html";
      } else if (action === "View Trainee List") {
        window.location.href = "trainee.html";
      } else {
        showToast(`${action} — available in full application`, 'warning');
      }
    });
  });
}

/* ============================================================
   DASHBOARD RENDERING
   ============================================================ */

function renderDashboard() {
  updateHeaderProfile();

  document.getElementById('statTeams').textContent = appData.teams.length;
  document.getElementById('statStudents').textContent = appData.students.length;
  document.getElementById('statCompleted').textContent =
    appData.projects.filter(p => p.status === 'Completed').length;
  document.getElementById('statStaff').textContent = appData.staff.length;

  renderDonutChart();
  renderDeadlines();
}

function updateHeaderProfile() {
  const admin = appData.admin;
  document.getElementById('headerUserName').textContent = admin.name;
  document.getElementById('headerUserRole').textContent = admin.role;
  document.getElementById('welcomeName').textContent = admin.name;
}

function renderProfileModal() {
  const admin = appData.admin;
  document.getElementById('modalUserName').textContent = admin.name;
  document.getElementById('modalUserRole').textContent = admin.role;
  document.getElementById('modalEmployeeId').textContent = admin.employeeId;
  document.getElementById('modalEmail').textContent = admin.email;
  document.getElementById('modalPhone').textContent = admin.phone;
  document.getElementById('modalDepartment').textContent = admin.department;
  document.getElementById('modalJoined').textContent = admin.joinedOn;
}

/** Build interactive SVG donut chart with hover tooltips */
function renderDonutChart() {
  const statuses = ['Not Started', 'In Progress', 'Under Review', 'Completed'];
  const statusCounts = {};
  appData.projects.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });

  const total = appData.projects.length;
  document.getElementById('donutTotal').textContent = total;

  const svg = document.getElementById('donutSvg');
  const tooltip = document.getElementById('chartTooltip');
  const radius = 70;
  const strokeWidth = 28;
  const center = 90;
  const circumference = 2 * Math.PI * radius;
  const gap = 4;

  svg.innerHTML = '';
  let accumulated = 0;

  statuses.forEach(status => {
    const count = statusCounts[status] || 0;
    if (count === 0) return;

    const segmentLength = (count / total) * circumference;
    const visibleLength = Math.max(segmentLength - gap, 1);
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', center);
    circle.setAttribute('cy', center);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', STATUS_COLORS[status]);
    circle.setAttribute('stroke-width', strokeWidth);
    circle.setAttribute('stroke-dasharray', `${visibleLength} ${circumference - visibleLength}`);
    circle.setAttribute('stroke-dashoffset', String(-accumulated));
    circle.setAttribute('class', 'donut-segment');
    circle.setAttribute('data-status', status);

    circle.addEventListener('mouseenter', () => {
      highlightChartSegment(status, `${status}: ${count} (${pct}%)`);
    });
    circle.addEventListener('mouseleave', clearChartHighlight);

    svg.appendChild(circle);
    accumulated += segmentLength;
  });

  const legend = document.getElementById('chartLegend');
  legend.innerHTML = statuses.map(status => {
    const count = statusCounts[status] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `
      <li data-status="${status}">
        <span class="legend-dot" style="background: ${STATUS_COLORS[status]}"></span>
        <span>${status}</span>
        <span class="legend-count">${count} (${pct}%)</span>
      </li>
    `;
  }).join('');

  legend.querySelectorAll('li').forEach(item => {
    const status = item.dataset.status;
    const count = statusCounts[status] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    item.addEventListener('mouseenter', () => {
      highlightChartSegment(status, `${status}: ${count} (${pct}%)`);
    });
    item.addEventListener('mouseleave', clearChartHighlight);
  });
}

/** Highlight a chart segment and show tooltip on hover */
function highlightChartSegment(status, text) {
  const tooltip = document.getElementById('chartTooltip');
  tooltip.textContent = text;
  tooltip.classList.add('visible');

  document.querySelectorAll('.donut-segment').forEach(seg => {
    seg.classList.toggle('active', seg.dataset.status === status);
    seg.classList.toggle('dimmed', seg.dataset.status !== status);
  });

  document.querySelectorAll('.chart-legend li').forEach(item => {
    item.classList.toggle('active', item.dataset.status === status);
  });
}

/** Reset chart hover highlight state */
function clearChartHighlight() {
  document.getElementById('chartTooltip').classList.remove('visible');
  document.querySelectorAll('.donut-segment').forEach(seg => {
    seg.classList.remove('active', 'dimmed');
  });
  document.querySelectorAll('.chart-legend li').forEach(item => {
    item.classList.remove('active');
  });
}

/**
 * Returns badge class and label based on days remaining.
 * @param {number} daysLeft - Days until deadline (negative = overdue)
 */
function getDeadlineBadge(daysLeft) {
  if (daysLeft < 0) {
    return { className: 'overdue', label: `${Math.abs(daysLeft)} Days Overdue` };
  }
  if (daysLeft === 0) {
    return { className: 'critical', label: 'Due Today' };
  }
  if (daysLeft <= 7) {
    return { className: 'critical', label: `${daysLeft} Days Left` };
  }
  if (daysLeft <= 14) {
    return { className: 'urgent', label: `${daysLeft} Days Left` };
  }
  if (daysLeft <= 19) {
    return { className: 'warning', label: `${daysLeft} Days Left` };
  }
  return { className: 'safe', label: `${daysLeft} Days Left` };
}

/**
 * Render upcoming deadline list.
 * @param {boolean} showAll - If true, show all non-completed projects
 */
function renderDeadlines(showAll = false) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = [...appData.projects]
    .filter(p => p.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const items = showAll ? sorted : sorted.slice(0, 3);
  const list = document.getElementById('deadlineList');

  if (items.length === 0) {
    list.innerHTML = '<li class="empty-state">No upcoming deadlines</li>';
    return;
  }

  list.innerHTML = items.map(project => {
    const deadline = new Date(project.deadline);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    const month = deadline.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = deadline.getDate();
    const badge = getDeadlineBadge(daysLeft);

    return `
      <li class="deadline-item">
        <div class="deadline-date">
          <span class="deadline-month">${month}</span>
          <span class="deadline-day">${day}</span>
        </div>
        <div class="deadline-info">
          <p class="deadline-title">${project.name}</p>
          <p class="deadline-team">${project.team}</p>
        </div>
        <span class="deadline-badge ${badge.className}">${badge.label}</span>
      </li>
    `;
  }).join('');
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */

function renderNotifications() {
  const list = document.getElementById('notificationList');
  const iconColors = {
    deadline: { bg: '#fef2f2', color: '#ef4444' },
    ticket: { bg: '#fffbeb', color: '#f59e0b' },
    project: { bg: '#dbeafe', color: '#3b82f6' }
  };

  list.innerHTML = appData.notifications.map(n => {
    const ic = iconColors[n.type] || iconColors.project;
    return `
      <li class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        <div class="notification-icon" style="background: ${ic.bg}; color: ${ic.color}">
          <i data-lucide="bell"></i>
        </div>
        <div class="notification-content">
          <p>${n.message}</p>
          <span>${n.time}</span>
        </div>
      </li>
    `;
  }).join('');

  list.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id, 10);
      const notif = appData.notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        saveData();
        renderNotifications();
        updateNotificationBadge();
      }
    });
  });

  lucide.createIcons();
}

function updateNotificationBadge() {
  const unread = appData.notifications.filter(n => !n.read).length;
  const badge = document.getElementById('notificationBadge');
  badge.textContent = unread;
  badge.classList.toggle('hidden', unread === 0);
}

/* ============================================================
   TOAST MESSAGES
   ============================================================ */

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle' };
  toast.innerHTML = `
    <i data-lucide="${icons[type] || 'info'}"></i>
    <p>${message}</p>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

