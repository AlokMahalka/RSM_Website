const express = require("express");
const router = express.Router();
const { check , validationResult } = require("express-validator"); 
const sendEmail = require("../sendEmail"); 
const passport = require("passport");
const User = require("../models/user");
const Newsletter = require("../models/newsletter");
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

router.get("/newsletter", function(req,res){
	res.render("newsletter");
});

router.get("/publications", function(req,res){
  res.render("publication");
});

router.post('/sendemail', function(req,res){
	const { name, email, subject, message} = req.body;
	const from = 'noreply.rsmanipal@gmail.com';
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
						const to  = user.email;
						const from = 'noreply.rsmanipal@gmail.com';
						const subject = 'Research Society Email Verifcation';
						const output = ` 
						<h3>Welcome!</h3>
						<p>Thank you for registering with the Research Society MIT, Manipal's official student research body! To verify your account, please confirm your email address at this link!</p>
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

router.get("/subscribe",function(req,res){
  res.redirect("newsletter");
})

router.post("/subscribe",function(req,res){
  const newsubs = req.body;
  Newsletter.create(newsubs,function(err,newlyCreated){
    if(err){
      console.log(err);
    }else{
      res.redirect("newsletter");
    }
  })
})

module.exports = router;