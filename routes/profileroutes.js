const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/usersschema");
const router = express.Router();
router.get("/", (req, res) => {
  const pagedata = {
    tittle: "Profile Page",
    UserDetails: req.session.navin,
    UserDetailsJson: JSON.stringify(req.session.navin),
    ProfileUser: req.session.navin,
  };
  res.status(200).render("profilepage", pagedata);
});
router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const pagedata = await getuserinfo(username, req.session.navin);
  res.status(200).render("profilepage", pagedata);
});
async function getuserinfo(username, userloggedin) {
  const isobjectid = mongoose.Types.ObjectId.isValid(username);
  const query = isobjectid ? { _id: username } : { username: username };
  const user = await User.findOne(query);
  if (user == null) {
    return {
      tittle: "Profile not Found!!",
      UserDetails: userloggedin,
      UserDetailsJson: JSON.stringify(userloggedin),
    };
  }
  return {
    tittle: user.username,
    UserDetails: userloggedin,
    UserDetailsJson: JSON.stringify(userloggedin),
    ProfileUser: user,
  };
}
module.exports = router;
