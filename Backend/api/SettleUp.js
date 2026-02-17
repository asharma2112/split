const Expense = require("../model/ExpenseScheme");
const Payment = require("../model/PaymentScheme");
const Group = require("../model/GroupScheme");

const SettleUp = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const expenses = await Expense.find({ group: groupId });
    const payments = await Payment.find({ group: groupId });

    let balance = {};

    // Initialize all members
    group.members.forEach(member => {
      balance[member] = 0;
    });

    // 1️⃣ Calculate from expenses
    expenses.forEach(exp => {
      exp.splitBetween.forEach(split => {
        balance[split.member] -= split.amount;
      });

      balance[exp.paidBy] += exp.amount;
    });

    // 2️⃣ Adjust from payments (CORRECT LOGIC)
    payments.forEach(pay => {
      balance[pay.from] += pay.amount;
      balance[pay.to] -= pay.amount;
    });

    // 3️⃣ Separate creditors & debtors
    const creditors = [];
    const debtors = [];

    Object.entries(balance).forEach(([member, amount]) => {
      if (amount > 0) creditors.push({ member, amount });
      if (amount < 0) debtors.push({ member, amount: Math.abs(amount) });
    });

    // 4️⃣ Generate settlement suggestions
    const settlements = [];

    creditors.forEach(creditor => {
      debtors.forEach(debtor => {
        if (creditor.amount > 0 && debtor.amount > 0) {

          const settleAmount = Math.min(
            creditor.amount,
            debtor.amount
          );

          settlements.push({
            from: debtor.member,
            to: creditor.member,
            amount: settleAmount
          });

          creditor.amount -= settleAmount;
          debtor.amount -= settleAmount;
        }
      });
    });

    res.status(200).json(settlements);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { SettleUp };
