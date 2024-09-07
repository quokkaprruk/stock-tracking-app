/*****************************************************************************
* WEB422 – Project
* I declare that this assignment is my own work in accordance with SenecaAcademic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Group member Name: Jashanpreet Singh, Siripa Purinruk Student IDs: 112454228, 120453220 Date: 14 August, 2024
*****************************************************************************/ 

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const stockRouter = require("./routes/stock");
const userRouter = require("./routes/user");
const favouriteRouter = require("./routes/favourite");

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use("/", bodyParser.json());

app.use("/stock", stockRouter);
app.use("/user", userRouter);
app.use("/favourite", favouriteRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
