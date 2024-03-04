const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn]);
  }
  return res.status(404).json({ message: "isbn not found" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksKeys = Object.keys(books);

  for (let i = 0; i < booksKeys.length; i++) {
    const bookId = booksKeys[i];
    const book = books[bookId];

    if (book.author === author) {
      return res.send(book);
    }
  }

  return res.status(404).send("Book not found for the author");
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title === title);

  if (titleBooks.length > 0) {
    return res.send(titleBooks)
  }

  return res.status(404).json({message: "No books found with the title"})
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
