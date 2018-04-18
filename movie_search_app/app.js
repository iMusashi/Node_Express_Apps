var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("search"); 
});

app.get("/results", function(req, res){
    var movieToSearch = req.query.movieName;
    console.log(movieToSearch);
    request("http://www.omdbapi.com/?s=" + movieToSearch +"&apikey=dbb6b8b5", function(error, response, body){
       if(!error && response.statusCode == 200)
       {
           var parsedData = JSON.parse(body);
           res.render("results", {movies:parsedData});
       }
    });
});


app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server has started!");
});