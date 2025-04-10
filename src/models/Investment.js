const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const InvestmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    name: String,
    amountInvested: Number,
    currentValue: Number,
    startDate: Date,
  },
  { timestamps: true }
);

InvestmentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Investment", InvestmentSchema);
