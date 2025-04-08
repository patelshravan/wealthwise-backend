const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const LICPolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  policyNumber: String,
  policyName: String,
  premiumAmount: Number,
  dueDate: Date,
  maturityDate: Date,
});

LICPolicySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("LICPolicy", LICPolicySchema);
