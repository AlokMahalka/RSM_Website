const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username:String, 
	email:{
		type:String,
		unique:true,
		required:true
	},
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
	isVerified:Boolean,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);