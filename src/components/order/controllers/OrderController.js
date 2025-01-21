const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const Cart = require("@components/cart/models/Cart");
const Product = require("@components/product/models/Product");
const Order = require("@components/order/models/Order");


const OrderService = require('../services/OrderService');

class OrderController {
    ViewProductCheckout(req, res, next) {
        res.render('checkout');
    }

    async ViewOrderList(req, res, next) {
        try {
            const customerId = req.user._id;
           
            const orders = await OrderService.getOrdersByCustomerId(customerId);
            res.render('orderList', {
                orders: mutipleMongooseToObject(orders),
            });
        } catch (error) {
            next(error);
        }
    }

    async ViewOrderDetail(req, res, next) {
        try {
            const orderId = req.params._id;
            const order = await OrderService.getOrderDetails(orderId);

            if (!order) {
                return res.status(404).send('Không tìm thấy đơn hàng.');
            }

            res.render('orderDetail', {
                order: mongooseToObject(order),
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
            res.status(500).send('Lỗi server.');
        }
    }

    async addOrder(req, res, next) {
        try {
            const userId = req.user._id;
            const {
                firstName, lastName, phoneNumber, email,
                addressLine1, city, district, zip, orderNotes
            } = req.body;
    
            const orderData = {
                firstName,
                lastName,
                phoneNumber,
                email,
                addressLine1,
                city,
                district,
                zip,
                orderNotes
            };
    
            const newOrder = await OrderService.createOrder(userId, orderData);
    
            // Trả phản hồi JSON khi thành công
            res.status(201).json({
                message: "Order created successfully.",
                orderId: newOrder._id,
            });
        } catch (error) {
            console.error("Error while creating order:", error);
    
            // Trả phản hồi JSON khi gặp lỗi
            res.status(400).json({
                message: "Failed to create order. Please check your cart or shipping information.",
                errorCode: 400,
                errorDetails: error.message, // Gửi chi tiết lỗi trong phản hồi
            });
        }
    }
    
    
}

module.exports = new OrderController();



