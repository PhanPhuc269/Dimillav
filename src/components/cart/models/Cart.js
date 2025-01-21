const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      size: { type: Number, required: true }, // Kích thước sản phẩm
      color: { type: String, required: true }, // Màu sắc sản phẩm
      quantity: { type: Number, required: true }, // Số lượng sản phẩm
      price: { type: Number, required: true } // Giá sản phẩm
    }
  ],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);
