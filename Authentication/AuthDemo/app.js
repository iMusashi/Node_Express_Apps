var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');

mongoose.connect("mongodb://localhost/authdemoapp");

var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret: "Porsche is the car I will buy someday.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes

app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/secret",isLoggedIn,  function(req, res){
   res.render("secret"); 
});

//Authorization Routes
 app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
               res.redirect("/secret"); 
            });
        }
    });
});

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){ 
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("Server started");
});