var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var SeedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/blue_camp");
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); 
app.set("view engine", "ejs");
app.use(flash());
//SeedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I will show you how great I am!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(req, res){
   console.log("Server has started!"); 
});