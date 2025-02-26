
// Ví dụ: tự động cuộn đến cuối phần tin nhắn khi gửi tin mới
const chatModal = document.getElementById('chatModal');
const formChat = document.getElementById('chat-form');
const messages = document.querySelector('#chatModal .messages');
const socket = io();
let username;
let receiverName;

// Hàm để lấy giá trị của cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
document.addEventListener('DOMContentLoaded', function () {
    socket.emit('load-messages', receiverName);
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.action === 'openChatModal') {
            $('#chatModal').modal('show'); // Mở modal bằng Bootstrap
        }
        console.log('Message from service worker:', event.data);
    });
});
// Đăng ký username khi kết nối
socket.on('register', (data) => {
    username = data.username;
});
chatModal.addEventListener('shown.bs.modal', function () {
    socket.emit('load-messages', receiverName);
    // var recent = new bootstrap.Tab(document.getElementById('recent-messages'));
    // recent.show();
});
socket.on('recent-messages', (messagesList) => {
    const recentMessages = chatModal.querySelector('.notice');
    recentMessages.innerHTML = ''; // Clear existing messages

    messagesList.forEach((message) => {
        const newMessage = document.createElement('button');
        newMessage.className = 'my-2 p-2 text-black rounded list-group-item list-group-item-action';
        newMessage.setAttribute('data-id', message.receiverName);

        const titleElement = document.createElement('h6');
        titleElement.textContent = message.title;
        newMessage.appendChild(titleElement);

        const messageElement = document.createElement('span');
        messageElement.textContent = message.message;
        newMessage.appendChild(messageElement);

        const timestampElement = document.createElement('div');
        timestampElement.className = 'text-muted small';
        timestampElement.textContent = new Date(message.timestamp).toLocaleString();
        newMessage.appendChild(timestampElement);

        recentMessages.appendChild(newMessage);
    });
});

// chatModal.addEventListener('shown.bs.modal', function () {
//     const messages = chatModal.querySelector('.messages');
//     messages.scrollTop = messages.scrollHeight;
//     socket.emit('load-messages', receiverName);
// });
// Nhận và hiển thị tin nhắn cũ
socket.on('load old messages', (messagesList) => {
    messages.innerHTML = ``;
    messagesList.forEach((message) => {
        if(message.sender == 'Bạn'){
            const newMessage = document.createElement('div');
            newMessage.className = 'message w-auto small p-2 mb-1 text-white rounded-3 bg-primary d-block position-relative end-0';
            newMessage.textContent = message.message;
            messages.appendChild(newMessage);
        }
        else{
            const newMessage = document.createElement('div');
            newMessage.className = 'response small p-2 mb-1 rounded-3 bg-body-tertiary';
            newMessage.textContent = message.message;
            messages.appendChild(newMessage);
        }
    });
    messages.scrollTop = messages.scrollHeight;
});
// Thêm tin nhắn khi người dùng nhập tin nhắn và nhấn Enter
const chatInput = document.querySelector('#chatModal .modal-body input');
chatInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const messageText = chatInput.value.trim();
        if (messageText) {
            const messageData = {
                sender: username,  // Bạn có thể thay đổi hoặc lấy từ thông tin người dùng đăng nhập
                receiver: 'Admin',//(username !='66c88776614bf1e4ccfca969')? '66c88776614bf1e4ccfca969': '66caf87123950ddd71daaeab',  // Nhận từ input hoặc logic phía server
                message: messageText,
            };
            socket.emit('chat message', messageData);
            const newMessage = document.createElement('div');
            newMessage.className = 'message small p-2 mb-1 text-white rounded-3 bg-primary position-relative float-end';
            newMessage.textContent = messageText;
            
            messages.appendChild(newMessage);
            chatInput.value = '';
            messages.scrollTop = messages.scrollHeight;
        }

    }
});

// Nhận và hiển thị tin nhắn
socket.on('chat message', (data) => {
    // Ứng dụng có được đang sử dụng là tab hiện tại không
    if (document.hidden) {
        // Hiển thị thông báo
        const notification = new Notification("Bạn có tin nhắn mới", {
            body: 'Admin: ' + data.message,
            icon: '/img/logo.png',
        });
        notification.onclick = function () {
            // Mở thẻ ứng dụng khi người dùng nhấn vào thông báo
            window.focus();
            $('#chatModal').modal('show'); // Mở modal bằng Bootstrap
        };
    }
    //Kiểm tra modal có đang mở không
    if (!chatModal.classList.contains('show')) {
        showToast(`${data.message}`, 'info', `${data.sender}`);
    }

    const newMessage = document.createElement('div');
    newMessage.className = 'response small p-2 mb-1 rounded-3 bg-body-tertiary';
    newMessage.textContent = `${data.message}`;
    messages.appendChild(newMessage);
    messages.scrollTop = messages.scrollHeight;
});
// Gọi sự kiện logout khi người dùng truy cập vào endpoint /logout
document.getElementById('logoutButton').addEventListener('click', () => {
    socket.emit('disconnect');
});


