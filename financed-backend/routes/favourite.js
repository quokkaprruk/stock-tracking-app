require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User, Stock } = require("../models");
const { verify } = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

//Verifies the user info and adds their id and username to the request object
router.use("/", (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let { username, id } = verify(token, process.env.JWT_SECRET);
    req.body.username = username;
    req.body.userID = id;
  } catch {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  next();
});

//Returns user's favourites
router.get("/", async (req, res) => {
  const { userID, username, stock } = req.body;
  console.log(userID);
  const { favourites } = await User.findById(userID);

  //Stores array of favourite companies with their symbol, name, industry, and market cap
  let detailedFavourites = [];
  for (let favourite of favourites) {
    detailedFavourites.push(
      await Stock.findOne({ symbol: favourite }, { _id: 0 })
    );
  }
  return res.status(200).json(detailedFavourites);
});

router.delete("/:stock", async (req, res) => {
  const { stock } = req.params;
  const { userID, username } = req.body;
  console.log(req.body, stock, username);
  if (!stock) return res.status(400, "No stock provided");
  try {
    let { favourites } = await User.findOne({ _id: new ObjectId(userID) });
    console.log(favourites);
    if (!favourites.includes(stock)) {
      return res
        .status(400)
        .json({ message: "The company is not included as a favourite" });
    }

    //Remove the stock
    favourites.splice(favourites.indexOf(stock), 1);
    console.log(favourites);
    //Update the user with the new list of favourites
    await User.updateOne(
      { _id: new ObjectId(userID) },
      { $set: { favourites: favourites } }
    );

    return res.status(200).json({
      message: `${stock} removed from ${username}'s favourites successfully`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/*
  
*/
router.put("/", async (req, res) => {
  const { userID, username, stock } = req.body;
  try {
    let { favourites } = await User.findOne({ _id: new ObjectId(userID) });
    //Create set to ensure unique values
    favourites = new Set(favourites);
    //Return 400 if the company has already been added as a favourite
    if (favourites.has(stock)) {
      return res
        .status(400)
        .json({ message: "The company is already present as a favourite" });
    } else {
      //Add stock to favourite
      favourites.add(stock);
      //Turn set into array
      favourites = Array.from(favourites);
      //Update the user with the new list of favourites
      await User.updateOne(
        { _id: new ObjectId(userID) },
        { $set: { favourites: favourites } }
      );
    }

    return res.status(200).json({
      message: `${stock} added as favourite successfully for ${username}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
