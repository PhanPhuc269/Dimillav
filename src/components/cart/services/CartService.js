const Cart = require("@components/cart/models/Cart");

class CartService {
    async findCartByUserId(userId) {
        return await Cart.findOne({ userId });
    }

    async createCart(userId, items) {
        const cart = new Cart({ userId, items });
        return await cart.save();
    }

    async updateCart(userId, items) {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items });
        } else {
            cart.items = items; // Ghi đè toàn bộ items
        }
        return await cart.save();
    }
}

module.exports = new CartService();
