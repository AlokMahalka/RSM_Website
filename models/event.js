const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	title:String,
	time:String,
	location:String,
	image: String,
	description:String,
	onDate:{type:Date}
});

module.exports = mongoose.model("Event",eventSchema);