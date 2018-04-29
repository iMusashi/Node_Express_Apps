//=============================================================
// Campgrounds ROUTES
//=============================================================
var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var Campground = require("../models/campground");
var expressSanitizer = require("express-sanitizer");
var middleware = require("../middleware");

app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true}));
//show all campgrounds
router.get("/", function(req, res){
    Campground.find({},function(err,campgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/index", {campgrounds:campgrounds});
       }
    });
});

//create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
   var name         = req.body.campName;
   var image        = req.body.campLink;
   var desc         = req.body.campDescription;
   var price        = req.body.campPrice;
   var author       = {
       id: req.user._id,
       username: req.user.username
   }
   
   var newCampground = {name: name,
                        image: image,
                        price: price,
                        description: desc,
                        author: author
   };
   Campground.create(newCampground, function(err,campground){
           if(err){
               console.log(err);
           }else{
               res.redirect("/campgrounds");
           }
       });
});

//show new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

//show campground
router.get("/:id",function(req, res){
     var campId = req.params.id;
     Campground.findById(campId).populate("comments").exec(function(err,foundCampground){
         if(err){
             console.log(err);
         }else{
             res.render("campgrounds/show",{campground:foundCampground});
         }
     }) ;
});

//Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error","Campground not found");
        } else{
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

//Update Route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // req.body.camp.body = req.sanitize(req.body.camp.body);
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Destory Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;