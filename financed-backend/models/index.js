require('dotenv').config()

const mongoose = require('mongoose')
const {UserSchema} = require('./User')
const {StockSchema} = require('./Stock')

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema)

module.exports = {User, Stock}