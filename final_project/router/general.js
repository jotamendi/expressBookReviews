const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User not Valid!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/**
  public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});
*/

// Get the book list available in the shop -> task-10
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    if (books) {
      resolve(books); 
    } else {
      reject("No books found");
    }
  });

  get_books
    .then((data) => {
      console.log("Promise for Task 10 resolved");
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Error fetching books" });
    });
});

// Get book details based on ISBN
/* 
  public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if(isbn) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(400).json({message: "Bad Request"});
  }
 });
*/

// Get book details based on ISBN -> task-11
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  const get_books = new Promise((resolve, reject) => {
    if(isbn && books[isbn]) {
      resolve(books[isbn]); 
    } else if(books[isbn].length <1) {
      reject(new Error("Not Found"));
    } else{
      reject(new Error("Bad Request"));
    }
  });

  get_books
    .then((data) => {
      console.log("Promise for Task 10 resolved");
      return res.status(200).json(data);
    })
    .catch((err) => {
      if(err.message === "Bad Request") {
        return res.status(400).json({ error: "Bad Request" });
      } else {
        return res.status(500).json({ error: "Error fetching books" });
      }
    });
});
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  if(author) {
    let bookByAuthor = null;
    let found = false;
    Object.values(books).forEach(value => {
      if(value.author === author){
        bookByAuthor = value;
        found = true;
      }
    })
    if(found) {
      return res.status(200).json(bookByAuthor);
    } else {
      return res.status(404).json({message: `${author} Not Found`});
    }
  } else {
    return res.status(400).json({message: "Bad Request"});
  }
});
*/

// Get book details based on author -> task-12
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  const get_books = new Promise((resolve, reject) => {
    if(author) {
      let bookByAuthor = null;
      let found = false;
      Object.values(books).forEach(value => {
        if(value.author === author){
          bookByAuthor = value;
          found = true;
        }
      });
      if (found) {
        resolve(bookByAuthor); 
      } else {
        reject(new Error("Not Found"));
      }
    } else {
      reject(new Error("Bad Request"));
    }
  });

  get_books
    .then((data) => {
      console.log("Promise for Task 10 resolved");
      return res.status(200).json(data);
    })
    .catch((err) => {
      if (err.message === "Not Found") {
        return res.status(404).json({ error: "Not Found" });
      } else if(err.message === "Bad Request") {
        return res.status(400).json({ error: "Bad Request" });
      } else {
        return res.status(500).json({ error: "Error fetching books" });
      }
    });
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  if(title) {
    let bookByTitle = Object.values(books).find(value => value.title === title);
    if(bookByTitle) {
      return res.status(200).json(bookByTitle);
    } else {
      return res.status(404).json({message: `${title} Not Found`});
    }
  } else {
    return res.status(400).json({message: "Bad Request"});
  }
});
*/
// Get all books based on title -> task-13
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  const get_books = new Promise((resolve, reject) => {
    if(title) {
      let bookByTitle = Object.values(books).find(value => value.title === title);
      if(bookByTitle) {
        resolve(bookByTitle); 
      } else {
        reject(new Error("Not Found"));
      }
    } else {
      reject(new Error("Bad Request"));
    }
  });

  get_books
    .then((data) => {
      console.log("Promise for Task 10 resolved");
      return res.status(200).json(data);
    })
    .catch((err) => {
      if (err.message === "Not Found") {
        return res.status(404).json({ error: "Not Found" });
      } else if(err.message === "Bad Request") {
        return res.status(400).json({ error: "Bad Request" });
      } else {
        return res.status(500).json({ error: "Error fetching books" });
      }
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(400).json({message: "Bad Request"});
  }
});

module.exports.general = public_users;
