var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String
  //Just user for now, add association with movie list after
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
