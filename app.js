 //jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const app = express();
const _ = require('lodash');  //need to npm init lodash
app.set('view engine', 'ejs');//this will be used to convert ejs to html
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//to render
 mongoose.connect("mongodb://localhost:27017/blogDB") ;//toDoDB is the name of database when connecting locally


var posts= [];


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/",function(req,res)
{

Blog.find(function(err,posts)
{
  if(err)
  {
    console.log(err);
  }
  else{
    res.render("home",{cont:homeStartingContent,posts:posts});//passing variables are ejs page key and its value pair these may be considered as object


  }

});


})

app.get("/about",function(req,res)
{
  res.render("about",{cont:aboutContent});//passing variables are ejs page and key value pair
})

app.get("/contact",function(req,res)
{
  res.render("contact",{cont:contactContent});//passing variables are ejs page and key value pair
})

const blogschema= new mongoose.Schema(//s is capital
{
    bTitle:String,
    bBody :String
});


const Blog =mongoose.model("Blog",blogschema);



app.get("/compose",function(req,res)
{
  res.render("compose");//passing variables are ejs page and key value pair
})

app.post("/compose",function(req,res)
{
  var post=
  {
    body:req.body.blogBody,
    title:req.body.blogTitle

}
if(post.body.length>0||post.title.length>0)
{
  const nEntry=new Blog({
    bTitle:post.title,
    bBody:post.body
  });
  nEntry.save(function(err)//so that when save is complete then only it should redirect to /
{
  if(!err)
  {
    res.redirect("/");
  }
});
}




});
//dynamic routing
app.get("/posts/:key",function(req,res)//here key is the value that will be changing in our link key is not any specific key it can be named anything
{
  const tempreq= _.lowerCase(req.params.key);
  var temp=0;
  Blog.find(function(err,posts){


    for(var i=0;i<posts.length;i++)

    {const tempa= _.lowerCase(posts[i].bTitle);


      if(tempa===tempreq)
      {
        const bod=posts[i].bBody;

         res.render("lookpost",{postTitle:posts[i].bTitle,postBody:bod});
         // res.render("lookpost",{postTitle:"title",postBody:"body"});
        temp=1;
        break;
      }
    }
    if(temp!=1)
    {

      res.send("no such post exists");
    }

  });

});

// app.get("/posts/:postName", function(req, res){
//   const requestedTitle = _.lowerCase(req.params.postName);
//
//   posts.forEach(function(post){
//     const storedTitle = _.lowerCase(post.title);
//
//     if (storedTitle === requestedTitle) {
//       res.render("lookpost", {
//         postTitle: post.title,
//         postBody: post.body
//       });
//     }
//   });
//
// });


// _.lowerCase('fBar');










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
