const express = require("express");
const router = express.Router({mergeParams:true });
const Post = require("../models/post");
const middleware = require("../middleware");
const sendEmail = require("../sendEmail");

//SHOW
router.get("/",function(req,res){
	var noMatch;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Post.find({$or:[{title: regex}, {skills: regex}, {field: regex}]}).exec(function (err, allPosts) {
			if (err) {
				console.log(err);
			} else {
				if(allPosts.length < 1){
					noMatch = "No project match that query, please try again!";
				}
				res.render("posts/index", {	posts: allPosts });
			}
			});
		}else { 
		Post.find({}).exec(function (err, allPosts) {
				if (err) {
					console.log(err);
				} else {
					res.render("posts/index", {posts: allPosts});
				}
			});
		}
	});

//NEW 
router.post("/",middleware.isLoggedIn,middleware.isAnAdmin,function(req,res){
	const newpost = req.body;
	Post.create(newpost,function(err,newlyCreated){
		if(err){
			res.redirect("/");
			req.flash("error","Could not create new project!")
			console.log(err);
		}else{
			res.redirect("/posts");
			req.flash("success","Project Created!")
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
			res.redirect("/posts");
			req.flash("error", "Could not edit the post.Try Again Later")
		}else{
			res.redirect("/posts/"+ req.params.id);
		}
	});
});

router.get("/:id/apply",middleware.isLoggedIn,function(req,res){
	Post.findById(req.params.id,function(err,foundPost){
		if(err){
			res.redirect("/posts");
		} else{
			res.render("posts/apply",{post:foundPost});
		}
	});
});

router.post('/:id/applyform',middleware.isLoggedIn,function(req,res){
	Post.findById(req.params.id,function(err,foundPost){
		if(err){
			console.log(err);
		}else{
			const { name,email,regNo,link,branch,phone,profname,researchexp,technicalexp,descrip} = req.body;
			const from = 'noreply.rsmanipal@gmail.com';
			const to = 'researchsociety.manipal@gmail.com';
			const desc = `Application for ${foundPost.title}`;
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
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You have an Applicant for ${foundPost.title}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>From:</b> ${name}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Email:</b> ${email}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Registration No:</b> ${regNo}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Profile Link:</b> ${link}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Branch</b>${branch}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Contact:</b> ${phone}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Name of Prof. worked under:</b> ${profname}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Research Experience:</b> ${researchexp}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Technical Experience:</b> ${technicalexp}</p>
								<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Why they want to join RSM?:</b> ${descrip}</p>
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
		res.redirect('/posts');
		req.flash("success","Your application has been succesfully submitted.")
		}
	})
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;