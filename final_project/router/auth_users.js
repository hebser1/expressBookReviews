const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "test1", password: "pw1" },
{ username: "test2", password: "pw2" }];

const isValid = (username, password) => {
}

const authenticatedUser = (username, password) => {
  let tempUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (tempUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  let user = req.body.username;
  let password = req.body.password;
  console.log(user);
  console.log(password);

  if (authenticatedUser(user, password)) {
    let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 3600 });

    req.session.authorization = {
      accessToken, user
    };
    return res.status(200).send("Login successfully");
  } else {
    return res.status(208).json({ message: "Login failed" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(401).json({ message: "You must logged in for this." });
  }

  const user = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  let book = books[isbn];
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[user] = review;

  return res.status(200).json({ message: "Review edited" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(401).json({ message: "You must logged in for this." });
  }

  const user = req.session.authorization.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let book = books[isbn];
  if (!book.reviews) {
    book.reviews = {};
  }

  let review = book.reviews[user];
  book.reviews[user] = {};
  return res.status(200).json({ message: "Review deleted"});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
