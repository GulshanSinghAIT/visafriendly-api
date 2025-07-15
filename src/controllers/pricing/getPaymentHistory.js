const User = require("../../db/models/user.js");
const PastPayments = require("../../db/models/paymentHistory.js");

const GetPaymentHistory = async (req, res) => {
  const { email } = req.query;

  try {
    // Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch payment history for the user
    const paymentHistory = await PastPayments.findAll({
      where: {
        userId: user.id,
      },
      order: [["billingDate", "DESC"]], // Sort by most recent first
      attributes: [
        "id",
        "plan",
        "amount",
        "status",
        "billingDate",
        "invoicePdfLink",
      ],
    });

    res.status(200).json({
      paymentHistory,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};

module.exports = { GetPaymentHistory };
