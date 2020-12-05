const mongoose = require('mongoose');
const { Schema } = mongoose;

const DashSchema = new Schema({
	stringDash:{type: String, required: true},
	date: {type:Date, default:Date.now},
	user:{type: String}
});
module.exports = mongoose.model('DashBoard',DashSchema);
