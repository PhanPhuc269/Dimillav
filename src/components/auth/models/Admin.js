// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    birthday: { type: Date },
    avatar: { type: String, default: '/img/default-avatar.png' },
    address: { type: String },
    phone: { type: String },
    facebook: { type: String },
    name: { type: String },
    status: { type: String, default: 'active' },
    secretKey: {
        type: String,
        default: null,
    }

}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});




AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

AdminSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
