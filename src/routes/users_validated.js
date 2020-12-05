const express = require('express');
const router = express.Router();
//const validations = require('utils');
const { check, validationResult } = require('express-validator');
const User = require('../models/Users');
const passport = require('passport');
/*
*_________________________________ABRIR SESION______________________________________________________
*/
router.get('/users/signinval',(req,res) => {//// Ruta abrir sesion
	res.render('users/signin');
});
router.post('/users/signinval',  passport.authenticate('local-signup',{// utiliza la estrategial "local" del archivo passport.js
			succesRedirect: '/notes',
			failureRedirect: '/users/signinval',
			failureFlash: true
}));
/*
*___________________________REGISTRO DE USUARIOS VISTA______________________________________________
*/
router.get('/users/signupval',(req,res) => {//Muestra la vista del registro de Usuarios
	res.render('users/signupval');
});
/*
*______________________________REGISTRO DE USUARIOS________________________________________________
*/
router.post('/users/signupval',//recibe los datos del registro de ususarios, los valida,
[
	check('name','El nombre es requerido').notEmpty(),
	check('email','Usa un email valido').isEmail(),
	check('password','El password debe ser minimo de cinco caracteres').isLength({ min: 5 }),
	check('confirm_password', 'EL password y la confirmacion deben coincidir')
    .exists()
    .custom((value, { req }) => value === req.body.password)
]
, async (req,res)=>{
	//console.log(req.body);
	const{name,email,password,confirm_password} = req.body;
	const errorsval = validationResult(req);
	//console.log(errorsval.errors);
	errors = [];
	//errors = validations.createUsersValidation(req.body);
	const emailUser = await User.findOne({email: email});// busca el correo introducido en la base de datos para ver si esta repetido
	console.log('email repetido: ' + emailUser);
	if(emailUser){
		errors.push({text: 'El email ya esta en uso'});
	}
	if(!errorsval.isEmpty() || errors.length > 0){//Entra si hay errores en los datos o si el email esta repetido
		//res.send('hay errores en los datos');
		errorsval.array().forEach((error) =>{
			errors.push({text: error.msg});
		})
		res.render('users/signupval',{errors, name, email, password, confirm_password});//renderiza la misma ruta y se le envian los mismos datos para que no los borre
	}else{

		const newUser = new User({name, email, password}); // Se crea el nuevo usuario
		newUser.password = await newUser.encryptPassword(password);//Se cambia su propiedad password por el hash
		await newUser.save();
		req.flash('success_msg','You are registered');
		res.redirect('/users/signin');
	//res.send('Ok');
	}
});
module.exports = router;
