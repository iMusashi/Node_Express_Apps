var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

var friends = ["Pranoti", "Nisha", "Haritha", "Ruta"];

app.set("view engine", "ejs");

app.get("/",function(req, res){
   res.render("home");  
});

app.get("/friends", function(req, res){
    res.render("friends", {friendsList:friends}); 
});

 app.post("/createFriend",function(req, res){
     var newFriend = req.body.friendName;
     friends.push(newFriend);
     res.redirect("/friends");
 });


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started!"); 
});