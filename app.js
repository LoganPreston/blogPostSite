//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

//starting content
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
//const posts = [];

//express and ejs setup
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose / mongodb setup
mongoose.connect("mongodb://localhost:27017/compositionsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const compositionSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Composition = mongoose.model("Composition", compositionSchema);

//GET requests
//root page
app.get("/", function (req, res) {
  Composition.find(function (err, posts) {
    if (err) {
      console.log(err);
    }
    if (posts.length === 0) {
      res.render("home", { home: homeStartingContent, blogPosts: [] });
    } else {
      res.render("home", { home: homeStartingContent, blogPosts: posts });
    }
  });
});

//about page
app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

//contact page
app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

//compose a new post
app.get("/compose", function (req, res) {
  res.render("compose");
});

//handle individual posts, find the appropriate one and handle dashes/etc.
app.get("/posts/:postID", function (req, res) {
  Composition.findOne(
    { _id: req.params.postID },
    function (err, foundPost) {
      if (!err) {
        //if didn't find that post send home
        if (!foundPost) {
          console.log("no find");
          res.redirect("/");
        }
        //found existing post, push user to it
        else {
          res.render("post", { singlePost: foundPost });
        }
      }
    }
  );
  /*
  posts.forEach((post) => {
    if (_.lowerCase(post.title) === _.lowerCase(req.params.postName))
      res.render("post", { singlePost: post });
  });
  */
});

//POST requests
//post root - shouldn't be hit, just redirect to home
app.post("/", function (req, res) {
  res.redirect("/");
});

//post compose, add composition to post array and send to home to show it
app.post("/compose", function (req, res) {
  //posts.push({ title: req.body.title, content: req.body.composition });
  const post = new Composition({
    title: _.lowerCase(req.body.title),
    content: req.body.composition,
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    } 
  });
  
});

//listen on to port 3000, if upload
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
