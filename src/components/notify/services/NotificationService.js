const webPush = require('@config/webPushConfig');
const redisClient = require('@config/redisClient');

class NotificationService {

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
    
        const sendPromises = subscriptionArray.map(subscription => 
            webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
        );

        await Promise.all(sendPromises);    }
}

module.exports = new NotificationService();




