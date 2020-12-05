const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const passport = require('passport');

router.get('/users/signin',(req,res) => {//// Ruta abrir sesion
	res.render('users/signin');
});
router.post('/users/signin', passport.authenticate('local-signup',{// utiliza la estrategial "local" del archivo passport.js
			successRedirect: '/notes', //si el usuario se autentico correctamente manda a la ruta notas
			failureRedirect: '/users/signin', //Si sucedio algun error, refresca la misma paguina
			failureFlash: true
}));

router.get('/users/signup',(req,res) => {//ruta del registro de Usuarios
	res.render('users/signup');
});

router.post('/users/signup',(req,res)=>{
	//console.log(req.body);
	const{name,email,password,confirm_password} = req.body;
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
});

router.get('/users/logout',(req,res) => {
	req.logout();
	res.redirect('/');
});
module.exports = router;
