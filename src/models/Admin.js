const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const AdminSchema = new Schema({// genera el esquema mongodb para guardar los usuarios
	admin_name: {type: String, required: true},
	admin_email: {type: String, required: true},
	admin_password: {type:String, required:true},
	date: {type:Date, default: Date.now}
});

AdminSchema.methods.encryptPassword = async (admin_password) => {//genera el hash para encriptar el password
	const salt = await bcrypt.genSalt(10);
	const hash = bcrypt.hash(admin_password,salt);
	return hash;
};

AdminSchema.methods.matchPassword = async function (admin_password){//Compara los password y regresa true o false
	return await bcrypt.compare(admin_password, this.admin_password);
};
module.exports = mongoose.model('Admin', AdminSchema);
