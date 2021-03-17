const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	title:String,
	time:String,
	location:String,
	image: String,
	para1:String,
	para2:String,
	para3:String,
	applyLink:String,
	onDate:{type:Date},
	isOver: {
		type:Boolean,
		default: false 
	},
	type:String,
	recordinglink:String
});

module.exports = mongoose.model("Event",eventSchema);