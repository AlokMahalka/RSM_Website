const express = require("express");
const router = express.Router({mergeParams:true });
const Event = require("../models/event");
const middleware = require("../middleware");

//SHOW
router.get("/", function (req, res) {
	var perPage = 12;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
    Event.find({}).sort({onDate: -1}).skip((perPage*pageNumber)-perPage).limit(perPage).exec(function (err, allEvents){
		Event.countDocuments().exec(function(err,count){
			if(err){
				console.log(err);
			}else{
				res.render("events/index", {
					events: allEvents,
					current:pageNumber,
					pages: Math.ceil(count / perPage)
				});
			}
		});
	});
});
 

//NEW 
router.post("/",middleware.isLoggedIn,middleware.isAnAdmin,function(req,res){
	const newevent = req.body;
	Event.create(newevent,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/events");
		}
	});
});

//New form to create
router.get("/new",middleware.isLoggedIn,middleware.isAnAdmin, function(req,res){
	res.render("events/new");
});


//Show one post
router.get("/:id",function(req,res){
	Event.findById(req.params.id,function(err,foundEvent){
		if(err){
			console.log(err);
		}else{
			res.render("events/show",{event:foundEvent});
		}
	});
});

//Edit and Update
router.get("/:id/edit",middleware.isAnAdmin,function(req,res){
	Event.findById(req.params.id,function(err,foundEvent){
		if(err){
			res.redirect("/events");
		} else{
			res.render("events/edit",{event:foundEvent});
		}
	});
});

router.put("/:id",middleware.isAnAdmin,function(req,res){
	Event.findByIdAndUpdate(req.params.id,req.body.event,function(err,updateEvent){
		if(err){
			res.redirect("/events");
		}else{
			res.redirect("/events/"+req.params.id);
		}
	});
});

module.exports = router;