const express = require("express");
const router = express.Router({mergeParams:true });
const Post = require("../models/post");
const middleware = require("../middleware");
const multer = require("multer");
const { storage } = require('../cloudinary');
const upload = multer({storage})

//SHOW
router.get("/",function(req,res){
	var noMatch;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		var perPage = 6;
		var pageQuery = parseInt(req.query.page);
		var pageNumber = pageQuery ? pageQuery : 1;
		Post.find({$or:[{title: regex}, {skills: regex}]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allPosts) {
			Post.countDocuments().exec(function (err, count) {
				if (err) {
					console.log(err);
				} else {
					if(allPosts.length < 1){
						noMatch = "No project match that query, please try again!";
					}
					res.render("posts/index", {
						posts: allPosts,
						current: pageNumber,
						pages: Math.ceil(count / perPage),
						noMatch: noMatch
					});
				}
			});
		});
	} else { 
		var perPage = 6;
		var pageQuery = parseInt(req.query.page);
		var pageNumber = pageQuery ? pageQuery : 1;
		Post.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allPosts) {
			Post.countDocuments().exec(function (err, count) {
				if (err) {
					console.log(err);
				} else {
					res.render("posts/index", {
						posts: allPosts,
						current: pageNumber,
						pages: Math.ceil(count / perPage),
						noMatch: noMatch
					});
				}
			});
		});
	}
	
});

//NEW 
router.post("/",middleware.isLoggedIn,middleware.isAnAdmin,upload.array('image'),function(req,res){
	const newpost = req.body;
	newpost.images = req.files.map(f => ({url: f.path , filename: f.filename}));
	console.log(newpost);
	Post.create(newpost,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/posts");
		}
	});
});

//New form to create
router.get("/new",middleware.isLoggedIn,middleware.isAnAdmin, function(req,res){
	res.render("posts/new");
});


//Show one post
router.get("/:id",middleware.isLoggedIn,function(req,res){
	Post.findById(req.params.id,function(err,foundPost){
		if(err){
			console.log(err);
		}else{
			res.render("posts/show",{post:foundPost});
		}
	});
});

//Edit and Update
router.get("/:id/edit",middleware.isAnAdmin,function(req,res){
	Post.findById(req.params.id,function(err,foundPost){
		if(err){
			res.redirect("/posts");
		} else{
			res.render("posts/edit",{post:foundPost});
		}
	});
});

router.put("/:id",middleware.isAnAdmin,function(req,res){
	Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatePost){
		if(err){
			res.redirect("/post");
		}else{
			res.redirect("/posts/"+req.params.id);
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;