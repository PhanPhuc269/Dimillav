const webPush = require('@config/webPushConfig');
const redisClient = require('@config/redisClient');
const AccountService = require('@components/auth/services/AccountService');

class NotificationService {

    async sendNotificationByUsername(username, notification) {
        const user = await AccountService.getAccountByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        const subscriptions = await redisClient.get(`subscriptions:${user._id}`);
        if (!subscriptions) {
            throw new Error('Subscriptions not found');
        }

        const subscriptionArray = JSON.parse(subscriptions);


        const notificationPayload = {
            title: notification.title || 'New Notification',
            body: notification.body || 'This is a test notification',
            icon: notification.icon || '/js/logo.png',
        };
    
        const sendPromises = subscriptionArray.map(subscription => {
            return webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
                .catch(error => {
                    console.error(`Failed to send notification to subscription ${subscription.endpoint}:`, error);
                    // Xóa ra khỏi database nếu gặp lỗi
                    subscriptionArray.splice(subscriptionArray.indexOf(subscription), 1);
                    redisClient.set(`subscriptions:${user._id}`, JSON.stringify(subscriptionArray));
                    
                    return Promise.resolve(); // Return a resolved promise to avoid interruption
                });
        });
        
        await Promise.all(sendPromises); // Wait for all notifications to be sent
  
    }
    async sendNotification(userId, notification) {
        const subscriptions = await redisClient.get(`subscriptions:${userId}`);
        if (!subscriptions) {
            throw new Error('Subscriptions not found');
        }

        const subscriptionArray = JSON.parse(subscriptions);


        const notificationPayload = {
            title: notification.title || 'New Notification',
            body: notification.body || 'This is a test notification',
            icon: notification.icon || '/js/logo.png',
        };
    
        const sendPromises = subscriptionArray.map(subscription => {
            return webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
                .catch(error => {
                    console.error(`Failed to send notification to subscription ${subscription.endpoint}:`, error);
                    // Xóa ra khỏi database nếu gặp lỗi
                    subscriptionArray.splice(subscriptionArray.indexOf(subscription), 1);
                    redisClient.set(`subscriptions:${userId}`, JSON.stringify(subscriptionArray));
                    
                    return Promise.resolve(); // Return a resolved promise to avoid interruption
                });
        });
        
        await Promise.all(sendPromises); // Wait for all notifications to be sent
  
    }
}

module.exports = new NotificationService();




