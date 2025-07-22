const models = require('./src/db/models');

console.log("All models:", Object.keys(models));
console.log("DailySearch:", models.DailySearch);
console.log("DailySearch type:", typeof models.DailySearch);

// Try to access the model directly
try {
  const DailySearch = models.DailySearch;
  if (DailySearch) {
    console.log("✅ DailySearch model found");
    console.log("Model attributes:", Object.keys(DailySearch.rawAttributes || {}));
  } else {
    console.log("❌ DailySearch model is undefined");
  }
} catch (error) {
  console.log("❌ Error accessing DailySearch model:", error.message);
} 