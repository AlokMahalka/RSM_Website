const express = require("express");
const router = express.Router();
const { check , validationResult } = require("express-validator"); 
const sendEmail = require("../sendEmail"); 
const passport = require("passport");
const User = require("../models/user");
const crypto = require('crypto');

router.get("/",function(req,res){
	res.render("home"); 
});

router.get("/sent", function(req,res){
	res.render("sent");
});

router.post('/sendemail', function(req,res){
	const { name, email, subject, message} = req.body;
	const from = 'alokmahalka1234@gmail.com';
	const to = 'draxkiller29@gmail.com';
	const desc = `${subject}`;
	const output = `
    <p>You have a new Contact Request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${name}</li>
      <li>Subject ${subject}</li>
	  <li>Email: ${email}</li>
	  <li>Message: ${message}</li>
    </ul>
  `;

  sendEmail(to,from,desc,output);
  res.redirect('sent');
});

router.get("/teams",function(req,res){
	res.render("teams");
}); 

router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",async function(req,res){
	const newUser = new User({
		username  : req.body.username , 
		email     : req.body.email , 
		emailMIT  : req.body.emailMIT,
		regNo	  : req.body.regNo ,
		isMIT	  : req.body.isMIT,
		emailToken:	crypto.randomBytes(64).toString('hex'),
		isVerified: false
	});
	if(req.body.adminCode === "secretCode123"){
		newUser.isAdmin =true;
	}
	User.register(newUser,req.body.password,async function(err,user){
		if(err){
			console.log(err);
			return res.redirect('register');
		}else{
				const from = 'alokmahalka1234@gmail.com';
				const to  = user.email;
				const subject = 'Email Veriication';
				const output = ` 
				<h1>Hello</h1>
				<p>Thanks for registering.</p>
				<p>Please copy and page the address below to verify your account.<p>
				<a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify your account</a> ` 
			try{
				sendEmail(to,from,subject,output);
				res.redirect('sent');
			}catch(error){
				console.log(error);
				res.redirect('register');
			}
		}
	})
});

router.get('/verify-email', async(req,res,next) => {
	try{
		const user = await User.findOne({emailToken: req.query.token});
		if(!user){
			console.log("There is no user present");
			return res.redirect('register');
		}
		user.emailToken = null;
		user.isVerified = true;
		await user.save();
		await req.login(user, async(err) => {
			if(err) return next(err);
			console.log(`Welcome to RS organisation ${user.username}`);
			const redirectUrl = req.session.redirectTo || '/';
			delete req.session.redirectTo;
			res.redirect(redirectUrl);
		});
	}catch(error){
		console.log(error);
		res.redirect('register');
	}
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