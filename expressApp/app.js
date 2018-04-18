var express = require('express');
var app = express();

app.get("/",function(req, res){
   res.send("Hi there, welcome to my assignment!"); 
});

app.get("/speak/:animal",function(req, res){
    var sounds = {
      pig: "Oink",
      cow: "Moo",
      lion: "Roar",
      cat: "Meow",
      dog: "Woof Woof",
    };
   console.log(req.params.animal);
   var animal = req.params.animal.toLowerCase();
   var sound = sounds[animal];
   
   res.send("The " + animal + " says '" + sound + "'");
});

app.get("/repeat/:word/:num",function(req, res){
   var num = req.params.num;
   var word = req.params.word;
   var str = "";
   for(var i = 0; i < num; i++){
       str += word + " ";
   }
   res.send(str);
});

app.get("*",function(req, res){
   res.send("Sorry, page not found...What are you doing with your life?");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
})