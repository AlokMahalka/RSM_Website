const express = require("express");
const router = express.Router({mergeParams:true });
const Event = require("../models/event");
const middleware = require("../middleware");

//SHOW
router.get("/", function (req, res) {
    Event.find({}).sort({onDate: -1}).exec(function (err, allEvents){
			if(err){
				console.log(err);
			}else{
				res.render("events/index",{events: allEvents});
			}
		});
	});

//NEW 
router.post("/",middleware.isLoggedIn,middleware.isAnAdmin,function(req,res){
	const newevent = req.body;
	Event.create(newevent,function(err,newlyCreated){
		if(err){
			res.redirect("/events");
			req.flash("error","Could not create event. Try again later!")
			console.log(err);
		}else{
			res.redirect("/events");
			req.flash("success","Event created successfully");
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
		if(foundEvent.onDate < Date.now()) foundEvent.isOver == true;
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
			req.flash("error","Could not edit the event. Try again later!")
		}else{
			res.redirect("/events/"+req.params.id);
		}
	});
});

module.exports = router;