document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login_form');
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');
    const errorDisplay = document.getElementById('error_display');

    // Lấy URL từ query string (returnTo)
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo') || '/'; // Mặc định là '/'

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn form gửi đi theo cách thông thường

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Kiểm tra xem email và password có được nhập không
        if (!email || !password) {
            errorDisplay.textContent = 'Please fill in all fields.';
            return;
        }
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ email, password, returnTo }) // Gửi thêm returnTo
            });
            if (response.ok) {
                const responseData = await response.json(); // Lấy URL chuyển hướng từ server
                window.location.href = responseData.redirectTo;
            } else {
                const message = await response.json();
                errorDisplay.textContent = message.message;
            }
        } catch (error) {
            console.error('Error:', error);
            errorDisplay.textContent = error.message;
        }
    });
});
