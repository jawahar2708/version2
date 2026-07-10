/* ==========================================================
   SETTINGS - Page Specific JS
   Tabs, Preferences, Password Form
========================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');

    function showToastSafe(message, type) {
        if (window.showToast) {
            window.showToast(message, type);
        }
    }

    settingsTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            settingsTabs.forEach(function(item) { item.classList.remove('active'); });
            settingsPanels.forEach(function(panel) { panel.classList.remove('active'); });
            this.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    document.querySelectorAll('[data-action="projects"]').forEach(function(button) {
        button.addEventListener('click', function() {
            window.location.href = 'ongoingprojects.html';
        });
    });

    document.querySelectorAll('[data-action="support"]').forEach(function(button) {
        button.addEventListener('click', function() {
            window.location.href = 'supportcenter.html';
        });
    });

    document.querySelectorAll('[data-action="knowledgebase"]').forEach(function(button) {
        button.addEventListener('click', function() {
            window.location.href = 'knowledgebase.html';
        });
    });

    /*document.querySelectorAll('[data-action="logout-other"]').forEach(function(button) {
        button.addEventListener('click', function() {
            showToastSafe('Other sessions signed out.', 'warning');
        });
    });*/

    /*document.querySelectorAll('[data-action="reset-preferences"]').forEach(function(button) {
        button.addEventListener('click', function() {
            showToastSafe('Settings reset to defaults.', 'warning');
        });
    });*/

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fields = this.querySelectorAll('[required]');
            fields.forEach(function(field) {
                field.classList.remove('error-input');
            });
            this.querySelectorAll('.field-error').forEach(function(el) {
                el.remove();
            });

            let isValid = true;
            const passwordInputs = this.querySelectorAll('input[type="password"]');
            const newPassword = passwordInputs[1];
            const confirmPassword = passwordInputs[2];

            fields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'This field is required');
                }
            });

            if (newPassword && newPassword.value.length > 0 && newPassword.value.length < 8) {
                isValid = false;
                showFieldError(newPassword, 'Password must be at least 8 characters');
            }

            if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
                isValid = false;
                showFieldError(confirmPassword, 'Passwords do not match');
            }

            if (!isValid) return;

            showToastSafe('Password updated successfully!', 'success');
            this.reset();
        });
    }

    function showFieldError(field, message) {
        const error = document.createElement('span');
        error.className = 'field-error';
        error.style.cssText = 'color:var(--danger);font-size:12px;margin-top:4px;display:block;';
        error.textContent = message;
        field.parentElement.appendChild(error);
    }
});
