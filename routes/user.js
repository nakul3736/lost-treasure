const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  //console.log(req.body);
  let errors = [];
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all the fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Enter password having length greater than 6" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, email, name, password, password2 });
  } else {
  }
});

module.exports = router;
