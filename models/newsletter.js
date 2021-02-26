const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
	email:String
});

module.exports = mongoose.model("NewsLetter",newsletterSchema);