document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    const signupForm = document.querySelector('.auth-form');
    const errorMessage = document.getElementById('signupError');
    const successMessage = document.getElementById('signupSuccess');
    const isCompanyAdminCheckbox = document.getElementById('is_company_admin');
    const companyField = document.getElementById('companyField');
    const submitButton = signupForm?.querySelector('button[type="submit"]');

    if (!signupForm) {
        console.log('Signup form not found');
        return;
    }

    console.log('Signup form found, setting up event listeners');

    if (isCompanyAdminCheckbox && companyField) {
        const toggleCompanyField = () => {
            const showField = isCompanyAdminCheckbox.checked;
            companyField.style.display = showField ? 'block' : 'none';
            document.getElementById('company-name').required = showField;
        };

        isCompanyAdminCheckbox.addEventListener('change', toggleCompanyField);
        toggleCompanyField(); 
    }

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submission prevented');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Creating Account...';
        }

        let responseHandled = false;
        try {
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const isCompanyAdmin = isCompanyAdminCheckbox?.checked;
            const companyName = document.getElementById('company-name')?.value.trim() || '';

            console.log('Validating inputs:', { username, email, password, confirmPassword, isCompanyAdmin, companyName });

            if (!username || !email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            if (!/[A-Z]/.test(password)) {
                throw new Error('Password must contain at least one uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                throw new Error('Password must contain at least one lowercase letter');
            }
            if (!/[0-9]/.test(password)) {
                throw new Error('Password must contain at least one digit');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (isCompanyAdmin && !companyName) {
                throw new Error('Company name is required for admin accounts');
            }

            const formData = new FormData(signupForm);
            const csrfToken = getCookie('csrftoken');

            for (let [key, value] of formData.entries()) {
                console.log(`FormData entry: ${key}=${value}`);
            }

            if (!csrfToken) {
                throw new Error('Security token missing. Please refresh the page.');
            }

            console.log('Sending fetch request');
            const response = await fetch(signupForm.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                },
                body: formData
            });

            console.log('Response received, status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Unexpected response: ${text}`);
            }

            const data = await response.json();
            console.log('Parsed response data:', data);
            responseHandled = true;

            if (data.success === true && data.redirect_url) {
                console.log('Success response, displaying success message');
                displayTemporarySuccess('Account created successfully');
                setTimeout(() => {
                    console.log('Redirecting to:', data.redirect_url);
                    window.location.href = data.redirect_url;
                }, 3000); 
            } else {
                console.log('Server returned error, throwing:', data.error || 'Signup failed');
                throw new Error(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.log('Error caught:', error.message);
            displayTemporaryError(error.message);
            
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            }
        } finally {
            if (!responseHandled && submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
                console.log('Response not handled, resetting form button');
            }
        }
    });

    function displayTemporaryError(message) {
        console.log('Displaying error message:', message);
        if (!errorMessage) {
            console.log('Error message element not found');
            return;
        }
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
            console.log('Error message hidden');
        }, 5000); 
    }

    function displayTemporarySuccess(message) {
        console.log('Displaying success message:', message);
        if (!successMessage) {
            console.log('Success message element not found');
            return;
        }
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.textContent = '';
            console.log('Success message hidden');
        }, 3000); 
    }

    function getCookie(name) {
        const cookieString = document.cookie;
        if (!cookieString) return null;
        
        const cookies = cookieString.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }
});