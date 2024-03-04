const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user with the provided username
  const user = users.find(user => user.username === username);

  // Check if the user exists and the password is correct
  if (user && user.password === password) {
    // Create a JWT token with the username
    const token = jwt.sign({ username: user.username }, "access");

    // Return the token in the response
    return res.status(200).json({ token });
  }

  // Return an error if the username or password is incorrect
  return res.status(401).json({ message: "Invalid username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract the token from the authorization header
  const { review } = req.query; // Extract the review from the query parameters
  const isbn = req.params.isbn; // Extract the ISBN from the URL parameter

  // Verify the JWT token to get the username
  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const username = decoded.username;

    // Find the book in the books array
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    let userReview = book.reviews.find(r => r.username === username);

    // If the user has already reviewed the book, update the existing review
    if (userReview) {
      userReview.review = review;
    } else {
      // If the user has not reviewed the book, add a new review
      book.reviews.push({ username, review });
    }

    return res.status(200).json({ message: "Review added successfully" });
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
