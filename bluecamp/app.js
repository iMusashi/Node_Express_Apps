var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var SeedDB = require("./seeds");

mongoose.connect("mongodb://localhost/blue_camp");
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
SeedDB();

app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds",function(req, res){
    Campground.find({},function(err,campgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/index", {campgrounds:campgrounds});
       }
    });
});

app.post("/campgrounds", function(req, res){
   var newCampName        = req.body.campName;
   var newCampLink        = req.body.campLink;
   var newCampDescription = req.body.campDescription;
   var newCampground = {name: newCampName, image: newCampLink, description: newCampDescription};
   Campground.create(newCampground, function(err,campground){
           if(err){
               console.log(err);
           }else{
               res.redirect("/campgrounds");
           }
       });
});

app.get("/campgrounds/new",function(req, res){
   res.render("campgrounds/new"); 
});

app.get("/campgrounds/:id",function(req, res){
     var campId = req.params.id;
     Campground.findById(campId).populate("comments").exec(function(err,foundCampground){
         if(err){
             console.log(err);
         }else{
             console.log(foundCampground);
             res.render("campgrounds/show",{campground:foundCampground});
         }
     }) ;
});

//=============================================================
// COMMENT ROUTES
//=============================================================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            res.render("comments/new", {campground: campground});
        }        
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           res.redirect("/campgrounds/"+ req.params.id);
       } else{
           var comment = req.body.comment;
           Comment.create(comment,function(err, comment){
               if(err){
                   res.redirect("/campgrounds/"+ req.params.id);
               }else{
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + req.params.id);
               }
           });
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
   console.log("Server has started!"); 
});