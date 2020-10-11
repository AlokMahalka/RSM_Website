const mongoose = require("mongoose");
const User = require("./user")

const postSchema = new mongoose.Schema({
	title:String,
	name:String,
	image: String,
	description:String,
    endDate:{type:Date},
    students:Number
});

module.exports = mongoose.model("Post",postSchema);