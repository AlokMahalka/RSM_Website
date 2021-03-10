const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	title:String,
	name:String,
	profName:String,
	members:String,
	image: String,
	skills:String,
	descIntro:String,
	desc:String,
    students:Number,
	eligible:String,
	status:String,
	field:String,
	output:String
});

module.exports = mongoose.model("Post",postSchema);