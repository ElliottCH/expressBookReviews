const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userWithName = users.filter((user) => user.username === username)
  return userWithName.length > 0 ? false : true
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let userMatchingName = users.filter((user) => user.username === username)
  if(userMatchingName.length > 0 && userMatchingName[0].password === password) {
    return true
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username
  let password = req.body.password
  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password,
    }, 'access', {expiresIn: 60 * 60 })
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (books[isbn].reviews.hasOwnProperty(username)) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review edited"})
  } else {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added"})
  }

});

// delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  if(!books[isbn]) {
    return res.status(404).json({message: "Book not found"})
  }
  if(!books[isbn].reviews[username]) {
    return res.status(404).json({message: "Could not find a review associated with this user"})
  } else {
    delete books[isbn].reviews[username]
    return res.status(200).json({message: "Review deleted successfully"})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
