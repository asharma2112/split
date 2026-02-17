const Expense = require("../model/ExpenseScheme");
const Payment = require("../model/PaymentScheme");
const Group = require("../model/GroupScheme");

const GetGroupBalance = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const expenses = await Expense.find({ group: groupId });
    const payments = await Payment.find({ group: groupId });

    const balance = {};

    // Initialize all members balance = 0
    group.members.forEach(member => {
      balance[member] = 0;
    });

    // =====================
    // 1️⃣ Calculate from Expenses
    // =====================
    expenses.forEach(exp => {

      exp.splitBetween.forEach(split => {
        if (balance[split.member] !== undefined) {
          balance[split.member] -= split.amount;
        }
      });

      if (balance[exp.paidBy] !== undefined) {
        balance[exp.paidBy] += exp.amount;
      }

    });

    // =====================
    // 2️⃣ Calculate from Payments
    // =====================
  payments.forEach(pay => {
balance[pay.from] += pay.amount;  // reduce negative
balance[pay.to] -= pay.amount;    // reduce positive

});


    res.status(200).json(balance);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { GetGroupBalance };
