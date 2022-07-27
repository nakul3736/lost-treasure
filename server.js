const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");
const User = require("./models/User");
const app = express();

//Pasport config
require("./config/passport")(passport);

const PORT = process.env.PORT || 3000;
let bodyParser = require("body-parser");
const dp = require("./config/config").mongodbURI;

mongoose
  .connect(process.env.MONGODB_URI || dp, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Mongodb connected"))
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

//Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/index", ensureAuthenticated, (req, res) => {
  const currentURL = decodeURIComponent(req.url);
  const username = req.query.username;
  localStorage.setItem("username", username);
  res.render("index", {
    user: req.user,
    username: username,
  });
});

app.get("/buried_treasure", ensureAuthenticated, (req, res) => {
  //console.log(localStorage.getItem("username"));
  const username = localStorage.getItem("username");

  User.findOne({ username: username }).then((doc) => {
    const score = doc.score;
    localStorage.setItem("highscore", score);
    console.log(score);
  });
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
