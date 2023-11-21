const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/usersschema");
router.get("/", (req, res) => {
  const pagedata = {
    tittle: "User Login",
  };
  res.setHeader("Cache-Control", "no-cache,no-store,must-revalidate");
  res.status(200).render("login", pagedata);
});
router.post("/", async (req, res) => {
  const pagedata = req.body;
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  pagedata.tittle = "User Login";
  if (username && password) {
    const user = await User.findOne({ username: username }).catch((err) => {
      console.log(err);
      pagedata.errormsg = "Something Went Wrong!!";
      res.status(200).render("login", pagedata);
    });
    if (user != null) {
      const result = await bcrypt.compare(password, user.password);

      if (result === true) {
        req.session.navin = user;
        return res.redirect("/home");
      } else {
        pagedata.errormsg = "Login Details Incorrect!!";
        res.status(200).render("login", pagedata);
      }
    } else {
      pagedata.errormsg = "Login Details Incorrect!!";
      res.status(200).render("login", pagedata);
    }
  } else {
    pagedata.errormsg = "Make sure each field has a valid value";
    res.status(200).render("login", pagedata);
  }
});
module.exports = router;
