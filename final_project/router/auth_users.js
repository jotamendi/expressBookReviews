const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/**  
 * Can contain letters, numbers, and underscores
 * Cannot start with a number or underscore
 * Must start with a letter */
const usernameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;

const isValid = (username)=>{ 
  let alreadyExists = users.filter( usr => user.username === username)
  return usernameRegex.test(username) && !(alreadyExists.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let newReview = req.body.review;
    const user = req.session.authorization.username;

    if (!newReview) {
        return res.status(400).json({ message: "Review is required" });
    }
    
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[user] = newReview;

    return res.status(200).json({ message: "Review added/updated successfully",
        reviews: books[isbn].reviews[user]
      });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    const user = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[user]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[user];

    return res.status(200).json({ message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
