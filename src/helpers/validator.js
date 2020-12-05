function createUsersValidation(data){
	const{name,email,password,confirm_password} = data;
	const errors = [];
	if (name.length <= 0) {
		errors.push({text:'Please Insert your Name'});
	}
	if(password != confirm_password){
		errors.push({text: 'Password do not match'});
	}
	if(password.length < 4){
		errors.push({text: 'Password must be at least 4 characters'});
	}
	if(errors.length > 0){ //si hay errores
		res.render('users/signup',{errors, name, email, password, confirm_password});//renderiza la misma ruta y se le envian los mismos datos para que no los borre
	}else{
	res.send('Ok');
	}
}

module.exports = {
	createUsersValidation,
}
