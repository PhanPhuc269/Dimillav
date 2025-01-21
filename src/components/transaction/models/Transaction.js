const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator'); 
const Schema = mongoose.Schema;
const crypto = require('crypto'); // Import thư viện crypto (có sẵn trong Node.js)

// Kích hoạt plugin slug trong mongoose
mongoose.plugin(slug);

const TransactionSchema = new mongoose.Schema({
    _id: { type: String },
  
     customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }, // Số tiền thanh toán
    paymentMethod: { type: String, required: true },
    orderId: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'canceled'], default: 'pending' },
}, {
  _id: false,
    timestamps: true, 
});

// Hook tạo tự động _id trước khi lưu
TransactionSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Tìm giao dịch gần nhất để xác định số thứ tự
        const lastTransaction = await mongoose.model('Transaction').findOne().sort({ createdAt: -1 });
        const lastId = lastTransaction ? parseInt(lastTransaction._id.split('-')[3]) : 0;

        // Tạo chuỗi số ngẫu nhiên (4 chữ số)
        const randomSequence = crypto.randomInt(1000, 9999); // Tạo số ngẫu nhiên từ 1000 đến 9999

        // Tạo _id đặc biệt
        this._id = `TX-${this.customerId}-${this.orderId}-${randomSequence}-${lastId + 1}`;
    }
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
