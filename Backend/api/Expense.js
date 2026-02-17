const Payment = require("../model/PaymentScheme");
const Expense = require("../model/ExpenseScheme");

const AddExpense = async (req, res) => {
  try {
    const { groupId, description, amount, paidBy, members, date } = req.body;

    if (!groupId || !description || !amount || !paidBy || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const share = amount / members.length;

    const splitBetween = members.map(member => ({
      member,
      amount: share
    }));

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy,
      splitBetween,
      date
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Remove Expense





const DeleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    // Try deleting expense
    const expense = await Expense.findByIdAndDelete(expenseId);

    if (expense) {
      return res.status(200).json({ message: "Expense deleted" });
    }

    // If not expense, try payment
    const payment = await Payment.findByIdAndDelete(expenseId);

    if (payment) {
      return res.status(200).json({ message: "Payment deleted" });
    }

    return res.status(404).json({ message: "Transaction not found" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};






module.exports = {AddExpense,DeleteExpense};