var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

//App Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public/"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//Mongoose/ Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

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

app.post("/blogs",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
           if(err){
               console.log(err);
               res.render("new");
           }else{
               res.redirect("/blogs");
           }
       });
});

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

app.get("/blogs/:id", function(req, res){
   var blogId = req.params.id;
   Blog.findById(blogId,function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show", {blog: foundBlog});
       }
   });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
     if(err){
         res.redirect("/blogs");
     }else{
        res.redirect("/blogs/" + req.params.id);
     }
   });
});

app.get("/blogs/:id/edit", function(req, res){
   var blogId = req.params.id;
   Blog.findById(blogId,function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit", {blog: foundBlog});
       }
   });
});

app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   }); 
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server has started!");
});