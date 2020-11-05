const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	title:String,
	time:String,
	location:String,
	image: String,
	description:String,
	applyLink:String,
	onDate:{type:Date},
	isOver: {
		type:Boolean,
		default: false 
	}
});

module.exports = mongoose.model("Event",eventSchema);