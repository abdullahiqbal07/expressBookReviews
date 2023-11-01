const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({ 'username': username, 'password': password });
      res.send({message : `User with username ${username} is added`});
    }
    else{
      res.send("user already registered")
    }
  }
  else{
    res.send("Unable to registered user");
  }
});
 
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let filteredBook = books[req.params.isbn];
  if(filteredBook) {
    return res.send(filteredBook);
  }
  else{
    return res.send({message: "this is not a valid book"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  //  const author = req.params.author;
  // let booksWithSameAuthor = {};
  // for (let key in books){
  //   if (books[key]["author"] === author){
  //     booksWithSameAuthor[`${key}`] = books[key];
  //   }
  // }
  // return res.status(300).json(booksWithSameAuthor);

  let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){        
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(ans);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // let titleHere = {};
  // for(let key in books){
  //   if(books[key]['title'] === req.params.title){
  //     titleHere[`${key}`] = books[key];
  //   }
  // }
  // res.send(titleHere);

  let ans = []
    for(const [key, values] of Object.entries(books)){
        const titles = Object.entries(values);
        // for(let i = 0; i < titles.length ; i++){
            if(titles[1][0] == 'title' && titles[1][1] == req.params.title){        
                ans.push(books[key]);
            }
        // }  
    }
    if(ans.length == 0){
        return res.send({message: "title not found"});
    }
    res.send(ans);



});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
  let reviews = books[ISBN].reviews; 
  return res.send({reviews: reviews});
});


// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBookList().then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );  
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn){
  let book_ = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book_) {
      resolve(book_);
    }else{
      reject("Unable to find book!");
    }    
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
 });

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.


function getFromTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
