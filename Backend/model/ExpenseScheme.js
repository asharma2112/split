const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Groups",
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: String, // since your members are strings
    required: true
  },
   date:{
    type: Date,
    required:true
  },
  splitBetween: [
    {
      member: String,
      amount: Number
    }
  ]

 
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
