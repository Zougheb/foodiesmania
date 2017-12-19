var mongoose = require ("mongoose");
var Cuisine = require ("./models/cuisine");
var Comment = require("./models/comment");

var data = [
    {
      name:"Ellabadia",
      image:"https://images.pexels.com/photos/8758/food-dinner-lemon-rice.jpg?h=350&auto=compress&cs=tinysrgb",
      description:"bla bla bla nla nnla"
   },
   {
       name:"serso",
      image:"https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?h=350&auto=compress&cs=tinysrgb",
      description:"wewewrwrwrwrwrw"
   },
   {
       name:"elmansurah",
      image:"https://images.pexels.com/photos/72160/bbq-dinner-grilled-grill-72160.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb",
      description:"tatatatatatattat"
   }
      
];

function seedDB(){
    // Remove all cuisines
    Cuisine.remove({}, function(err){
      // if(err) {
      //   console.log(err);
      // }
      // console.log("removed cuisines!");
      // // add a few cuisines
      //   data.forEach(function(seed){
      //       Cuisine.create(seed, function(err, cuisine){
      //           if(err){
      //               console.log(err)+
      //           } else {
      //               console.log("added a cuisine");
      //               // create a comment
      //               Comment.create(
      //                   {
      //                       text:"This is very good!!",
      //                       author:"Mazen"
      //                   }, function(err, comment){
      //                       if(err){
      //                           console.log(err);
      //                       } else {
      //                           cuisine.comments.push(comment);
      //                           cuisine.save();
      //                           console.log("created new comment!");
      //                       }
      //               });
      //           }
      //       });
      //   });
   });
}

module.exports = seedDB;