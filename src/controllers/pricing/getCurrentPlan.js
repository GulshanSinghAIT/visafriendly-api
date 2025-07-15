const User = require("../../db/models/user.js");
const CurrentPlans = require("../../db/models/currentPlan.js");

const GetCurrentPlan = async (req, res) => {
  const { email } = req.query;

  try {
    // Find user
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: CurrentPlans,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if (!user.currentPlanId || user.currentPlanId === 1) {
    //   const freePlan = await CurrentPlans.findOne({
    //     where: { id: 1 },
    //   });
    //   user.currentPlanId = 1;
    //   user.save();
    //   return res.status(200).json({
    //     plan: freePlan,
    //   });
    // }
    const plan = await CurrentPlans.findOne({
      where: { id: user.currentPlanId },
    });
    // Return current plan details
    res.status(200).json({
      plan: plan,
    });
  } catch (error) {
    console.error("Error fetching current plan:", error);
    res.status(500).json({
      message: "Error fetching current plan",
      error: error.message,
    });
  }
};

module.exports = { GetCurrentPlan };
