  const  express    = require("express");
  const router      = express.Router();
  const Cuisine     = require("../models/cuisine");
  const middleware  = require("../middleware");
  const geocoder    = require("geocoder");
  const multer      = require('multer');
  const storage     = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });



  var imageFilter =  (req, file, cb) => {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var upload = multer({ storage: storage, fileFilter: imageFilter})

  var cloudinary = require('cloudinary');

  cloudinary.config({
    cloud_name: 'dv6gbxbw2',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // INDEX ROUTE -- SHOW ALL CUISINES
  router.get("/cuisines", function(req, res){
      // Get all cuisines from the DB
      Cuisine.find({}, null, {sort: '-createdAt'}, function(err, allCuisines){
          if(err){
              console.log(err);
          } else {
               res.render("cuisines/index", {cuisines: allCuisines, page: "cuisines"});
          }
      });
  });

  // CREATE -- ADD NEW CUISINE TO DB
  router.post("/cuisines",middleware.isLoggedIn, upload.single('image'),(req,res) => {
    // get data from form and add to data array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
      id: req.user._id,
      username: req.user.username
  }
    let cost = req.body.cost;

    //Location Code - Geocode Package
    geocoder.geocode(req.body.location,  (err, data)=> {
      if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
      console.log(data);
    }
      var lat        = data.results[0].geometry.location.lat;
      var lng        = data.results[0].geometry.location.lng;
      var location   = data.results[0].formatted_address;
      var newCuisine = { name, description, cost, author, location: location, lat: lat, lng: lng};
          
    cloudinary.uploader.upload(req.file.path, (result)=> {
            // add cloudinary url for the image to the cuisine object under image property
            console.log(result);
            newCuisine.image = result.secure_url;

            Cuisine.create(newCuisine, (err, cuisine) => {
              if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
              }
              return res.redirect('/cuisines');
            });
        });
    });
});


  // NEW -- SHOW FORM TO CREATE NEW CUISINES
       router.get("/cuisines/new",middleware.isLoggedIn, (req, res)=>{
           res.render("cuisines/new");

  });

  // SHOW - show more info about one cuisine
  router.get("/cuisines/:id", (req, res)=>{
      // find the cuisine with provided ID
      Cuisine.findById(req.params.id).populate("comments").exec(function(err, foundCuisine){
          if(err || !foundCuisine){
              req.flash("error", "Cuisine not found");
              res.redirect("back");
          } else{
              // render show template with that cuisine
              res.render("cuisines/show", {cuisine: foundCuisine});
          }
      });

  });

  // EDIT CUISINE ROUTE
  router.get("/cuisines/:id/edit", middleware.checkCuisineOwnership, (req, res)=>{
      Cuisine.findById(req.params.id, (err, foundCuisine) => {
          res.render("cuisines/edit", {cuisine: foundCuisine});
      });
  });


  // UPDATE CUISINE ROUTE
  router.put("/cuisines/:id", (req, res) => {
      geocoder.geocode(req.body.cuisine.location,  (err, data) => {
      if(err) {
      console.log('Error', err.message);
      console.log('Data', data);
      req.flash('error', err.message);
      return res.redirect('back');
      }
    // console.log(data);
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;
      var newData = {
          name: req.body.cuisine.name,
          image: req.body.cuisine.image,
          description: req.body.cuisine.description,
          cost: req.body.cuisine.cost,
          location: location,
          lat: lat,
          lng: lng
       };
      Cuisine.findByIdAndUpdate(req.params.id, {$set: newData}, (err, cuisine)=>{
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/cuisines");
          }
      });
    });
  });

  // DESTROY CUISINE ROUTES
  router.delete("/cuisines/:id", middleware.checkCuisineOwnership, (req, res)=>{
      Cuisine.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/cuisines");
        } else {
            res.redirect("/cuisines");
        }
     });
  });

  // middleware
  function isLoggedIn(req,res,next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect("/login");
  }

  function checkCuisineOwnership(req, res, next){
      // is user logged in?
         if(req.isAuthenticated()){
             Cuisine.findById(req.params.id, (err,foundCuisine)=>{
                  if(err){
              res.redirect("/cuisines");
         } else{
               //   does the user own the cuisine?
              if(foundCuisine.author.id.equals(req.user._id)) {
                  next();
              } else{
                  res.redirect("back");
              }
            }
          });
           } else{
              res.redirect("back");
          }
  }

  module.exports = router;