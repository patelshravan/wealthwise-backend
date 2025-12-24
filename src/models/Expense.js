const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ExpenseSchema = new mongoose.Schema(
  {
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
    // Credit card expense fields
    isCreditCard: { type: Boolean, default: false },
    cardName: { type: String, trim: true }, // e.g., "HDFC Credit Card", "ICICI Credit Card"
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    dueDate: { type: Date }, // Payment due date
    billingCycleDate: { type: Date }, // Billing cycle start date (e.g., Dec 16, Jan 16)
    // Reimbursement tracking fields
    isReimbursable: { type: Boolean, default: false }, // Whether this expense is reimbursable (e.g., paid for friend)
    expectedReimbursement: { type: Number, default: 0 }, // Amount expected to be reimbursed
    reimbursementReceived: { type: Boolean, default: false }, // Whether reimbursement has been received
  },
  { timestamps: true }
);

ExpenseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Expense", ExpenseSchema);
