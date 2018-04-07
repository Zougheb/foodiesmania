  const mongoose              = require("mongoose");
  const passportLocalMongoose = require("passport-local-mongoose");


  const UserSchema = new mongoose.Schema({
      username: String,
      password: String,
      avatar: String,
      firstName : String,
      lastName: String,
      email: String,
      isAdmin: {type: Boolean, default: false}
  });

  UserSchema.plugin(passportLocalMongoose);

  const User = mongoose.model("User", UserSchema);
  module.exports = User;
