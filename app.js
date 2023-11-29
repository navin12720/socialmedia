const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const connectdb = require("./db/connect");
const session = require("express-session");
require("dotenv").config();
const middleware = require("./middleware/middleware");
const app = express();
const port = process.env.PORT;
app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Navin",
    resave: true,
    saveUninitialized: false,
  })
);
const staticuri = path.join(__dirname, "public");
app.use(express.static(staticuri));
//router
const registroute = require("./routes/registerroute");
const loginroute = require("./routes/loginroute");
const logoutroute = require("./routes/logoutroute");
const postRoute = require("./routes/postroutes");

app.use("/register", middleware.islogin, registroute);
app.use("/login", middleware.islogin, loginroute);
app.use("/logout", logoutroute);
app.use("/post", middleware.isAlreadylogin, postRoute);
//homepage
app.get(["/", "/home"], middleware.isAlreadylogin, (req, res) => {
  const pagedata = {
    tittle: "Home Page",
    UserDetails: req.session.navin,
    UserDetailsJson: JSON.stringify(req.session.navin),
  };
  res.status(200).render("home", pagedata);
});
//setting
app.get("/settings", middleware.isAlreadylogin, (req, res) => {
  const pagedata = {
    tittle: "Settings Page",
    UserDetails: req.session.navin,
  };
  res.status(200).render("settings", pagedata);
});
//API route
const Postapiroute = require("./routes/api/post");
app.use("/api/post", Postapiroute);
app.listen(port, () => {
  console.log(`sever connected to the port${port}`);
});
