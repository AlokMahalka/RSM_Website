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

router.get("/sentFeedback", function(req,res){
	res.render("sentMail/sentFeed");
});

router.get("/sentEmail", function(req,res){
	res.render("sentMail/sentEmail");
});

router.post('/sendemail', function(req,res){
	const { name, email, subject, message} = req.body;
	const from = 'noreply.rsmanipal@gmail.com';
	const to = 'researchsociety.manipal@gmail.com';
	const desc = `${subject}`;
	const output = `
    <p>You have a new Contact Request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${name}</li>
	  <li>Message: ${message}</li>
    </ul>
  `;

  sendEmail(to,from,desc,output);
  res.redirect('sentFeedback');
});

router.get("/teams",function(req,res){
	res.render("teams");
}); 

router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",[
		check("username")
		.isLength({min:3 , max: 15}).withMessage("Username must be 3-15 characters long")
		.isAlpha().withMessage('Username should only contain a-zA-Z(no spaces)'),
		check("email")
		.isEmail().withMessage("Email is not valid"),
		check("regNo")
		.isNumeric().withMessage("Invalid Registration Number")
		.isLength({min:9}),
		check('password')
    	.isLength({min:6 , max: 12}).withMessage("Password must be 6-12 characters long")
	],function(req,res){
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("register",{ alert });
		}else{
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
				newUser.isAdmin = true;
			}
			User.register(newUser,req.body.password,async function(err,user){
				if(err){
					console.log(err);
					return res.redirect('register');
				}else{
						const to  = user.email;
						const from = 'noreply.rsmanipal@gmail.com';
						const subject = 'Research Society Email Verifcation';
						const output = ` 
						<h1>Welcome to Research Society!</h1>
						<p>Thank You for registering.</p>
						<p>Lets confirm your Email Address!<p>
						<a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">Confirm Your Email</a> ` 
					try{
						sendEmail(to,from,subject,output);
						res.redirect('sentEmail');
					}catch(error){
						console.log(error);
						res.redirect('register');
					}
				}
			})
		}
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
		req.login(user, async (err) => {
			if (err)
				return next(err);
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