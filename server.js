const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const dp = require("./config/config").mongodbURI;

mongoose
  .connect(dp, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Mongodb connected"))
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", require("./routes/user.js"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/index", (req, res) => {
  res.render("index");
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
