var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//root route
router.get("/", function(req, res){
   res.render("landing"); 
});

//AUTH ROUTES
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    //Register creates the has of the password.
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","welcome to BlueCamp " + newUser.username);
            res.redirect("/campgrounds");
        });
    });
});


//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login
router.post("/login", passport.authenticate("local", 
{ successRedirect: "/",
  failureRedirect: "/login"
}),function(req, res){
});

//handle logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;