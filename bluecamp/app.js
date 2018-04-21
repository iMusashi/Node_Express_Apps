var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/blue_camp");
app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create( 
//     {
//         name: "Giraween",
//         image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
//         description: "This is 'The Giraween'"
//     }, function(err, campground){
//       if(err){
//           console.log(err);
//       } else{
//           console.log("Successfully created Campground");
//           console.log(campground);
//       }
//     });


app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds",function(req, res){
    Campground.find({},function(err,campgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("index", {campgrounds:campgrounds});
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
   res.render("new.ejs"); 
});

app.get("/campgrounds/:id",function(req, res){
     var campId = req.params.id;
     Campground.findById(campId, function(err,foundCampground){
         if(err){
             console.log(err);
         }else{
             res.render("show",{campground:foundCampground});
         }
     });
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
   console.log("Server has started!"); 
});