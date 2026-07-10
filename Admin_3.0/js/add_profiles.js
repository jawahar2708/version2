/* ============================================================
   ILP RAPID PROTOTYPING LAB - ADD PROFILES JAVASCRIPT
   Form controls, tab toggles, live preview sync, and notifications
   ============================================================ */

const STORAGE_KEY = 'ilp_dashboard_v3';

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
  faculty: [
    { id: 'FAC-001', name: 'Dr. Ramesh R', role: 'Professor', gender: 'Male', email: 'ramesh@ilp.com' }
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

let appData = {};
let activeTab = 'trainee';

/* ============================================================
   DOM INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  lucide.createIcons();

  checkAuthState();
  initSidebar();
  initHeader();
  initModals();
  initLogin();

  initTabs();
  initExcelActions();
  initFormInputs();
  initFormSubmit();

  updateHeaderProfile();
  renderNotifications();
  updateNotificationBadge();
  configureRequiredFields();
  syncPreviewPanel();
});

/* ============================================================
   DATA
   ============================================================ */
function loadData() {
  if (window.__RPL_DB__) {
    appData = { ...DEFAULT_DATA, students: window.__RPL_DB__.trainees, staff: window.__RPL_DB__.faculty, faculty: window.__RPL_DB__.faculty };
  } else {
    appData = { ...DEFAULT_DATA };
  }
}

function saveData() {
  // Static mockup: normally we save to localStorage, here we just keep it in memory
}

/* ============================================================
   AUTH
   ============================================================ */
function checkAuthState() {
  const loginScreen = document.getElementById('loginScreen');
  const appWrapper = document.getElementById('appWrapper');
  if (appData.isLoggedIn) {
    if (loginScreen) loginScreen.classList.add('hidden');
    if (appWrapper) appWrapper.style.display = 'flex';
  } else {
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (appWrapper) appWrapper.style.display = 'none';
  }
}

function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (email === 'admin@ilp.com' && password === 'admin123') {
      appData.isLoggedIn = true;
      saveData();
      checkAuthState();
      showToast('Welcome back!', 'success');
      updateHeaderProfile();
      renderNotifications();
      updateNotificationBadge();
    } else {
      showToast('Invalid email or password', 'error');
    }
  });
}

function signOut() {
  appData.isLoggedIn = false;
  saveData();
  closeModal('signOutModal');
  checkAuthState();
  showToast('You have been signed out', 'success');
}

/* ============================================================
   SIDEBAR & HEADER
   ============================================================ */
function initSidebar() {
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
}

function initHeader() {
  const notifBtn = document.getElementById('notificationBtn');
  const notifDrop = document.getElementById('notificationDropdown');
  if (notifBtn && notifDrop) {
    notifBtn.addEventListener('click', (e) => { e.stopPropagation(); notifDrop.classList.toggle('active'); });
    document.addEventListener('click', () => notifDrop.classList.remove('active'));
    notifDrop.addEventListener('click', (e) => e.stopPropagation());
  }
  const markAll = document.getElementById('markAllReadBtn');
  if (markAll) {
    markAll.addEventListener('click', () => {
      appData.notifications.forEach(n => { n.read = true; });
      saveData(); renderNotifications(); updateNotificationBadge();
      showToast('All notifications marked as read', 'success');
    });
  }
  const profBtn = document.getElementById('profileBtn');
  if (profBtn) profBtn.addEventListener('click', () => openModal('profileModal'));
}

function updateHeaderProfile() {
  const a = appData.admin;
  const n = document.getElementById('headerUserName');
  const r = document.getElementById('headerUserRole');
  if (n) n.textContent = a.name;
  if (r) r.textContent = a.role;
}

