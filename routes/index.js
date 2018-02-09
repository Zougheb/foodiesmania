  var express  = require("express");
  var router   = express.Router();
  var passport = require ("passport");
  var User     = require ("../models/user");
  var Cuisine     = require ("../models/cuisine");

  // root route
  router.get("/", function (req, res){
      res.render("landing");
  });

  // SHOW REGISTER FORM
  router.get("/register", function(req, res){
      res.render("register", {page: "register"});
  });

  // Handle Sign Up Logic
  router.post("/register", function(req, res){
      var newUser = new User({
              username: req.body.username,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              avatar: req.body.avatar

          });
       if(req.body.adminCode === "1980"){
           newUser.isAdmin = true;
       }
      User.register(newUser, req.body.password,function(err, user){
          if(err){
              req.flash("error", err.message);
              return res.redirect("/register");
          }
          passport.authenticate("local")(req, res, function(){
              req.flash("success", "Welcome to Foodsnap " + user.username);
              res.redirect("/cuisines");
          });
      });
  });

  // SHOW LOGIN FORM
  router.get("/login", function(req, res){
      res.render("login", {page: "login"});
  });


// LOGOUT ROUTES AND LOGIC
  router.get("/logout", function(req, res){
      req.logout();
      req.flash("success", "We will miss you :( ");
      res.redirect("/cuisines");
  });
  // handling login logic
  router.post("/login", passport.authenticate("local",
       {
           successRedirect: "/cuisines",
           failureRedirect: "/login"
  }), function(req, res){
  });


  module.exports = router;
