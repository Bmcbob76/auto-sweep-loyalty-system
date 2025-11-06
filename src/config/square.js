const { Client, Environment } = require('square');

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox
});

module.exports = {
  paymentsApi: squareClient.paymentsApi,
  customersApi: squareClient.customersApi,
  ordersApi: squareClient.ordersApi
};
