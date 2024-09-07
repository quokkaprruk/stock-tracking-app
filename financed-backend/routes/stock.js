const express = require("express");
const router = express.Router();
const cors = require("cors");
const { Stock } = require("../models");
const yahooFinance = require("yahoo-finance2").default;

router.options("/industries/:industry", cors());

router.get("/industries", async (req, res) => {
  let stocks = await Stock.distinct("industry");
  return res.status(200).json(stocks);
});

/*
  Params:
    industry: Gets the companies in this industry
  
  Returns:
    companies: Companies that are in the industry specified in the parameter
  */
router.get("/industries/:industry", cors(), async (req, res) => {
  const { industry } = req.params;

  //Companies in that industry
  let companies = await Stock.find({ industry });

  return res.status(200).json(companies);
});

//Returns detailed current stock information. If date query parameter is specified, also returns historical data from that date.
router.get("/:stockSymbol", async (req, res) => {
  console.log(req.params);
  const { stockSymbol } = req.params;
  const date = req.query.date;
  console.log(stockSymbol, date);
  try {
    let stockInfo = await yahooFinance.quote(stockSymbol);
    if (date) {
      let queryOptions = { period1: date };
      stockInfo.history = (
        await yahooFinance.chart(stockSymbol, queryOptions)
      ).quotes;
    }
    return res.status(200).json(stockInfo);
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Unable to find the requested resource", error: err });
  }
});

module.exports = router;
