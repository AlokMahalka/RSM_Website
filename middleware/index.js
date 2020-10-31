const Post = require("../models/post");
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
  req.flash("error","You need to be logged in to do that!!");
	res.redirect("/login");
}

middlewareObj.isAnAdmin = function(req,res,next){
  if(req.user.isAdmin){
    return next();
  }
  req.flash("error","You are not authorised to do that!");
  res.redirect("back");
}

module.exports = middlewareObj;