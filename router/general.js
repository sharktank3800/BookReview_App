const express = require("express");
const axios = require("axios")
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and Password is required"})
  }
  if (isValid(username)){
    return res.status(400).json({message: "User already exists"})
  }
  users.push({username: username, password: password})
  return res.status(201).json({message: "User registered successfully Please Login."})
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e)
  }
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const book = await books[isbn]
  if (book) {
    return res.send(book);
  }
  return res.status(404).json({ message: "isbn not found" });
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const authorBook = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if(authorBook.length > 0){
    return res.status(200).json(authorBook);
  }
  return res.status(404).json({message: "No books by that author."})
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const title = Object.values(await books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];

  if(title){
    return res.status(200).json(title);
  };
  return res.status(404).json({message: "Title not found."})
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn].reviews)
  }
  return res.status(404).json({message: "No review found for the ISBN"})
});

module.exports.general = public_users;
