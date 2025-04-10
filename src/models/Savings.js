const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SavingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    note: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SavingsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Savings", SavingsSchema);
