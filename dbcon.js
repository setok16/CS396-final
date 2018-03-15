require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

var userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  joined: Date,
  books: [String]
});
var User = mongoose.model('User', userSchema);

var bookSchema = mongoose.Schema({
  isbn: { type: String, unique: true },
  title: String,
  author: String,
  pages: Number,
  rating: Number
});
var Book = mongoose.model('Book', bookSchema);

module.exports.User = User;
module.exports.Book = Book;
