const express        = require("express");
const app            = express();
const path			 = require("path");
const bodyParser     = require("body-parser");
const ejsMate        = require("ejs-mate");
const mongoose       = require("mongoose");
const flash	   	     = require("connect-flash");
const passport       = require("passport");
const methodOverride = require("method-override");
const LocalStrategy  = require("passport-local");
const User	         = require("./models/user");


const postRoutes  = require("./routes/posts");
const indexRoutes = require("./routes/index");
const eventRoutes = require("./routes/events");

const url = process.env.DATABASE_URL || "mongodb://localhost/research"	
mongoose.connect(url , {
	useNewUrlParser: true,
	useUnifiedTopology:true
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
app.use(require("express-session")({
	secret:"Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized:false
}));
app.engine('ejs' , ejsMate);
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
app.use("/events", eventRoutes);


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

