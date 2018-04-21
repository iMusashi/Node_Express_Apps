var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//App Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//Mongoose/ Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
// Blog.create( 
//     {
//         title: "Porsche911",
//         image: "https://imgd.aeplcdn.com/1280x720/ec/6A/97/10803/img/m/Porsche-911-Right-Front-Three-Quarter-51460_ol.jpg?t=173817237&t=173817237&q=100",
//         body: "Hello This is an Image Post!"
//     }, function(err, blog){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(blog);
//         }
//     });

app.get("/",function(req, res){
   res.redirect("/blogs"); 
});

app.get("/blogs", function(req, res){
   Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       }else{
           res.render("index", {blogs:blogs});
       }
   })
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server has started!");
});