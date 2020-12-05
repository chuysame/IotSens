const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated }= require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req,res)=>{ //usa isAuthenticated para consultar si el usuario esta logueado
	res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated,async (req,res)=>{ // async se usa para decir que habra funciones asincronas dentro
	const {title, description} = req.body;
	const errors = [];
	if(!title){// Si no hay un titulo de la nota
		errors.push({text:'Please write a title'});
	}
	if(!description){//Si no hay una descripcion
		errors.push({text:'Please write a description'});
	}
	if(errors.length > 0){//Si no se escribio ni titulo ni descripcion
		res.render('notes/new-note', {
			errors,
			title,
			description
		});
	}else{
		//res.send('ok');
		const newNote = new Note({title,description});
		newNote.user = req.user.id;
		await newNote.save();//guarda el dato en la Base de datos de forma asincrona
		req.flash('success_msg','Note Added Successfully');
		res.redirect('/notes');
	}

});

router.get('/notes', isAuthenticated, async (req, res)=>{
	const notes = await Note.find({user: req.user.id}).sort({date:'desc'}).lean();
	res.render('notes/all-notes', { notes });// renderisa la vista all-notes y pasa los datos de la base de datos
	//console.log(notes);
});

/*
router.get('/dashboard', isAuthenticated, async (req, res)=>{
	res.redirect('/freeboard/index');// renderisa la vista dashboard
	//console.log(notes);
});
*/

router.get('/notes/edit/:id', isAuthenticated,async (req,res)=>{//al hacer click en el boton tipo lapis de editar nota redirecciona a este link
	console.log('entro');
	const note = await Note.findById(req.params.id).lean();//Busca en mongo con el Id los datos de la nota a editar y los asigna a note
	res.render('notes/edit-note',{note});//renderiza la vista edit.note y le pasa los datos de la nota
});

router.put('/notes/edit-note/:id', isAuthenticated,async (req,res)=>{//guarda los valores del formulario edit-note al hacer click en el boton save
	const {title,description} = req.body;
	await Note.findByIdAndUpdate(req.params.id,{title, description}).lean();//Busca en mongodb por ID y actualiza los datos
	req.flash('success_msg','Note Updated Succesfully');
	res.redirect('/notes');// nos envia a la vista de todas las notas, ya no requieres mandarle datos porque la ruta notes los toma de mongodb
});

router.delete('/notes/delete/:id', isAuthenticated,async (req,res)=>{
	//console.log(req.params.id);
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg','Note Deleted Succesfully');
	res.redirect('/notes');
});
module.exports = router;
