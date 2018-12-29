  const express          = require("express"),
        app              = express(),
        bodyParser       = require("body-parser"),
        db               = require("./models");
        flash            = require("connect-flash"),
        passport         = require("passport"),
        LocalStrategy    = require("passport-local"),
        methodOverride   = require("method-override"),
        Cuisine          = require ("./models/cuisine"),
        Comment          = require ("./models/comment"),
        User             = require("./models/user"),
        PORT             = process.env.PORT || 8080,
        dotenv           = require('dotenv').config(),
        commentRoutes    = require("./routes/comments"),
        cuisineRoutes    = require("./routes/cuisines"),
        userRoutes       = require("./routes/user"),
        indexRoutes      = require("./routes/index");

  
  
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "ejs");
  app.use(methodOverride("_method"));
  app.use(flash());
  

  // Use moment.js
  app.locals.moment = require('moment');

  // PASSPORT CONFIG
  app.use(require("express-session")({
     secret:" Nala is the Best",
     resave: false,
     saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.use((req, res, next)=> {
     res.locals.currentUser = req.user;
     res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");
     next();
  });

  app.use(indexRoutes);
  app.use(cuisineRoutes);
  app.use(commentRoutes);
  app.use(userRoutes);

  app.listen(PORT, function(){
      console.log(`Server is starting on port ${PORT}`);
  });
