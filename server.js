const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
let bodyParser = require("body-parser");
const dp = require("./config/config").mongodbURI;

mongoose
  .connect(dp, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Mongodb connected"))
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.use("/user", require("./routes/user.js"));
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("register");
});

app.get("/buried_treasure", (req, res) => {
  res.render("buried_treasure");
});

app.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).render("404");
});
