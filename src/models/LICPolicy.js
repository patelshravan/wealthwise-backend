const mongoose = require('mongoose');

const LICPolicySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    policyNumber: String,
    policyName: String,
    premiumAmount: Number,
    dueDate: Date,
    maturityDate: Date
});

module.exports = mongoose.model('LICPolicy', LICPolicySchema);
