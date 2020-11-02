const express = require("express");
const router = express.Router();
const { check , validationResult } = require("express-validator");  
const passport = require("passport");
const User = require("../models/user");

router.get("/",function(req,res){
	res.render("home"); 
});

router.get("/teams",function(req,res){
	res.render("teams");
}); 

router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",[
	check("username")
	.isLength({min:3 , max: 12}).withMessage("Must be 3-12 characters long")
	.isAlpha().withMessage('Must be only alphabetical chars'),
	check("email")
	.isEmail().withMessage("Email is not valid"),
	check("emailMIT")
	.isEmail().withMessage("Learners ID is not valid")
	.contains("@learner.manipal.edu").withMessage("Email not valid"),
	check("regNo")
	.isNumeric()
	.isLength({min:9, max:9})
],function(req,res){
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.render("register",{ errors });
	}
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
			return res.redirect("login");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Research Society" + user.username);
			res.redirect("/");
		})
	})
});

//Login
router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local", {
		successRedirect:"/",
		failureRedirect:"/login"
	}), function(req,res){
});

//Logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you Out");
	res.redirect("/");
});


module.exports = router;