function renderNotifications() {
  const list = document.getElementById('notificationList');
  if (!list) return;
  const colors = {
    deadline: { bg: '#fef2f2', color: '#ef4444' },
    ticket: { bg: '#fffbeb', color: '#f59e0b' },
    project: { bg: '#dbeafe', color: '#3b82f6' }
  };
  list.innerHTML = appData.notifications.map(n => {
    const ic = colors[n.type] || colors.project;
    return `<li class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
      <div class="notification-icon" style="background:${ic.bg};color:${ic.color}"><i data-lucide="bell"></i></div>
      <div class="notification-content"><p>${n.message}</p><span>${n.time}</span></div>
    </li>`;
  }).join('');
  list.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const notif = appData.notifications.find(n => n.id === parseInt(item.dataset.id, 10));
      if (notif) { notif.read = true; saveData(); renderNotifications(); updateNotificationBadge(); }
    });
  });
  lucide.createIcons();
}

function updateNotificationBadge() {
  const unread = appData.notifications.filter(n => !n.read).length;
  const badge = document.getElementById('notificationBadge');
  if (badge) { badge.textContent = unread; badge.classList.toggle('hidden', unread === 0); }
}

/* ============================================================
   MODALS
   ============================================================ */
function initModals() {
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  bind('closeProfileModal', () => closeModal('profileModal'));
  bind('closeProfileBtn', () => closeModal('profileModal'));
  bind('editProfileBtn', () => { closeModal('profileModal'); openEditProfileModal(); });
  bind('closeEditProfileModal', () => closeModal('editProfileModal'));
  bind('cancelEditProfile', () => closeModal('editProfileModal'));
  bind('saveEditProfile', saveProfile);
  bind('signOutBtn', () => openModal('signOutModal'));
  bind('closeSignOutModal', () => closeModal('signOutModal'));
  bind('cancelSignOut', () => closeModal('signOutModal'));
  bind('confirmSignOut', signOut);

  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', (e) => { if (e.target === ov) closeModal(ov.id); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
  });
}

function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add('active'); lucide.createIcons(); } }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); }

function openEditProfileModal() {
  const a = appData.admin;
  document.getElementById('editName').value = a.name;
  document.getElementById('editEmail').value = a.email;
  document.getElementById('editPhone').value = a.phone;
  document.getElementById('editDepartment').value = a.department;
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
  showToast('Profile updated successfully', 'success');
}

/* ============================================================
   TABS
   ============================================================ */
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      const target = document.getElementById(`${activeTab}Form`);
      if (target) target.classList.add('active');
      clearErrors();
      configureRequiredFields();
      syncPreviewPanel();
    });
  });
}

function configureRequiredFields() {
  const containers = ['trainee', 'faculty', 'seniorFaculty'];
  const optionalIds = ['traineeId', 'facultyId', 'seniorFacultyId'];
  containers.forEach(type => {
    const container = document.getElementById(`${type}Form`);
    if (!container) return;
    container.querySelectorAll('input, select').forEach(input => {
      if (type === activeTab) {
        if (optionalIds.includes(input.id)) input.removeAttribute('required');
        else input.setAttribute('required', 'true');
      } else {
        input.removeAttribute('required');
      }
    });
  });
}

/* ============================================================
   EXCEL ACTIONS
   ============================================================ */
function initExcelActions() {
  const fileInput = document.getElementById('excelFileInput');

  document.querySelectorAll('.excel-upload-btn').forEach(btn => {
    btn.addEventListener('click', () => fileInput.click());
  });

  document.querySelectorAll('.excel-download-btn').forEach(btn => {
    btn.addEventListener('click', () => showToast('Downloading Excel template...', 'success'));
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        showToast(`Uploading ${file.name}...`, 'info');
        setTimeout(() => { showToast('Successfully uploaded 15 profiles!', 'success'); fileInput.value = ''; }, 1500);
      }
    });
  }
}

/* ============================================================
   REAL-TIME INPUT & PREVIEW SYNC
   ============================================================ */
