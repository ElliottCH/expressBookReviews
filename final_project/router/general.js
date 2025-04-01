const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(isValid(username)) {
      users.push({"username": username, "password": password})
      res.status(200).json({ message:  "User successfully registered. Now you can login" })
    } else {
      res.status(401).json({ message: "Username already exist" })
    }
  } else {
    res.status(401).json({ message: "Username and password are required" })
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if(book) {
    res.send(JSON.stringify(book, null, 4))
  } else {
    res.status(404).json({ message: "Book not found" })
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = decodeURIComponent(req.params.author)
  const normalizedAuthor= author.normalize('NFC')
  const bookByAuthor = Object.values(books).filter(book => {
    const normalizedBookAuthor = book.author.normalize('NFC')
    return normalizedBookAuthor.toLowerCase() === normalizedAuthor.toLowerCase()
  })
  if(bookByAuthor.length > 0) {
    res.send(JSON.stringify(bookByAuthor, null, 4))
  } else {
    res.status(404).json({ message: "Book not found" })
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title)
  const normalizedTitle = title.normalize('NFC')
  const bookByTitle = Object.values(books).filter(book => {
    const normalizedBookTitle = book.title.normalize('NFC')
    return normalizedBookTitle.toLowerCase() === normalizedTitle.toLowerCase()
  })
  if(bookByTitle.length > 0) {
    res.send(JSON.stringify(bookByTitle, null, 4))
  } else {
    res.status(404).json({ message: "Book not found" })
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if(book) {
    res.send(JSON.stringify(book.reviews, null, 4))
  } else {
    res.status(404).json({ message: "Book not found" })
  }
});

module.exports.general = public_users;
