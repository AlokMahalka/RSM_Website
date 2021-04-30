const express = require("express");
const router = express.Router();
const { check , validationResult } = require("express-validator"); 
const sendEmail = require("../sendEmail"); 
const passport = require("passport");
const User = require("../models/user");
const Newsletter = require("../models/newsletter");
const crypto = require('crypto');
const async = require('async');
const middleware = require("../middleware");

router.get("/",function(req,res){
	res.render("home"); 
});

router.get("/sentFeedback", function(req,res){
	res.render("sentMail/sentFeed");
});

router.get("/sentEmail", function(req,res){
	res.render("sentMail/sentEmail");
});

router.get("/newsletter", function(req,res){
	res.render("newsletter");
});

router.get("/publications", function(req,res){
  res.render("publication");
});

router.post('/sendemail', function(req,res){
	const { name, email, subject, message} = req.body;
	const from = 'noreply.rsmanipal@researchsocietymit.com';
	const to = 'researchsociety.manipal@gmail.com';
	const desc = `${subject}`;
	const output = `
    <style>
    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table[class=body] p,
            table[class=body] ul,
            table[class=body] ol,
            table[class=body] td,
            table[class=body] span,
            table[class=body] a {
        font-size: 16px !important;
      }
      table[class=body] .wrapper,
            table[class=body] .article {
        padding: 10px !important;
      }
      table[class=body] .content {
        padding: 0 !important;
      }
      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      table[class=body] .btn table {
        width: 100% !important;
      }
      table[class=body] .btn a {
        width: 100% !important;
      }
      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
        line-height: 100%;
      }
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
      .btn-primary table td:hover {
        background-color: #34495e !important;
      }
      .btn-primary a:hover {
        background-color: #34495e !important;
        border-color: #34495e !important;
      }
    }
    </style>
  </head>
  <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
      <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
              <tr>
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi there,</p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You have a new Feedback/Contact Request.</p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>From:</b> ${name}</p>
						<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Email:</b> ${email}</p>
						<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>The Message:</b> ${message}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
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
    	.isLength({min:6}).withMessage("Password must be atleast 6 characters long")
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
						const to  = user.emailMIT ? user.emailMIT : user.email ;
						const from = 'noreply.rsmanipal@researchsocietymit.com';
						const subject = 'Research Society Email Verifcation';
						const output = ` 
						<h2>Welcome!</h2>
						<h4>Thank you for registering with the Research Society MIT, Manipal's official student research body! <br>
            To verify your account, please confirm your email address at this link!<h4>
						<a href="https://${req.headers.host}/verify-email?token=${user.emailToken}">Confirm Your Email</a> ` 
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

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash:'Invalid Username or Password'
  }), (req, res) => {
    if (req.user.isVerified) {
      res.redirect("/");
    }else{
      req.logout();
      res.redirect("/login");
    }
  });


//Logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you Out");
	res.redirect("/");
});

router.get("/subscribe",function(req,res){
  res.redirect("newsletter");
})

router.post("/subscribe",function(req,res){
  const newsubs = req.body;
  Newsletter.create(newsubs,function(err,newlyCreated){
    if(err){
      req.flash("error","Try Again Later! Server Down")
      console.log(err);
    }else{
      req.flash("success","Thank you for subscribing!")
      res.redirect("newsletter");
    }
  })
})

router.get("/forgotpassword",function(req,res){
  res.render("forgotpassword");
});

router.post("/forgotpassword",function(req,res){
  async.waterfall([
    function(done){
      crypto.randomBytes(20,function(err,buf){
        var token = buf.toString('hex');
        done(err,token);
      });
    },
    function(token,done){
      User.findOne({email: req.body.email} , function(err,user){
        if(!user){
          req.flash("error","No account with that email address exist.");
          return res.redirect("/forgotpassword");
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 600000;
        user.save(function(err){
          done(err,token,user);
        });
      });
    },
    function(token,user,done){
        const to  = user.emailMIT ? user.emailMIT : user.email;
        const from = 'noreply.rsmanipal@researchsocietymit.com';
        const subject = 'Research Society - Password Reset';
        const output = ` 
        <h2>Welcome!</h2>
        <h4>You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>
          Please click on the following link, or paste this into your browser to complete the process:<br>
          <a href="https://${req.headers.host}/reset?token=${token}">Reset Password</a><br>
          If you did not request this, please ignore this email and your password will remain unchanged.</h4>` 
      try{
        sendEmail(to,from,subject,output);
        req.flash("success","Mail has been sent to the given Email ID.")
        res.redirect("/forgotpassword");
      }catch(error){
        console.log(error);
        done(error,'done');
      }
    }
  ], function(err){
    if(err) return next(err);
    res.redirect("/forgotpassword");
  })
})

router.get("/reset", function(req, res) {
  User.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotpassword');
    }
    res.render("reset", {token: req.query.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
        const to  = user.emailMIT ? user.emailMIT : user.email;
        const from = 'noreply.rsmanipal@researchsocietymit.com';
        const subject = 'Your Password has been changed!';
        const output = ` 
        <h2>Hello!</h2>
        <h4>This is a confirmation that the password for your account ${user.email} has been changed </h4>` 
      try{
        sendEmail(to,from,subject,output);
        req.flash("success","Your password has been changed")
        res.redirect("/login");
      }catch(error){
        console.log(error);
        done(error);
      }
    }
  ], function(err) {
    res.redirect('/login');
  });
});

router.get("/ideas",middleware.isLoggedIn,function(req,res){
  res.render("ideas");
});

router.post('/ideas',middleware.isLoggedIn,function(req,res){
	    const { name,email,regNo,students,projecttitle,field,proposal,prof,researchexp,technicalexp} = req.body;
			const from = 'noreply.rsmanipal@researchsocietymit.com';
			const to = 'researchsociety.manipal@gmail.com';
			const desc = "New Project Idea";
			const output = `
			<style>
			@media only screen and (max-width: 620px) {
			table[class=body] h1 {
				font-size: 28px !important;
				margin-bottom: 10px !important;
			}
			table[class=body] p,
					table[class=body] ul,
					table[class=body] ol,
					table[class=body] td,
					table[class=body] span,
					table[class=body] a {
				font-size: 16px !important;
			}
			table[class=body] .wrapper,
					table[class=body] .article {
				padding: 10px !important;
			}
			table[class=body] .content {
				padding: 0 !important;
			}
			table[class=body] .container {
				padding: 0 !important;
				width: 100% !important;
			}
			table[class=body] .main {
				border-left-width: 0 !important;
				border-radius: 0 !important;
				border-right-width: 0 !important;
			}
			table[class=body] .btn table {
				width: 100% !important;
			}
			table[class=body] .btn a {
				width: 100% !important;
			}
			table[class=body] .img-responsive {
				height: auto !important;
				max-width: 100% !important;
				width: auto !important;
			}
			}
			@media all {
			.ExternalClass {
				width: 100%;
			}
			.ExternalClass,
					.ExternalClass p,
					.ExternalClass span,
					.ExternalClass font,
					.ExternalClass td,
					.ExternalClass div {
				line-height: 100%;
			}
			.apple-link a {
				color: inherit !important;
				font-family: inherit !important;
				font-size: inherit !important;
				font-weight: inherit !important;
				line-height: inherit !important;
				text-decoration: none !important;
			}
			#MessageViewBody a {
				color: inherit;
				text-decoration: none;
				font-size: inherit;
				font-family: inherit;
				font-weight: inherit;
				line-height: inherit;
			}
			.btn-primary table td:hover {
				background-color: #34495e !important;
			}
			.btn-primary a:hover {
				background-color: #34495e !important;
				border-color: #34495e !important;
			}
			}
			</style>
		</head>
		<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
			<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			<tr>
				<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
				<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
				<div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
					<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
					<tr>
						<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
						<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
							<tr>
							<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi there,</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Someone has submitted a project idea</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>From:</b> ${name}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Email:</b> ${email}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Registration No:</b> ${regNo}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Number of Contributors Required:</b> ${students,prof}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Project Title:</b>${projecttitle}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Field of the Project:</b> ${field}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Proposal:</b> ${proposal}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Professor whom they want to approach:</b> ${prof}</p>
                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Research Experience:</b> ${researchexp}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Technical Experience:</b> ${technicalexp}</p>
                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Proposal:</b> ${proposal}</p>
							</td>
							</tr>
						</table>
						</td>
					</tr>
					</table>
				</div>
				</td>
			</tr>
			</table>
		</body>
		</html>
		`;
		sendEmail(to,from,desc,output);
		res.redirect('sentFeedback');
})

module.exports = router;