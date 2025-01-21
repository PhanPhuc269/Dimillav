const webPush = require('web-push');

// Tạo VAPID Keys
const vapidKeys = webPush.generateVAPIDKeys();
console.log(vapidKeys);
