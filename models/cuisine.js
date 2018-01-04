  var mongoose = require("mongoose");


  // SCHEMA SETUP
  var cuisineSchema =  mongoose.Schema({
      name: String,
      image: String,
      description: String,
      cost: Number,
      location: String,
      lat: Number,
      lng: Number,
      createdAt: { type: Date, default: Date.now },
      author: {
          id: {
              type: mongoose.Schema.Types.ObjectId,
              ref:"User"
          },
          username: String,
      },
      comments:[
          {
              type: mongoose.Schema.Types.ObjectId,
              ref:"Comment"
          }
      ],
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      ]

  });

  module.exports = mongoose.model("cuisine", cuisineSchema);