function initFormInputs() {
  const fields = [
    // Trainee (order: ID, Name, Email, Phone, DOB, Gender, Role)
    'traineeId', 'traineeName', 'traineeEmail', 'traineePhone', 'traineeDob', 'traineeGender', 'traineeRole',
    // Faculty (no Department)
    'facultyId', 'facultyName', 'facultyEmail', 'facultyPhone', 'facultyDob', 'facultyGender', 'facultyDesignation',
    // Senior Faculty
    'seniorFacultyId', 'seniorFacultyName', 'seniorFacultyEmail', 'seniorFacultyPhone', 'seniorFacultyDob', 'seniorFacultyGender', 'seniorFacultyDesignation'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => { syncPreviewPanel(); validateField(el); });
      el.addEventListener('change', () => { syncPreviewPanel(); validateField(el); });
      el.addEventListener('blur', () => validateField(el));
    }
  });

  // Password visibility toggles
  document.querySelectorAll('.pwd-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i data-lucide="eye-off"></i>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<i data-lucide="eye"></i>';
      }
      lucide.createIcons();
    });
  });
}

/* Field-level validation */
function validateField(el) {
  const errSpan = document.getElementById(`${el.id}Error`);
  if (!errSpan) return true;

  let valid = true, msg = '';
  const val = el.value.trim();

  if (el.hasAttribute('required') && !val) {
    valid = false; msg = 'This field is required';
  } else if (val) {
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      valid = false; msg = 'Please enter a valid email address';
    } else if (el.type === 'tel' && !/^[6-9]\d{9}$/.test(val)) {
      valid = false; msg = 'Enter a valid 10-digit mobile number';
    } else if (el.id.includes('Name') && !/^[a-zA-Z\s.]{2,50}$/.test(val)) {
      valid = false; msg = 'Name should contain only letters, spaces, or dots';
    }
  }

  el.classList.toggle('error', !valid);
  errSpan.textContent = msg;
  errSpan.style.display = valid ? 'none' : 'block';
  return valid;
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(s => { s.textContent = ''; s.style.display = 'none'; });
  document.querySelectorAll('input.error, select.error').forEach(el => el.classList.remove('error'));
}

/* Preview panel sync */
function syncPreviewPanel() {
  const pName = document.getElementById('previewName');
  const pEmail = document.getElementById('previewEmail');
  const pPhone = document.getElementById('previewPhone');
  const pDob = document.getElementById('previewDob');

  const pF1Lbl = document.getElementById('previewField1Label');
  const pF1Val = document.getElementById('previewField1Value');
  const pF2Lbl = document.getElementById('previewField2Label');
  const pF2Val = document.getElementById('previewField2Value');
  const pF3Lbl = document.getElementById('previewField3Label');
  const pF3Val = document.getElementById('previewField3Value');

  if (!pName) return;

  const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };

  if (activeTab === 'trainee') {
    pName.textContent = getVal('traineeName') || '-';
    pEmail.textContent = getVal('traineeEmail') || '-';
    pPhone.textContent = getVal('traineePhone') || '-';
    pDob.textContent = formatDate(getVal('traineeDob')) || '-';
    pF3Lbl.textContent = 'Gender';
    pF3Val.textContent = getVal('traineeGender') || '-';
    pF1Lbl.textContent = 'Role';
    pF1Val.textContent = getVal('traineeRole') || '-';
    pF2Lbl.textContent = 'Trainee ID';
    pF2Val.textContent = getVal('traineeId') || '-';
  }
  else if (activeTab === 'faculty') {
    pName.textContent = getVal('facultyName') || '-';
    pEmail.textContent = getVal('facultyEmail') || '-';
    pPhone.textContent = getVal('facultyPhone') || '-';
    pDob.textContent = formatDate(getVal('facultyDob')) || '-';
    pF3Lbl.textContent = 'Gender';
    pF3Val.textContent = getVal('facultyGender') || '-';
    pF1Lbl.textContent = 'Role';
    pF1Val.textContent = getVal('facultyDesignation') || '-';
    pF2Lbl.textContent = 'Faculty ID';
    pF2Val.textContent = getVal('facultyId') || '-';
  }
  else if (activeTab === 'seniorFaculty') {
    pName.textContent = getVal('seniorFacultyName') || '-';
    pEmail.textContent = getVal('seniorFacultyEmail') || '-';
    pPhone.textContent = getVal('seniorFacultyPhone') || '-';
    pDob.textContent = formatDate(getVal('seniorFacultyDob')) || '-';
    pF3Lbl.textContent = 'Gender';
    pF3Val.textContent = getVal('seniorFacultyGender') || '-';
    pF1Lbl.textContent = 'Role';
    pF1Val.textContent = getVal('seniorFacultyDesignation') || '-';
    pF2Lbl.textContent = 'Employee ID';
    pF2Val.textContent = getVal('seniorFacultyId') || '-';
  }
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ============================================================
   SUBMIT & REGISTRATION
   ============================================================ */
