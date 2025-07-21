const { Sequelize } = require("sequelize");
const config = require("./config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env]; // Now this will not be undefined

if (!dbConfig) {
  throw new Error(`Database configuration for '${env}' environment not found.`);
}

// Add connection retry logic for production
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: false,
    pool: dbConfig.pool,
    retry: {
      max: 5,
      backoffBase: 1000,
      backoffExponent: 1.5,
    },
    // Add connection timeout
    timeout: 60000,
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log(`✅ Database connection established successfully in ${env} mode`);
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
    if (dbConfig.dialectOptions?.ssl) {
      console.log(`🔒 SSL: Enabled`);
    }
  })
  .catch((err) => {
    console.error(`❌ Database connection failed in ${env} mode:`, err.message);
    console.error(`🔧 SSL Config:`, JSON.stringify(dbConfig.dialectOptions?.ssl, null, 2));
    console.error(`🌐 Connection Details:`, {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      username: dbConfig.username ? '***' : 'undefined'
    });
  });

module.exports = sequelize;
