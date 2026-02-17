  const Expense = require("../model/ExpenseScheme");
  const Payment = require("../model/PaymentScheme");

  const GetGroupExpenses = async (req, res) => {
    try {
      const { groupId } = req.params;

      const expenses = await Expense.find({ group: groupId });
      const payments = await Payment.find({ group: groupId });

      // Convert payments into expense-like format
      const formattedPayments = payments.map(payment => ({
        _id: payment._id,
        description: `Payment from ${payment.from} to ${payment.to}`,
        amount: payment.amount,
        paidBy: payment.from,
        date: payment.date,
        createdAt: payment.createdAt,
        splitBetween: [],
        type: "payment"
      }));

      const formattedExpenses = expenses.map(exp => ({
        ...exp._doc,
        type: "expense"
      }));

      const allTransactions = [
        ...formattedExpenses,
        ...formattedPayments
      ];

    allTransactions.sort((a, b) => {
    const dateA = new Date( a.createdAt);
    const dateB = new Date( b.createdAt);

    return dateB - dateA; // latest first
  });


      res.status(200).json(allTransactions);

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  module.exports = { GetGroupExpenses };
