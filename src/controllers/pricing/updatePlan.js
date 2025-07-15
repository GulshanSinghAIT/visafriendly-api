const User = require("../../db/models/user.js");
const PastPayments = require("../../db/models/paymentHistory.js");
const CurrentPlans = require("../../db/models/currentPlan.js");

// Helper functions to map Dodo product IDs to plan information
const getPlanNameFromProductId = (productId) => {
  const planMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': 'Plus for 1 Month',
    'pdt_6RuL6zJsB358bReAL7xlJ': 'Plus for 2 Months',
    'pdt_JJYvpfA4n7LjIUwhf9DJi': 'Plus for 3 Months',
  };
  return planMap[productId] || 'VisaFriendly Plus';
};

const getPriceFromProductId = (productId) => {
  const priceMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': '9.99',
    'pdt_6RuL6zJsB358bReAL7xlJ': '15.98',
    'pdt_JJYvpfA4n7LjIUwhf9DJi': '20.97',
  };
  return priceMap[productId] || '9.99';
};

const getBillingCycleFromProductId = (productId) => {
  const cycleMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': 1,
    'pdt_6RuL6zJsB358bReAL7xlJ': 2,
    'pdt_JJYvpfA4n7LjIUwhf9DJi': 3,
  };
  return cycleMap[productId] || 1;
};

const UpdatePlan = async (req, res) => {
  let { status, id, email, paymentID } = req.body;

  try {
    console.log('UpdatePlan called with:', { status, id, email, paymentID });

    // Find the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User found:', user.id);

    // Check if id is a Dodo product ID (starts with 'pdt_')
    if (id && id.startsWith('pdt_')) {
      console.log('Processing Dodo product ID:', id);
      
      // This is a Dodo product ID, create a plan record or map to existing plan
      const planName = getPlanNameFromProductId(id);
      console.log('Plan name:', planName);
      
      // Create or find a plan based on the product ID
      let plan = await CurrentPlans.findOne({ where: { planName } });
      
      if (!plan) {
        console.log('Creating new plan for:', planName);
        // Create a new plan record for this Dodo product
        plan = await CurrentPlans.create({
          planName: planName,
          planType: 'MONTHLY', // Use existing enum value
          price: getPriceFromProductId(id),
          billingCycle: getBillingCycleFromProductId(id),
          basicDescription: `Plan for ${planName}`,
        });
      }
      
      id = plan.id; // Use the database plan ID
      console.log('Using plan ID:', id);
    } else {
      // This is a database plan ID, find the plan
      const plan = await CurrentPlans.findOne({ where: { id } });
      if (!plan) {
        console.log('Plan not found for ID:', id);
        return res.status(404).json({ message: "Plan not found" });
      }
    }

    if (status === "active") {
      console.log('Updating user currentPlanId to:', id);
      await user.update({ currentPlanId: id });
      status = "PAID";
    }

    console.log('Creating payment record with status:', status);
    const pastPayment = await PastPayments.create({
      status: status,
      userId: user.id,
      amount: getPriceFromProductId(id) || "9.99",
      plan: getPlanNameFromProductId(id) || "VisaFriendly Plus",
      billingDate: new Date(),
      paymentID: paymentID,
    });

    console.log('Payment record created:', pastPayment.id);

    // Send success response so frontend can clear params
    return res
      .status(200)
      .json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error("Error updating plan:", error);
    return res.status(500).json({ 
      message: "Error updating plan",
      error: error.message 
    });
  }
};

module.exports = { UpdatePlan };
