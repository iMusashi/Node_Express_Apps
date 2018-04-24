var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Yellow Tent",
            image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350",
            description: "Yellow Tent beneath a blue sky, I would jump endlessly at the sight of it."
        },
        {
            name: "Green Tent",
            image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350",
            description: "Green Tent beneath a blue sky on top  of a mountain?, I would jump more endlessly at the sight of it."
        },
        {
            name: "Blue Tent",
            image: "https://images.pexels.com/photos/14287/pexels-photo-14287.jpeg?auto=compress&cs=tinysrgb&h=350",
            description: "Oooo, that sky."
        }
    ]

function seedDB(){
  Campground.remove(function(err){
     if(err){
         console.log(err);
     }
     console.log("Removed Campgrounds!");
         data.forEach(function(seed){
            Campground.create(seed,function(err, campground){
                if(err){
                  console.log(err);
                } else{
                     console.log("added a Campground!");
                     Comment.create(
                         {
                            text: "This place has no Internet! :(",
                            author: "Keshav"
                         }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                            }
                         });
                } 
            });
        });
  });  
  
};

module.exports = seedDB;