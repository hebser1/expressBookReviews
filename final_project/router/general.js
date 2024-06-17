const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  let name = req.body.username;
  let password = req.body.password;
  console.log(req.body);
  console.log(name);
  console.log(password);

  if (name == null || password == null) {
    return res.status(404).json({ message: "Provide user and password" });
  }
  else {
    let tempUsers = users.filter((user) => {
      return user.username === name;
    })
    if (tempUsers.length > 0) {
      res.status(404).json({ message: "User already exists!" });
    }
    else {
      users.push({ "username": name, "password": password });
      return res.status(200).json({ message: "Registration successfully" });
    }
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await new Promise(resolve => setTimeout(resolve, 0));
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => {
    res.send(JSON.stringify(book));
  })
  .catch(err => {
    res.status(500).json({message: "Error"});
  });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const authorbooks = [];
  new Promise((resolve, reject) => {
    for(book of Object.entries(books)) {
      const details = book[1];
      if(details['author'] === author){
        authorbooks.push(book);
      }
    }
    if(authorbooks.length > 0) {
      resolve(authorbooks);
    } else {
      reject("Book not found.");
    }
  }).then(authorBooks => {
    res.send(JSON.stringify(authorbooks, null, 4));
  })
  .catch(err => {
    return res.status(500).json({message: "Error"});
  })
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const titlebooks = [];
  new Promise((resolve, reject) => {
    for(book of Object.entries(books)) {
      const details = book[1];
      if(details['title'] === title){
        titlebooks.push(book);
      }
    }
    if(titlebooks.length > 0) {
      resolve(titlebooks);
    } else {
      reject("Book not found");
    }
  }).then(titlebooks => {
    res.send(JSON.stringify(titlebooks, null, 4));
  })
  .catch(err => {
    return res.status(500).json({message: "Error"});
  })
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let ISBN = req.params.isbn;
  let review = "";
  if (ISBN) {
    let book = books[ISBN];
    review = book.reviews;
  }
  res.send(JSON.stringify(review));
});

module.exports.general = public_users;