function initFormSubmit() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields in active form
    const container = document.getElementById(`${activeTab}Form`);
    let valid = true;
    container.querySelectorAll('input, select').forEach(input => {
      if (!validateField(input)) valid = false;
    });
    if (!valid) {
      showToast('Please correct errors before saving', 'error');
      const first = container.querySelector('.error');
      if (first) first.focus();
      return;
    }

    // Password match check
    const pwd = document.getElementById(`${activeTab}Password`);
    const cpwd = document.getElementById(`${activeTab}ConfirmPassword`);
    if (pwd && cpwd && pwd.value !== cpwd.value) {
      showToast('Passwords do not match', 'error');
      cpwd.classList.add('error');
      const err = document.getElementById(`${activeTab}ConfirmPasswordError`);
      if (err) { err.textContent = 'Passwords do not match'; err.style.display = 'block'; }
      cpwd.focus();
      return;
    }

    // Register
    if (activeTab === 'trainee') {
      const name = document.getElementById('traineeName').value.trim();
      const id = document.getElementById('traineeId').value.trim() || `TRN-00${window.__RPL_DB__.trainees.length + 1}`;
      window.__RPL_DB__.trainees.push({
        id, name, email: document.getElementById('traineeEmail').value.trim(),
        phone: document.getElementById('traineePhone').value,
        dob: document.getElementById('traineeDob').value,
        gender: document.getElementById('traineeGender').value,
        role: 'Trainee', status: 'Active', college: '-', batch: '-', qualification: '-', address: '-'
      });
      showToast(`Trainee profile for ${name} registered!`, 'success');
    }
    else if (activeTab === 'faculty') {
      const name = document.getElementById('facultyName').value.trim();
      const id = document.getElementById('facultyId').value.trim() || `FAC-00${window.__RPL_DB__.faculty.length + 1}`;
      window.__RPL_DB__.faculty.push({
        id, name, role: document.getElementById('facultyDesignation').value,
        email: document.getElementById('facultyEmail').value.trim(),
        phone: document.getElementById('facultyPhone').value,
        gender: document.getElementById('facultyGender').value,
        dob: document.getElementById('facultyDob').value,
        status: 'Active', qualification: '-', experience: '-', specialization: '-', joiningDate: '-', address: '-'
      });
      showToast(`Faculty profile for ${name} registered!`, 'success');
    }
    else if (activeTab === 'seniorFaculty') {
      const name = document.getElementById('seniorFacultyName').value.trim();
      const id = document.getElementById('seniorFacultyId').value.trim() || `SFAC-00${window.__RPL_DB__.faculty.length + 1}`;
      window.__RPL_DB__.faculty.push({
        id, name, role: document.getElementById('seniorFacultyDesignation').value,
        gender: document.getElementById('seniorFacultyGender').value,
        email: document.getElementById('seniorFacultyEmail').value.trim(),
        phone: document.getElementById('seniorFacultyPhone').value,
        dob: document.getElementById('seniorFacultyDob').value,
        status: 'Active', qualification: '-', experience: '-', specialization: '-', joiningDate: '-', address: '-'
      });
      showToast(`Senior Faculty profile for ${name} registered!`, 'success');
    }

    saveData();
    form.reset();

    // Restore default passwords
    const defaults = { trainee: 'trainee123', faculty: 'faculty123', seniorFaculty: 'faculty123' };
    Object.keys(defaults).forEach(prefix => {
      const p = document.getElementById(`${prefix}Password`);
      const c = document.getElementById(`${prefix}ConfirmPassword`);
      if (p) p.value = defaults[prefix];
      if (c) c.value = defaults[prefix];
    });

    clearErrors();
    syncPreviewPanel();
  });
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
