const CurrentPlans = require("../db/models/currentPlan.js");

/**
 * Initialize database with required data
 * Creates missing pricing plans and other essential records
 */
const initializeDatabase = async () => {
  console.log('\n=== Database Initialization ===');
  
  // Define all required plans
  const requiredPlans = [
    {
      id: 1,
      planName: 'Free Plan',
      planType: 'FREE',
      price: '0.00',
      billingCycle: 1,
      basicDescription: 'Basic features for new users'
    },
    {
      id: 2,
      planName: 'VisaFriendly Plus - Monthly',
      planType: 'MONTHLY',
      price: '9.99',
      billingCycle: 1,
      basicDescription: 'Premium features with monthly billing'
    },
    {
      id: 3,
      planName: 'VisaFriendly Plus - 2 Months',
      planType: 'QUARTERLY',
      price: '15.98',
      billingCycle: 2,
      basicDescription: 'Premium features with 2-month billing (Save 20%)'
    },
    {
      id: 4,
      planName: 'VisaFriendly Plus - 3 Months',
      planType: 'QUARTERLY',
      price: '20.97',
      billingCycle: 3,
      basicDescription: 'Premium features with 3-month billing (Save 30%)'
    }
  ];
  
  // Check existing plans
  const existingPlans = await CurrentPlans.findAll();
  const existingPlanIds = existingPlans.map(p => p.id);
  console.log(`Found ${existingPlans.length} existing plans with IDs: [${existingPlanIds.join(', ')}]`);
  
  // Create missing plans
  const createdPlans = [];
  for (const planData of requiredPlans) {
    try {
      // Check if plan with this ID already exists
      const existingPlan = await CurrentPlans.findByPk(planData.id);
      if (existingPlan) {
        console.log(`Plan ${planData.id} (${planData.planName}) already exists`);
      } else {
        console.log(`Creating plan ${planData.id}: ${planData.planName}`);
        const newPlan = await CurrentPlans.create(planData);
        createdPlans.push(newPlan);
      }
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log(`Plan ${planData.id} already exists (caught unique constraint error)`);
      } else {
        console.error(`Error creating plan ${planData.id}:`, error.message);
        throw error;
      }
    }
  }
  
  console.log(`Created ${createdPlans.length} new plans`);
  
  // Verify final state
  const finalPlans = await CurrentPlans.findAll({ order: [['id', 'ASC']] });
  
  return {
    currentPlans: {
      count: finalPlans.length,
      existing: existingPlans.length,
      created: createdPlans.length,
      plans: finalPlans.map(p => ({
        id: p.id,
        name: p.planName,
        type: p.planType,
        price: p.price,
        billingCycle: p.billingCycle
      }))
    }
  };
};

/**
 * Ensure default plan exists (used by other controllers)
 * Creates the free plan if it doesn't exist
 */
const ensureDefaultPlan = async () => {
  let defaultPlan = await CurrentPlans.findByPk(1);
  if (!defaultPlan) {
    console.log('Default plan not found, creating it...');
    defaultPlan = await CurrentPlans.create({
      id: 1,
      planName: 'Free Plan',
      planType: 'FREE',
      price: '0.00',
      billingCycle: 1,
      basicDescription: 'Basic features for new users'
    });
    console.log('Default plan created successfully:', defaultPlan.id);
  } else {
    console.log('Default plan exists:', defaultPlan.planName);
  }
  return defaultPlan;
};

/**
 * Get all pricing plans
 */
const getAllPlans = async () => {
  return await CurrentPlans.findAll({ order: [['id', 'ASC']] });
};

/**
 * Check if all required plans exist
 */
const validateRequiredPlans = async () => {
  const requiredPlanIds = [1, 2, 3, 4];
  const existingPlans = await CurrentPlans.findAll({
    where: { id: requiredPlanIds }
  });
  
  const existingIds = existingPlans.map(p => p.id);
  const missingIds = requiredPlanIds.filter(id => !existingIds.includes(id));
  
  return {
    isValid: missingIds.length === 0,
    existingPlans: existingIds,
    missingPlans: missingIds,
    totalRequired: requiredPlanIds.length,
    totalExists: existingIds.length
  };
};

module.exports = {
  initializeDatabase,
  ensureDefaultPlan,
  getAllPlans,
  validateRequiredPlans
}; 