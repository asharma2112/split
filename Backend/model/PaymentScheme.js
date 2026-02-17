const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Groups",
    required: true
  },
  from: {
    type: String,   // who paid
    required: true
  },
  to: {
    type: String,   // who received
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
