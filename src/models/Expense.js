const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: {
    type: String,
    required: true,
    trim: true,
  },
  note: String,
  date: { type: Date, default: Date.now },
  image: { type: String, default: "" },
});

ExpenseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Expense", ExpenseSchema);
