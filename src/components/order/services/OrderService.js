const Cart = require("@components/cart/models/Cart");
const Order = require("@components/order/models/Order");
const ProductService = require("../../product/services/ProductService");
class OrderService {
    /**
     * Lấy danh sách đơn hàng của khách hàng
     * @param {string} customerId - ID của khách hàng
     * @returns {Promise<Array>} - Danh sách đơn hàng
     */
    async getOrdersByCustomerId(customerId) {
        try {
            return await Order.find({ customerId }).sort({ createdAt: -1 }); // Sắp xếp giảm dần theo createdAt
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách đơn hàng: ${error.message}`);
        }
    }
    

    /**
     * Lấy chi tiết đơn hàng
     * @param {string} orderId - ID của đơn hàng
     * @returns {Promise<Object>} - Chi tiết đơn hàng
     */
    async getOrderDetails(orderId) {
        try {
            return await Order.findById(orderId).populate('items.productId');
        } catch (error) {
            throw new Error(`Lỗi khi lấy chi tiết đơn hàng: ${error.message}`);
        }
    }

    /**
     * Tạo đơn hàng mới
     * @param {string} userId - ID của người dùng
     * @param {Object} orderData - Dữ liệu đơn hàng
     * @returns {Promise<Object>} - Đơn hàng mới được tạo
     */
    async createOrder(userId, orderData) {
        try {
            // Lấy giỏ hàng của người dùng
            const cart = await Cart.findOne({ userId }).populate('items.productId');
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error('Giỏ hàng trống. Không thể tạo đơn hàng.');
            }
    
            // Kiểm tra tồn kho trước khi xử lý
            for (const item of cart.items) {
                const product = item.productId;
    
                if (!product) {
                    throw new Error(`Không tìm thấy sản phẩm: ${item.productId}`);
                }
    
                // Tìm `stock` phù hợp với `size` và `color`
                const stockItem = product.stock.find(
                    (stock) => stock.size === item.size && stock.color === item.color
                );
    
                if (!stockItem) {
                    throw new Error(
                        `Sản phẩm "${product.name}" không tồn tại với size "${item.size}" và màu "${item.color}".`
                    );
                }
    
                // Kiểm tra số lượng tồn kho
                if (stockItem.quantity < item.quantity) {
                    throw new Error(
                        `Sản phẩm "${product.name}" (Size: ${item.size}, Color: ${item.color}) chỉ còn ${stockItem.quantity} sản phẩm trong kho.`
                    );
                }
            }
    
            // Tính tổng tiền từ giỏ hàng
            let totalAmount = 0;
            const items = cart.items.map(item => {
                const price = item.price;
                const quantity = item.quantity;
                totalAmount += price * quantity;
    
                return {
                    productId: item.productId._id,
                    size: item.size,
                    color: item.color,
                    quantity,
                    price
                };
            });
    
            // Cộng thêm phí vận chuyển
            const shippingFee = 0; // Hoặc tính toán theo logic khác nếu cần
            totalAmount += shippingFee;
    
            // Tạo đối tượng đơn hàng mới
            const newOrder = new Order({
                customerId: userId,
                ...orderData, // Bao gồm thông tin giao hàng
                items,
                totalAmount,
                shippingFee
            });
    
            // Lưu đơn hàng vào cơ sở dữ liệu
            await newOrder.save();
    
            // Cập nhật lại số lượng trong `stock`
            for (const item of cart.items) {
                const product = await ProductService.getProductById(item.productId._id);
                const stockItem = product.stock.find(
                    (stock) => stock.size === item.size && stock.color === item.color
                );
    
                if (stockItem) {
                    stockItem.quantity -= item.quantity;
                }
    
                await product.save();
            }
    
            // Xóa giỏ hàng sau khi tạo đơn hàng thành công
           // await Cart.deleteOne({ userId });
    
            return newOrder;
        } catch (error) {
            // Ném lỗi với thông báo chi tiết
            throw new Error(`Lỗi khi tạo đơn hàng: ${error.message}`);
        }
    }
    
}
 
module.exports = new OrderService();
