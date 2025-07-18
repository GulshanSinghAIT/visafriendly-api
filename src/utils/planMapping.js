/**
 * Utility functions for mapping Dodo Payments product IDs to internal plan data
 */

// Map Dodo product IDs to existing database plan IDs
const mapProductIdToPlanId = (productId) => {
  const planMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': 2, // Plus for 1 Month -> Plan ID 2 (Monthly $9.99)
    'pdt_6RuL6zJsB358bReAL7xlJ': 3, // Plus for 2 Months -> Plan ID 3 (2-Month $15.98)
    'pdt_JJYvpfA4n7LjIUwhf9DJi': 4, // Plus for 3 Months -> Plan ID 4 (3-Month $20.97)
  };
  return planMap[productId] || 2; // Default to monthly plan
};

// Get plan name from Dodo product ID
const getPlanNameFromProductId = (productId) => {
  const planMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': 'VisaFriendly Plus - Monthly',
    'pdt_6RuL6zJsB358bReAL7xlJ': 'VisaFriendly Plus - 2 Months',
    'pdt_JJYvpfA4n7LjIUwhf9DJi': 'VisaFriendly Plus - 3 Months',
  };
  return planMap[productId] || 'VisaFriendly Plus - Monthly';
};

// Get price from Dodo product ID
const getPriceFromProductId = (productId) => {
  const priceMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': '9.99',
    'pdt_6RuL6zJsB358bReAL7xlJ': '15.98',
    'pdt_JJYvpfA4n7LjIUwhf9DJi': '20.97',
  };
  return priceMap[productId] || '9.99';
};

// Get billing cycle from Dodo product ID
const getBillingCycleFromProductId = (productId) => {
  const cycleMap = {
    'pdt_gXXT6AXOHrLRiuV3efghJ': 1, // Monthly
    'pdt_6RuL6zJsB358bReAL7xlJ': 2, // 2 Months
    'pdt_JJYvpfA4n7LjIUwhf9DJi': 3, // 3 Months
  };
  return cycleMap[productId] || 1;
};

// Check if a string is a Dodo product ID
const isDodoProductId = (id) => {
  return typeof id === 'string' && id.startsWith('pdt_');
};

// Get all product mappings for reference
const getAllProductMappings = () => {
  return {
    'pdt_gXXT6AXOHrLRiuV3efghJ': {
      planId: 2,
      name: 'VisaFriendly Plus - Monthly',
      price: '9.99',
      billingCycle: 1,
      description: 'Premium features with monthly billing'
    },
    'pdt_6RuL6zJsB358bReAL7xlJ': {
      planId: 3,
      name: 'VisaFriendly Plus - 2 Months',
      price: '15.98',
      billingCycle: 2,
      description: 'Premium features with 2-month billing (Save 20%)'
    },
    'pdt_JJYvpfA4n7LjIUwhf9DJi': {
      planId: 4,
      name: 'VisaFriendly Plus - 3 Months',
      price: '20.97',
      billingCycle: 3,
      description: 'Premium features with 3-month billing (Save 30%)'
    }
  };
};

module.exports = {
  mapProductIdToPlanId,
  getPlanNameFromProductId,
  getPriceFromProductId,
  getBillingCycleFromProductId,
  isDodoProductId,
  getAllProductMappings
}; 