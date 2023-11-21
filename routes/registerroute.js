const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/usersschema");
router.get("/", (req, res) => {
  const pagedata = {
    tittle: "Rgistration",
  };
  res.setHeader("Cache-Control", "no-cache,no-store,must-revalidate");
  res.status(200).render("register", pagedata);
});
router.post("/", async (req, res) => {
  const pagedata = req.body;
  pagedata.title = "Registration";
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const username = req.body.username.trim();
  if (name && email && username && password) {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((err) => {
      console.log("error in finding", err);
      pagedata.errormsg = "Something went wromg..!";
      res.status(200).render("register", pagedata);
    });
    if (user == null) {
      //store database
      const data = req.body;
      data.password = await bcrypt.hash(password, 10);
      User.create(data).then((user) => {
        // return res.status(201).json(user);
        //toredirect to login page
        //no need for the session to redirect to login
        //only use the return res.redirect("/login");
        req.session.navin = user;
        return res.redirect("/home");
      });
    } else {
      //username check
      pagedata.errormsg = "Username or email already taken..!";
      res.status(200).render("register", pagedata);
    }
  } else {
    pagedata.errormsg = "Make Sure each fiel as a valid value";
    res.status(200).render("register", pagedata);
  }
});
module.exports = router;
