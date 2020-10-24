const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/",function(req,res){
	res.render("home");
});

router.get("/teams",function(req,res){
	res.render("teams");
});


router.post("/register",function(req,res){
	const newUser = new User({
		username: req.body.username , 
		email   : req.body.email , 
		emailMIT: req.body.emailMIT,
		regNo	: req.body.regNo ,
		isMIT	: req.body.isMIT
	});
	if(req.body.adminCode === "secretCode123"){
		newUser.isAdmin =true;
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Research Society" + user.username);
			res.redirect("/posts");
		})
	})
});

//Login
router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local", {
		successRedirect:"/posts",
		failureRedirect:"/login"
	}), function(req,res){
});

//Logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you Out");
	res.redirect("/posts");
});


module.exports = router;