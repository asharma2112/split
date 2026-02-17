const Payment = require("../model/PaymentScheme");

const MakePayment = async (req, res) => {
  try {
    const { groupId, from, to, amount } = req.body;

    if (!groupId || !from || !to || !amount) {
      return res.status(400).json({ message: "All fields required" });
    }

    const payment = await Payment.create({
      group: groupId,
      from,
      to,
      amount,
      date: new Date() // ✅ FIX HERE
    });

    res.status(201).json(payment);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { MakePayment };
