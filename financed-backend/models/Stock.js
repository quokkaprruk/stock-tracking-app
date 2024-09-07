const mongoose = require("mongoose");

StockSchema = mongoose.Schema({
  symbol: {
    type: "string",
    unique: true,
    required: true,
  },
  company_name: {
    type: "string",
    required: true,
  },
  industry: {
    type: "string",
    required: true,
  },
  market_cap: {
    type: "string",
    required: true,
  },
});

module.exports = { StockSchema };
