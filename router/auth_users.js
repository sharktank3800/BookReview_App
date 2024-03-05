const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  )
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Missing username and password" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged In");
  } else{
    return res.status(208).json({message: "Invalid Login Check Username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  if (!review) {
    return res.status(400).json({message: "Review is Empty!"})
  }
  books[isbn].reviews[user] = review;
  res.status(200).json({message: "Book review Updated"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
