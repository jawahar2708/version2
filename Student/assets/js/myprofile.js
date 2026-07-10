document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Global / Sidebar Navigation Logic
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ==========================================
    // 2. Change Password Modal & Validation Logic
    // ==========================================
    const btnChangePassword = document.getElementById('btnChangePassword');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closePwdModalBtn = document.getElementById('closePwdModalBtn');
    const cancelPwdBtn = document.getElementById('cancelPwdBtn');
    const updatePwdBtn = document.getElementById('updatePwdBtn');
    
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Get input fields based on their position in the form
    const pwdInputs = document.querySelectorAll('#changePwdForm input');
    const currentPwdInput = pwdInputs[0];
    const newPwdInput = pwdInputs[1];
    const confirmPwdInput = pwdInputs[2];

    // Open Change Password Modal
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => {
            changePasswordModal.classList.add('active');
        });
    }

    // Function to Close Modal, Reset Form, and Clear Errors
    const closePwdModal = () => {
        changePasswordModal.classList.remove('active');
        
        // Reset form
        const form = document.getElementById('changePwdForm');
        if (form) form.reset();
        
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

    // ==========================================
    // 3. Validation and Submit
    // ==========================================
    if (updatePwdBtn) {
        updatePwdBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Clear previous errors
            document.querySelectorAll('.error-text').forEach(el => el.remove());

            const currentPwd = currentPwdInput.value.trim();
            const newPwd = newPwdInput.value.trim();
            const confirmPwd = confirmPwdInput.value.trim();
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
            if (!confirmPwd) showError(confirmPwdInput, 'Please confirm your new password.');

            if (!isValid) return; // Stop here if empty fields

            // Rule 2: Password complexity (Min 8 chars, 1 uppercase, 1 lowercase, 1 number)
            const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
            if (!pwdRegex.test(newPwd)) {
                showError(newPwdInput, 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number.');
                return;
            }

            // Rule 3: Check if new passwords match
            if (newPwd !== confirmPwd) {
                showError(confirmPwdInput, 'Passwords do not match.');
                return;
            }

            // Rule 4: Ensure new password is not the same as the current password
            if (newPwd === currentPwd) {
                showError(newPwdInput, 'New password cannot be the same as the current password.');
                return;
            }

            // If it passes all validation, show success!
            closePwdModal();
            successModal.classList.add('active');
        });
    }

    // Close Success Modal
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // ==========================================
    // 4. Password Visibility Toggle (Eye Icon)
    // ==========================================
    const toggleIcons = document.querySelectorAll('.toggle-pwd');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
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
    // 5. Profile Picture Upload Preview
    // ==========================================
    const photoUpload = document.getElementById('photoUpload');
    const avatarImg = document.querySelector('.avatar-img');

    if (photoUpload && avatarImg) {
        photoUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    avatarImg.src = event.target.result;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});
