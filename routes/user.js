  var express    = require("express");
  var router     = express.Router();
  var User = require("../models/user");
  var Cuisine = require("../models/cuisine");
  var middleware = require("../middleware");
  var geocoder = require("geocoder");
  var multer = require('multer');
  var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });


  var imageFilter = function (req, file, cb) {
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

   router.get("/user/:id", function(req, res){
     User.findById(req.params.id, function(err, foundUser){
         if(err) {
             req.flash("error","Something went wrong!");
             res.redirect("/");
         }
         Cuisine.find().where("author.id").equals(foundUser._id).exec(function(err, cuisines){
              if(err) {
                req.flash("error","Something went wrong!");
                res.redirect("/");
            }
            res.render("user/show", {user: foundUser, cuisines: cuisines});
         });
     });
  });


  router.put("/user/profilePicUpload/:id",middleware.isLoggedIn, upload.single('image-file'), function(req,res){
     
     let image = null;
     cloudinary.uploader.upload(req.file.path, function(result) {
            // add cloudinary url for the image to the cuisine object under image property
            image = result.secure_url;
            User.findByIdAndUpdate(req.params.id, {$set: {avatar: image}}, function(err){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                //req.flash("success","Successfully Updated!");
                res.redirect("/user/profilePicUpload/"+req.params.id+"?avatar="+image);
            }
        });
      });
     
   });

  router.get("/user/profilePicUpload/:id", function(req, res){
    res.render("user/uploadComplete");
  });

    module.exports = router;
  

  