self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon, // Đường dẫn tới icon
        data: { url: data.url, title: data.title } // Thêm URL và tiêu đề vào dữ liệu thông báo
    });
});
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Đóng thông báo

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === (event.notification.data.url || '/') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url || '/');
            }
        })
    );

    // Xử lý mở modal nếu tiêu đề là "Bạn có tin nhắn mới"
    if (event.notification.data.title === 'Bạn có tin nhắn mới') {
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                client.postMessage({ action: 'openChatModal' });
            }
        });
    }
});
