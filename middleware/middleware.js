exports.isAlreadylogin = (req, res, next) => {
  if (req.session && req.session.navin) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
exports.islogin = (req, res, next) => {
  if (req.session && req.session.navin) {
    return res.redirect("/home");
  } else {
    return next();
  }
};
