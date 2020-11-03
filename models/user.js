const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username:String, 
	email:String,
	emailMIT:String,
	regNo:Number,
	password:String,
	isAdmin:{  
		type: Boolean , 
		default: false 
	},
	isMIT:{
		type: String,
		default:"false"
	},
	emailToken:String,
	isVerified:Boolean
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);