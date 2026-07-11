document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Database Load & UI Bindings
    // ==========================================
    let db = getDB();
    let user = db.currentUser;

    // Default values if not set
    if (!user.gender) user.gender = "Female";
    if (!user.id) user.id = "LIP-001";
    if (!user.password) user.password = "password";
    if (!user.lastPasswordChange) user.lastPasswordChange = "08 July 2026";

    const updateUIValues = () => {
        // Sidebar profile card elements
        document.getElementById("sidebarAvatar").src = user.avatar;
        document.getElementById("sidebarName").textContent = user.name;
        document.getElementById("sidebarRole").textContent = user.role;
        document.getElementById("sidebarId").textContent = user.id;

        // Meta details elements
        document.getElementById("metaLocation").textContent = user.location || "Main Lab Complex";
        document.getElementById("metaTimezone").textContent = user.timezone || "IST (UTC+5:30)";
        document.getElementById("metaStatus").textContent = user.status || "Online";

        // Personal Information card elements
        document.getElementById("infoName").textContent = user.name;
        document.getElementById("infoEmail").textContent = user.email;
        document.getElementById("infoPhone").textContent = user.phone;
        document.getElementById("infoGender").textContent = user.gender;

        // Security details elements
        document.getElementById("infoLastPasswordChange").textContent = user.lastPasswordChange;
    };

    // Initial load
    updateUIValues();

    // ==========================================
    // 2. Global / Sidebar Navigation Toggle
    // ==========================================
    const menuBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // ==========================================
    // 3. Edit Personal Information Modal
    // ==========================================
    const btnEditProfile = document.getElementById('btnEditProfile');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');

    const openEditProfileModal = () => {
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone;
        document.getElementById('editGender').value = user.gender;
        editProfileModal.classList.add('active');
    };

    const closeEditProfileModal = () => {
        editProfileModal.classList.remove('active');
        editProfileForm.reset();
    };

    if (btnEditProfile) btnEditProfile.addEventListener('click', openEditProfileModal);
    if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeEditProfileModal);
    if (cancelEditProfileBtn) cancelEditProfileBtn.addEventListener('click', closeEditProfileModal);

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newName = document.getElementById('editName').value.trim();
            const newEmail = document.getElementById('editEmail').value.trim();
            const newPhone = document.getElementById('editPhone').value.trim();
            const newGender = document.getElementById('editGender').value;

            if (!newName || !newEmail || !newPhone) {
                showToast("All fields are required.", "error");
                return;
            }

            // Save to Local DB
            user.name = newName;
            user.email = newEmail;
            user.phone = newPhone;
            user.gender = newGender;

            db.currentUser = user;
            setDB(db);

            // Update UI elements
            updateUIValues();
            renderBaseLayout("profile");

            // Close modal & Toast
            closeEditProfileModal();
            showToast("Profile settings updated successfully!", "success");
        });
    }

    // ==========================================
    // 4. Change Password Modal & Validation
    // ==========================================
    const btnChangePassword = document.getElementById('btnChangePassword');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closePwdModalBtn = document.getElementById('closePwdModalBtn');
    const cancelPwdBtn = document.getElementById('cancelPwdBtn');
    const changePwdForm = document.getElementById('changePwdForm');

    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Open Change Password Modal
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => {
            changePasswordModal.classList.add('active');
        });
    }

    // Function to Close Modal, Reset Form, and Clear Errors
    const closePwdModal = () => {
        changePasswordModal.classList.remove('active');
        if (changePwdForm) changePwdForm.reset();

        // Clear any existing error messages
        document.querySelectorAll('.error-text').forEach(el => el.remove());

        // Reset eye icons to default
        document.querySelectorAll('.toggle-pwd').forEach(icon => {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            const input = icon.previousElementSibling;
            if (input) input.type = 'password';
        });
    };

    if (closePwdModalBtn) closePwdModalBtn.addEventListener('click', closePwdModal);
    if (cancelPwdBtn) cancelPwdBtn.addEventListener('click', closePwdModal);

    // Form submit validation & persistence
    if (changePwdForm) {
        changePwdForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.error-text').forEach(el => el.remove());

            const pwdInputs = changePwdForm.querySelectorAll('input[type="password"], input[type="text"]');
            const currentPwdInput = pwdInputs[0];
            const newPwdInput = pwdInputs[1];
            const confirmPwdInput = pwdInputs[2];

            const currentPwd = currentPwdInput.value.trim();
            const newPwd = newPwdInput.value.trim();
            const confirmString = confirmPwdInput.value.trim();
            let isValid = true;

            // Helper function to display errors dynamically
            const showError = (inputElement, message) => {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-text';
                errorSpan.style.color = '#DC2626'; // Red color
                errorSpan.style.fontSize = '12px';
                errorSpan.style.marginTop = '6px';
                errorSpan.style.display = 'block';
                errorSpan.innerText = message;

                // Append right below the input wrapper
                inputElement.closest('.form-group').appendChild(errorSpan);
                isValid = false;
            };

            // Rule 1: Check for empty fields
            if (!currentPwd) showError(currentPwdInput, 'Current password is required.');
            if (!newPwd) showError(newPwdInput, 'New password is required.');
            if (!confirmString) showError(confirmPwdInput, 'Please confirm your new password.');

            if (!isValid) return;

            // Verify current password match
            // The default password is user.password (which is "password" if not changed)
            if (currentPwd !== user.password) {
                showError(currentPwdInput, 'Incorrect current password.');
                return;
            }

            // Rule 2: Password complexity (Min 8 chars, 1 uppercase, 1 lowercase, 1 number)
            const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
            if (!pwdRegex.test(newPwd)) {
                showError(newPwdInput, 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number.');
                return;
            }

            // Rule 3: Check if new passwords match
            if (newPwd !== confirmString) {
                showError(confirmPwdInput, 'Passwords do not match.');
                return;
            }

            // Rule 4: Ensure new password is not the same as the current password
            if (newPwd === currentPwd) {
                showError(newPwdInput, 'New password cannot be the same as the current password.');
                return;
            }

            // Persistence: Change password in Local Db
            user.password = newPwd;

            // Format today's date (e.g. "09 July 2026")
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const today = new Date();
            user.lastPasswordChange = today.toLocaleDateString('en-GB', options);

            db.currentUser = user;
            setDB(db);

            // Update UI settings
            updateUIValues();

            // Close modal & show success dialog
            closePwdModal();
            successModal.classList.add('active');
            showToast("Password updated successfully!", "success");
        });
    }

    // Close Success Modal
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // ==========================================
    // 5. Password Visibility Toggle (Eye Icon)
    // ==========================================
    const toggleIcons = document.querySelectorAll('.toggle-pwd');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;

            if (input && input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else if (input) {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // ==========================================
    // 6. Profile Picture Upload Preview & Storage
    // ==========================================
    const photoUpload = document.getElementById('photoUpload');
    const sidebarAvatar = document.getElementById('sidebarAvatar');

    if (photoUpload && sidebarAvatar) {
        photoUpload.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    const avatarDataUrl = event.target.result;

                    // Check if file is small enough to fit in localStorage (typically limit is 5MB overall)
                    // If file is too large, we can warn the user or compress it in future, but for small profile images base64 is perfect!
                    sidebarAvatar.src = avatarDataUrl;

                    // Save to local storage database
                    user.avatar = avatarDataUrl;
                    db.currentUser = user;
                    setDB(db);

                    // Sync base layout (avatar initials)
                    renderBaseLayout("profile");

                    showToast("Profile picture updated successfully!", "success");
                }

                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});
