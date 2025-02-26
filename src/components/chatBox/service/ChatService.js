const Message = require('../models/Message'); // Đảm bảo bạn đã định nghĩa model Message
const User = require('@components/auth/models/User'); // Đảm bảo bạn đã định nghĩa model User
const AccountService = require('@components/auth/services/AccountService');
const redisClient = require('@config/redisClient');
const Messnotification = require('../models/Messnotification');
const { sendNotification } = require('@/notification');

class ChatService {
    static async registerUser(socket, userId, username) {
        socket.emit('register', { username: username });
        await redisClient.set(`socket:${userId}`, socket.id); // Lưu socket.id vào Redis    
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
    }

    static async loadMessages(socket, userId, receiverID) {
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId}
            ]
        }).sort({ createdAt: 1 });

        const formattedMessages = messages.map(message => ({
            sender: message.sender == userId ? 'Bạn' : 'Admin',
            message: message.message,
            timestamp: message.createdAt,
        }));

        // Gửi tin nhắn cũ đến người dùng
        socket.emit('load old messages', formattedMessages);
    }

    static async loadRecentMessages(socket, userId) {
        try {
            let additionalNotices = [];
            const friends = await User.find({
                _id: { $ne: userId }
            });

            const recentMessages = await Promise.all(friends.map(async friend => {
                const messages = await Message.find({
                    $or: [
                        { sender: userId, receiver: friend._id },
                        { receiver: userId, sender: friend._id }
                    ]
                }).sort({ createdAt: -1 }).limit(1); // Lấy tin nhắn mới nhất

                if (messages.length > 0) {
                    const message = messages[0];
                    if (message.sender == userId) {
                        const notice = {
                            title: friend.name,
                            receiverID: friend._id,
                            message: 'Bạn: ' + message.message,
                            timestamp: message.createdAt,
                        };
                        return notice;
                    } else {
                        const notice = {
                            title: friend.name,
                            receiverID: friend._id,
                            message: friend.name + ': ' + message.message,
                            timestamp: message.createdAt,
                        };
                        return notice;
                    }
                } else {
                    const notice = {
                        title: friend.name,
                        receiverID: friend._id,
                        message: 'No messages found',
                        timestamp: new Date(),
                    };
                    additionalNotices.push(notice);
                    return null;
                }
            }));

            // Lọc bỏ các giá trị null từ recentMessages
            const filteredRecentMessages = recentMessages.filter(notice => notice !== null);
            filteredRecentMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            // Nối các notice từ additionalNotices vào recentMessages
            const combinedMessages = filteredRecentMessages.concat(additionalNotices);

            // Gửi tin nhắn cũ đến người dùng
            socket.emit('recent-messages', combinedMessages);
        } catch (error) {
            console.error('Error loading recent messages:', error);
        }
    }

    static async handleMessage(io, data) {
        const sender = await AccountService.getAccountByUsername(data.sender);
        const receivers = await AccountService.getAllAdmin();

        const newMessage = new Message({
            sender: sender._id,
            receiver: 'admin',
            message: data.message,
        });
        await newMessage.save();

        let isNotify = false;

        receivers.forEach(async receiver => {
            const receiverSocketId = await redisClient.get(`socket:${receiver._id}`);
            if (receiverSocketId) {
                const sendMessage = {
                    title: sender.name || sender.username,
                    sender: sender.username,
                    message: data.message,
                    timestamp: new Date(),
                    avatar: sender.avatar,
                };
                // Gửi tin nhắn cho người nhận qua socket.id
                io.to(receiverSocketId).emit('chat message', sendMessage); // Gửi tin nhắn đến socket ID
            } else {
                const notificationPayload = {
                    receiver: receiver.username,
                    title: 'Bạn có tin nhắn mới',
                    body: `${sender.name || sender.username}: ${data.message}`,
                    icon: '/img/logo.png',
                    url: '/chat/' + sender.username,   
                };
    
                // Gửi thông báo cho người nhận
                await sendNotification('client_notifications', notificationPayload);                // Lấy thông báo tin nhắn từ database
                isNotify = true;
            }
        });
        const notification = await Messnotification.findOne({ sender: sender.username, receiver: 'admin' });
        if (notification && isNotify === true) {
            // Cập nhật thông báo
            notification.quantity += 1;
            notification.isRead = false;

            await notification.save();
        } else {
            // Tạo thông báo mới
            const messnotification = new Messnotification({
                sender: sender.username,
                name: sender.name,
                avatar: sender.avatar,
                receiver: 'admin',
                quantity: 1,
                isRead: false,
            });
            await messnotification.save();
        }
    }

    static async handleDisconnect(socket) {
        const userId = socket.request.user._id;
        await redisClient.del(`socket:${userId}`); // Xóa socket.id khỏi Redis
        //delete userSocketMap[userId]; // Xóa socket.id khỏi map khi người dùng ngắt kết nối
        console.log('User disconnected');
    }
}

module.exports = ChatService;