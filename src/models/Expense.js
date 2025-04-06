const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    category: String,
    note: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
