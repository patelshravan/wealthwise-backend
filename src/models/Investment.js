const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    name: String,
    amountInvested: Number,
    currentValue: Number,
    startDate: Date
});

module.exports = mongoose.model('Investment', InvestmentSchema);
