const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
 
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(req.session.authenticated){
        let token = req.session.authenticated['accessToken'];
        jwt.verify(token,'access', (err, users)=>{
            if(!err){
                req.users = users;
                next();
            }
            else{
                return res.send("user not authenticated");
            }
        }
        )
    }
    else{
        return res.send("user not logged in");
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
