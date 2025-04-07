const mongoose = require('mongoose');

const SavingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    note: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Savings', SavingsSchema);
