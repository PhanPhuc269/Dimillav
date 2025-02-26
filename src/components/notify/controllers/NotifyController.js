const { mutipleMongooseToObject } = require('@utils/mongoose');
const redisClient = require('@config/redisClient');
const notificationService = require('../services/NotificationService')
const {sendNotification} = require('@/notification');


class NotifyController {
    async subscribe(req, res, next) {
        try {
                
            const subscription = req.body;

            // Lưu subscription vào database redis
            const userId = req.user._id;
            // Lấy mảng subscription hiện tại từ Redis
            let subscriptions = await redisClient.get(`subscriptions:${userId}`);
            subscriptions = subscriptions ? JSON.parse(subscriptions) : [];

            //Kiểm tra nếu trùng thì không thêm
            const existingSubscription = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
            if (existingSubscription) {
                // res.status(200).json({});
            }
            else{
                // Thêm subscription mới vào mảng
                subscriptions.push(subscription);
                // Lưu mảng subscription đã cập nhật trở lại Redis
                await redisClient.set(`subscriptions:${userId}`, JSON.stringify(subscriptions));
                res.status(201).json({});
            }
                


            const notificationPayload = {
                title: 'New Notification',
                body: 'This is a test notification',
                icon: '/img/logo.png',
            };
            //Gửi thông báo thử 
            //await notificationService.sendNotification(userId, notificationPayload);
            //await sendNotification('client_notifications', notificationPayload);
            res.status(200).json({});
        } catch (error) {
            console.error('Error in subscribe:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

    async sendNotification(req, res, next) {
        const { notification } = req.body;
        const userId = req.user._id;
        const subscription = await getAsync(`subscription:${userId}`);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const notificationPayload = {
            notification: {
                title: notification.title || 'New Notification',
                body: notification.body || 'This is a test notification',
                icon: notification.icon || 'assets/icons/icon-512x512.png',
            },
        };

        try {
            await webPush.sendNotification(JSON.parse(subscription), JSON.stringify(notificationPayload));
            res.status(200).json({ message: 'Notification sent successfully.' });
        } catch (err) {
            console.error('Error sending notification, reason: ', err);
            res.sendStatus(500);
        }
    }
}

module.exports = new NotifyController();