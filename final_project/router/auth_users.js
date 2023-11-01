const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
 
let users = [];

const isValid = (username)=>{ //returns boolean
  let filterUser = users.filter(user=>user.username === username);
  if(filterUser.length > 0){
    return true;
  }
  else{
    false; 
  }
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let filteredUser = users.filter((user)=>{
    return (user.username === username && user.password === password);
  })
  if(filteredUser.length > 0){
    return true;
  }
  else{
    return false;
  }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username  = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign(
      { data : password},
      'access',
      { expiresIn : 60 * 60}
    )

    req.session.authenticated = {
      accessToken, username
    }
    return res.send({message: "User Successfully logged in"});
  }
  else{
    res.send("Invalid username or password")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let ISBN = req.params.isbn;
  let username  =req.session.authenticated.username;
  let review = req.body.review;

  books[ISBN].reviews[username] = review
  return res.status(200).json({message: "review successfully added: reveiw = " + review});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;
  let username  =req.session.authenticated.username;

  if(books[ISBN]){
    if(books[ISBN].reviews[username]){
      delete books[ISBN].reviews[username];
      return res.send({message: "review is deleted"});
    }
    else{
      return res.send({message: "this user has not any reviews"});
    }
  }
  else{
    return res.send({message: "this book does not exist"});
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
