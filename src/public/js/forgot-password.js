document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const verifyCodeForm = document.getElementById('verify-code-form');
    const messageDiv = document.getElementById('message');
    const loadingDiv = document.getElementById('loading');
    const resendCodeBtn = document.getElementById('resend-code-btn');

    forgotPasswordForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        loadingDiv.style.display = 'block';
        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        loadingDiv.style.display = 'none';
        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = result.message;
            forgotPasswordForm.style.display = 'none';
            verifyCodeForm.style.display = 'block';
        } else {
            messageDiv.textContent = result.message || 'An error occurred';
        }
    });

    verifyCodeForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const verificationCode = document.getElementById('verificationCode').value;
        const email = document.getElementById('email').value;
        const response = await fetch('/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, verificationCode })
        });
        const result = await response.json();
        if (response.ok) {
            window.location.href = `/reset-password/${result.token}`;
        } else {
            messageDiv.textContent = result.message || 'An error occurred';
        }
    });
    resendCodeBtn.addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        loadingDiv.style.display = 'block';
        messageDiv.style.display = 'none';
        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        loadingDiv.style.display = 'none';
        messageDiv.style.display = 'block';
        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = 'Verification code resent. Please check your email.';
        } else {
            messageDiv.textContent = result.message || 'An error occurred';
        }
    });
});