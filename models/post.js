const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	title:String,
	name:String,
	images: [
		{
			url: String,
			filename: String
		}
	],
	skills:String,
	descIntro:String,
	desc:String,
    endDate:{type:Date},
    students:Number
});

module.exports = mongoose.model("Post",postSchema);