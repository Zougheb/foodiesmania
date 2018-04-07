  const express  = require("express");
  const router   = express.Router();
  const passport = require ("passport");
  const User     = require ("../models/user");
  const Cuisine  = require ("../models/cuisine");

  // root route
  router.get("/",  (req, res) => {
      res.render("landing");
  });

  // SHOW REGISTER FORM
  router.get("/register", (req, res) => {
      res.render("register", {page: "register"});
  });

  // Handle Sign Up Logic
  router.post("/register", (req, res) => {
      let newUser = new User({
              username: req.body.username,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              avatar: req.body.avatar

          });
       if(req.body.adminCode === "1980"){
           newUser.isAdmin = true;
       }
      User.register(newUser, req.body.password,(err, user) => {
          if(err){
              req.flash("error", err.message);
              return res.redirect("/register");
          }
          passport.authenticate("local")(req, res, () => {
              req.flash("success", "Welcome to Foodsnap " + user.username);
              res.redirect("/cuisines");
          });
      });
  });

  // SHOW LOGIN FORM
  router.get("/login", (req, res) => {
      res.render("login", {page: "login"});
  });


// LOGOUT ROUTES AND LOGIC
  router.get("/logout", (req, res) => {
      req.logout();
      req.flash("success", "We will miss you :( ");
      res.redirect("/cuisines");
  });
  // handling login logic
  router.post("/login", passport.authenticate("local",
       {
           successRedirect: "/cuisines",
           failureRedirect: "/login"
  }), (req, res) => {
  });


  module.exports = router;
