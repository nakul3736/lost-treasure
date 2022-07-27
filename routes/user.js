const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  console.log(req.body);
  let errors = [];
  const { name, username, password, password2 } = req.body;

  if (!name || !username || !password || !password2) {
    errors.push({ msg: "Please enter all the fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Enter password having length greater than 6" });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render("register", { errors, username, name, password, password2 });
  } else {
    User.findOne({ username: username }).then((user) => {
      if (user) {
        errors.push({ msg: "Username already exists" });
        res.render("register", {
          errors,
          name,
          username,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          username,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/user/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  function (req, res) {
    const user = encodeURIComponent(req.body.username);
    res.redirect("/index?username=" + user);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/user/login");
  });
});

module.exports = router;
