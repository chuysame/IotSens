const express = require('express');
const router = express.Router();
const path = require('path');
//const validations = require('utils');
const { check, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const passport = require('passport');
const { isAdm, limiter, speedLimiter,password_check,token_check }= require('../helpers/auth');
const { read_env }= require('../helpers/env_var');

/*
*_________________________________ABRIR SESION______________________________________________________
*/
router.get('/admin/in123',(req,res,) => {//// Ruta abrir sesion
	res.render('admin/in123',{layout: 'admin_main_signin'});
});

router.post('/adm/in4321',speedLimiter,password_check,/* isAdm,*/(req,res)=>{ // recibe y revisa el pass le agrega un limite en la tasa de peticiones
        //console.log("res.locals.authotization: ", res.locals.authorization);
        //res.setHeader('Authorization',res.locals.authorization)
        res.cookie("Authorization", res.locals.authorization,{maxAge: 1000*60*60*24});
	res.redirect('/admin/in123home');
});
router.get('/admin/in123home',async(req,res) => {//// Ruta home admin
        console.log("Get cookies: ", req.cookies.Authorization);//lifetime
	let var_ent = []
	var_ent[0] = await {"PORT_SERVERLOCAL":read_env('/home/zagan/Escritorio/notes-app/.env',"PORT_SERVERLOCAL")};
	var_ent[1] = await {"MONGODB_URI":read_env('/home/zagan/Escritorio/notes-app/.env',"MONGODB_URI")};
	var_ent[2] = await {"PORT_BROKMQTT":read_env('/home/zagan/Escritorio/notes-app/.env',"PORT_BROKMQTT")};
	var_ent[3] = await {"SISTEMWEBPASS":read_env('/home/zagan/Escritorio/notes-app/.env',"SISTEMWEBPASS")};
 
//       res.json({ status: 'ok', data: "listo" })
	res.render('admin/home_admin',{layout: 'admin_main',var_ent});
});




/*
*______________________________REGISTRO DE ADMIN_USERS________________________________________________
*/
router.post('/admin/up4321',//recibe los datos del registro de ususarios, los valida y crea el admin_user
[
	check('admin_name','El admin_nombre es requerido').notEmpty(),
	check('admin_email','Usa un admin_email valido').isEmail(),
	check('admin_password','El admin_password debe ser minimo de cinco caracteres').isLength({ min: 5 }),
	check('admin_confirm_password', 'EL admin_password y la confirmacion deben coincidir')
    .exists()
    .custom((value, { req }) => value === req.body.admin_password)
]
, async (req,res)=>{
	//console.log(req.body);
	const{admin_name,admin_email,admin_password,admin_confirm_password} = req.body;
	const errorsval = validationResult(req);
	//console.log(errorsval.errors);
	errors = [];
	//errors = validations.createUsersValidation(req.body);
	const emailUser = await Admin.findOne({admin_email: admin_email});// busca el correo introducido en la base de datos para ver si esta repetido
	console.log('admin_email repetido: ' + emailUser);
	if(emailUser){
		errors.push({text: 'El admin_email ya esta en uso'});
	}
	if(!errorsval.isEmpty() || errors.length > 0){//Entra si hay errores en los datos o si el email esta repetido
		//res.send('hay errores en los datos');
		errorsval.array().forEach((error) =>{
			errors.push({text: error.msg});
		})
		res.render('users/signupval',{errors, admin_name, admin_email, admin_password, admin_confirm_password});//renderiza la misma ruta y se le envian los mismos datos para que no los borre
	}else{

		const newUser = new Admin({admin_name, admin_email, admin_password}); // Se crea el nuevo usuario
		newUser.password = await newUser.encryptPassword(admin_password);//Se cambia su propiedad password por el hash
		await newUser.save();
		req.flash('success_msg','You are registered');
		res.redirect('/users/signin');
	//res.send('Ok');
	}
});
module.exports = router;
