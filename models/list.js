var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
  movies: [
    {
      title: String,
      poster: String
    }
  ],
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('List', listSchema)
