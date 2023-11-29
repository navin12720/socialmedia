const express = require("express");
const router = express.Router();
router.get("/:id", (req, res) => {
  const pagedata = {
    tittle: "Post Page",
    UserDetails: req.session.navin,
    UserDetailsJson: JSON.stringify(req.session.navin),
    postid: req.params.id,
  };
  res.status(200).render("postpage", pagedata);
});
module.exports = router;
