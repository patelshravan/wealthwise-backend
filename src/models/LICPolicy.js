const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const LICPolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  policyNumber: String,
  policyName: String,
  premiumAmount: Number,
  dueDate: Date,
  premiumMode: {
    type: String,
    required: true,
    enum: ["monthly", "quarterly", "half-yearly", "yearly"],
  },
  nextDueDate: { type: Date, required: true },
  lastPaidDate: { type: Date, default: null },
  maturityDate: Date,
});

LICPolicySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("LICPolicy", LICPolicySchema);
