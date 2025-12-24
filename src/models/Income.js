const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const IncomeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        note: String,
        date: { type: Date, default: Date.now },
        source: {
            type: String,
            enum: ["salary", "freelance", "business", "investment", "other"],
            default: "other",
        },
    },
    { timestamps: true }
);

IncomeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Income", IncomeSchema);

