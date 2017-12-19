var express    = require("express");
var router     = express.Router();
var Cuisine = require("../models/cuisine");
var Comment    = require ("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/cuisines/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find cuisine by id
    Cuisine.findById(req.params.id, function(err, cuisine){
        if(err){
        console.log(err);
        } else{
            res.render("comments/new",{cuisine: cuisine});
        }
    });
});

// Comments Create
router.post("/cuisines/:id/comments", middleware.isLoggedIn, function(req, res){
    Cuisine.findById(req.params.id, function(err, cuisine){
        if(err){
            console.log(err);
            res.redirect("/cuisines");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    cuisine.comments.push(comment);
                    cuisine.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/cuisines/" + cuisine._id);
                }
            });
        }
    });
});

// COMMENTS EDIT ROUTES
router.get("/cuisines/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Cuisine.findById(req.params.id, function(err, foundCuisine){
       if(err || !foundCuisine){
           req.flash("error", "No cuisine found");
           return res.redirect("back");
       }
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
            res.redirect("back");
         } else {
             res.render("comments/edit", {cuisine_id: req.params.id, comment: foundComment});
         }
    });
   });
});

// COMMENTS UPDATE
router.put("/cuisines/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/cuisines/" + req.params.id );
      }
   });
});

// COMMENTS DELET
router.delete("/cuisines/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/cuisines/" + req.params.id);
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

function checkCommentOwnership(req, res, next){
    // is user logged in?
       if(req.isAuthenticated()){
           Comment.findById(req.params. comment_id, function(err,foundComment){
                if(err){
                    
            res.redirect("/cuisines");
       } else{
             //   does the user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
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