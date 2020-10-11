const express        = require("express");
const app            = express();
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const flash	   	     = require("connect-flash");
const passport       = require("passport");
const methodOverride = require("method-override");
const LocalStrategy  = require("passport-local");
const Post 	   	     = require("./models/post");
const User	         = require("./models/user");

const postRoutes  = require("./routes/posts");
const indexRoutes = require("./routes/index");

const url = process.env.DATABASEURL || "mongodb://localhost/research"	
mongoose.connect(url , {
	useNewUrlParser: true,
	useUnifiedTopology:true
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret:"Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error 	   = req.flash("error");
	res.locals.success 	   = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/posts",postRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});