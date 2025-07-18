const User = require("../../db/models/user.js");
const PastPayments = require("../../db/models/paymentHistory.js");
const CurrentPlans = require("../../db/models/currentPlan.js");
const { 
  mapProductIdToPlanId, 
  getPlanNameFromProductId, 
  getPriceFromProductId,
  isDodoProductId 
} = require("../../utils/planMapping.js");

const UpdatePlan = async (req, res) => {
  let { status, id, email, paymentID } = req.body;

  try {
    console.log('\n=== UpdatePlan Debug ===');
    console.log('Request Body:', { status, id, email, paymentID });

    // Validate required fields
    if (!email || !id) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["email", "id"],
        received: { email: !!email, id: !!id }
      });
    }

    // Find the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User found:', { id: user.id, currentPlanId: user.currentPlanId });

    let planId;
    let planName;
    let price;

    // Check if id is a Dodo product ID (starts with 'pdt_')
    if (isDodoProductId(id)) {
      console.log('Processing Dodo product ID:', id);
      
      // Map Dodo product ID to existing database plan ID
      planId = mapProductIdToPlanId(id);
      planName = getPlanNameFromProductId(id);
      price = getPriceFromProductId(id);
      
      console.log('Mapped to plan ID:', planId, 'Name:', planName, 'Price:', price);
      
      // Verify the plan exists in database
      const plan = await CurrentPlans.findByPk(planId);
      if (!plan) {
        console.error(`Plan ID ${planId} not found in database for product ${id}`);
        return res.status(500).json({ 
          error: "Database configuration error",
          message: `Plan ID ${planId} not found. Database may need initialization.`,
          suggestion: "Call POST /init-database to setup required plans"
        });
      }
      
      console.log('Plan verified in database:', { 
        id: plan.id, 
        name: plan.planName, 
        price: plan.price 
      });
      
    } else {
      // This is a database plan ID, validate it exists
      planId = parseInt(id);
      const plan = await CurrentPlans.findByPk(planId);
      if (!plan) {
        console.log('Plan not found for ID:', planId);
        return res.status(404).json({ message: "Plan not found" });
      }
      planName = plan.planName;
      price = plan.price;
    }

    // Update user's current plan if status is active
    if (status === "active") {
      console.log(`Updating user ${user.id} currentPlanId from ${user.currentPlanId} to ${planId}`);
      await user.update({ currentPlanId: planId });
      status = "PAID";
    }

    // Create payment history record
    console.log('Creating payment record:', { 
      status, 
      userId: user.id, 
      planName, 
      price, 
      paymentID 
    });
    
    const pastPayment = await PastPayments.create({
      status: status,
      userId: user.id,
      amount: price,
      plan: planName,
      billingDate: new Date(),
      paymentID: paymentID,
    });

    console.log('Payment record created successfully:', pastPayment.id);

    // Send success response
    return res.status(200).json({ 
      message: "Subscription updated successfully",
      data: {
        userId: user.id,
        newPlanId: planId,
        planName: planName,
        price: price,
        paymentId: pastPayment.id
      }
    });
    
  } catch (error) {
    console.error('\n=== UpdatePlan Error ===');
    console.error('Error details:', error);
    console.error('Request data:', { status, id, email, paymentID });
    
    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: "Duplicate entry",
        message: "A record with this information already exists",
        details: error.errors?.map(err => err.message)
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: "Invalid reference",
        message: "Referenced plan or user does not exist",
        details: error.message
      });
    }
    
    return res.status(500).json({ 
      error: "Internal server error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { UpdatePlan };
