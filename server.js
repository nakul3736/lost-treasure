const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");

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

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const local = require("./config/passport");

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/user", require("./routes/user.js"));
app.use(express.static("public"));

app.get("/", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});

app.get("/index", ensureAuthenticated, (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

app.get("/buried_treasure", ensureAuthenticated, (req, res) => {
  res.render("buried_treasure", {
    user: req.user,
  });
});

app.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).render("404");
});
