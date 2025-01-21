function showToast(message, type = 'info', title = 'Notification', delay = 3000) {
    // Tạo container nếu chưa có
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
  
    // Tạo Toast mới
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast custom-toast ${type}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${delay}">
        <div class="toast-header">
          <div class="icon-wrapper">
            ${getIcon(type)}
          </div>
          <div class="content">
            <strong class="toast-title">${title}</strong>
            <small class="toast-subtitle">${message}</small>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"><span class="fa fa-times"></span></button>
        </div>
      </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
    // Hiển thị Toast
    const newToast = document.getElementById(toastId);
    const toastInstance = new bootstrap.Toast(newToast);
    toastInstance.show();
  
    // Xóa Toast khi ẩn (tự động hoặc khi người dùng nhấn nút "Close")
    newToast.addEventListener('hidden.bs.toast', () => {
      newToast.remove();
    });
  
    // Xóa Toast khi nhấn nút "Close"
    const closeButton = newToast.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
      toastInstance.hide(); // Ẩn toast
    });
  }
  
  // Hàm lấy Icon theo loại thông báo
  function getIcon(type) {
    const icons = {
      success: '<span class="icon">✔</span>',
      error: '<span class="icon">✖</span>',
      info: '<span class="icon">ℹ</span>',
      warning: '<span class="icon">⚠</span>',
    };
    return icons[type] || '<span class="icon">ℹ</span>';
  }
  