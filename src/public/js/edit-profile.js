document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    const form = document.getElementById('edit-profile-form');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('password-error');
    const currentPasswordInput = document.getElementById('currentPassword');


    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    // Khi click vào tên tệp, mở lại trình chọn tệp
    fileNameDisplay.addEventListener('click', function () {
        fileInput.click();
    });




    form.addEventListener('submit',async function (event) {
        event.preventDefault(); // Ngăn form gửi đi theo cách thông thường
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const currentPassword = currentPasswordInput.value.trim();

        // Kiểm tra độ phức tạp của mật khẩu
        const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(newPassword !== confirmPassword){
            passwordError.style.display = 'block'; // Hiển thị thông báo lỗi
            passwordError.textContent = 'Passwords do not match.';
        
        }else if(!passwordComplexity.test(newPassword)){
            passwordError.style.display = 'block'; // Hiển thị thông báo lỗi
            passwordError.textContent = 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character.';
        } else {
            passwordError.style.display = 'none'; // Ẩn thông báo lỗi
            // Bắt kết quả dạng JSON từ server
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    repeatNewPassword: confirmPassword
                })
            });
            const data = await response.json();
            if (response.ok) {
                // Nếu cập nhật thành công, hiển thị thông báo và chuyển hướng về trang chủ
                showToast('Profile updated successfully', 'Success');
                window.location.href = '/setting/edit-profile';
            } else {
                // Nếu cập nhật thất bại, hiển thị thông báo lỗi
                showToast(data.message, 'error', 'Error');
            }

        }
    });


    // Lấy hash từ URL
    const hash = window.location.hash;

    // Nếu hash tồn tại và trỏ tới một tab hợp lệ, kích hoạt tab đó
    if (hash) {
        const targetTab = document.querySelector(`a[href="${hash}"]`);
        if (targetTab) {
            // Xóa trạng thái "active" hiện tại khỏi tất cả các tab và nội dung
            document.querySelectorAll('.list-group-item').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active', 'show'));

            // Kích hoạt tab và nội dung tương ứng
            targetTab.classList.add('active');
            document.querySelector(hash).classList.add('active', 'show');
        }
    }

    // Lắng nghe sự kiện click để cập nhật URL hash khi người dùng chuyển tab
    document.querySelectorAll('.list-group-item').forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.getAttribute('href');
            if (target) {
                history.pushState(null, null, target); // Cập nhật URL mà không tải lại trang
            }
        });
    });
});
document.getElementById('resend-confirmation-button').addEventListener('click', function() {
    document.getElementById('resend-email-form').submit();
  });
