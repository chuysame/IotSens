const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({// genera el esquema mongodb para guardar los usuarios
	name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type:String, required:true},
	isAdmin:{type: Boolean, default:false},
	isUser:{type: Boolean, default:true},
	date: {type:Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {//genera el hash para encriptar el password
	const salt = await bcrypt.genSalt(10);
	const hash = bcrypt.hash(password,salt);
	return hash;
};

UserSchema.methods.matchPassword = async function (password){//Compara los password y regresa true o false
	return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);
