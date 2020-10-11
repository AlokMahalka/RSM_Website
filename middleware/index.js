const Post = require("../models/post");
const middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
 	if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
           if(err){
              req.flash("error","Post not found!");
              res.redirect("back");
           }  else {
            if(req.user.isAdmin) {
                next();
            } else {
                req.flash("error","You dont have permission to do that!!")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","You need to be logged in to do that!!");
        res.redirect("back");
    }
}

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