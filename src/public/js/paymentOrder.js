const btnPay = document.getElementById('btn-pay');
const btnCancel = document.getElementById('btn-cancel');
const qrCodeContainer = document.getElementById('qr-code-container');
const countdownElement = document.getElementById('countdown-timer');
const statusElement = document.getElementById('payment-status');
let timer;

// Gán sự kiện cho nút Cancel Payment trước
btnCancel.addEventListener('click', () => {
    clearInterval(timer);

    // Ẩn mã QR và đếm ngược, hiện nút Proceed to Payment
    qrCodeContainer.style.display = 'none';
    countdownElement.style.display = 'none';
    btnCancel.style.display = 'none';
    btnPay.style.display = 'block';

    // Reset trạng thái thông báo
    statusElement.style.display = 'none';
    statusElement.innerHTML = '';
});

btnPay.addEventListener('click', async (event) => {
    const transactionId = event.target.getAttribute('data-transaction-id');
    console.log('Transaction ID:', transactionId);

    // Xóa thông báo trước đó (nếu có)
    statusElement.style.display = 'none';
    statusElement.innerHTML = '';

    // Hiển thị mã QR và các khu vực liên quan
    qrCodeContainer.style.display = 'block';
    btnPay.style.display = 'none';
    countdownElement.style.display = 'block';
    btnCancel.style.display = 'block';

    // Thiết lập thời gian đếm ngược
    let timeLeft = 5 * 60; // 5 phút
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            statusElement.innerHTML = "<span class='text-danger'>Transaction failed. Please try again!</span>";
            statusElement.style.display = 'block';
            return;
        }
        timeLeft--;

        // Hiển thị thời gian còn lại
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('time-left').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    // Gửi yêu cầu POST để bắt đầu thanh toán
    try {
        const response = await fetch('/transaction/processPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId }),
        });
        const result = await response.json();
        console.log('re',result)
        if (result.message === 'Transaction completed successfully' && result.transaction.transaction.status === 'completed') {
            clearInterval(timer);
            statusElement.innerHTML = "<span class='text-success'>Payment successful! Redirecting...</span>";
            statusElement.style.display = 'block';
            showToast('Your payment was successful!', 'success', 'Payment Completed', 3000);

            // Chuyển hướng sau 2 giây
            setTimeout(() => {
                window.location.href = '/order/list';
            }, 2000);
        }
    } catch (error) {
        showToast('An error occurred during payment. Please try again!', 'error', 'Payment Failed', 3000);

        clearInterval(timer);
        statusElement.innerHTML = "<span class='text-danger'>An error occurred during payment. Please try again!</span>";
        statusElement.style.display = 'block';
    }
});


btnCancel.addEventListener('click', async () => {
    clearInterval(timer);

    // Ẩn mã QR và đếm ngược, hiện nút Proceed to Payment
    qrCodeContainer.style.display = 'none';
    countdownElement.style.display = 'none';
    btnCancel.style.display = 'none';
    btnPay.style.display = 'block';

    // Reset trạng thái thông báo
    statusElement.style.display = 'none';
    statusElement.innerHTML = '';

    // Gửi yêu cầu tới server để hủy giao dịch
    const transactionId = btnPay.getAttribute('data-transaction-id');
    try {
        const response = await fetch('/transaction/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId }),
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Transaction canceled:', result.message);
            statusElement.innerHTML = "<span class='text-danger'>Transaction canceled successfully.</span>";
        } else {
            console.error('Failed to cancel transaction:', result.message);
            statusElement.innerHTML = "<span class='text-danger'>Failed to cancel transaction. Please try again.</span>";
        }
    } catch (error) {
        console.error('Error canceling transaction:', error);
        statusElement.innerHTML = "<span class='text-danger'>An error occurred while canceling. Please try again.</span>";
    }

    statusElement.style.display = 'block';
});
