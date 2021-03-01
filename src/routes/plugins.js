const express = require('express');
const router = express.Router();
const Dash = require('../models/DashBoard');
const { isAuthenticated }= require('../helpers/auth');
var mqtt=require('mqtt');


router.post('/freeboardJSON', (req, res) => {//responde con valores aleatorios generados al recibir la peticion
  //console.log("El servidor Get respondió con un JSON");
  var geo = Math.round(Math.random()*10);
  var id = Math.round(Math.random()*10);
  //res.status(200).json({"user_id":id,"token":"hola l","geo":geo,"switchState":'{"luz":1}'}); // <- enviamos de regreso los datos recibidos
	//res.send(JSON.stringify({"user_id":6,"token":"hola l","geo":2132,"switchState":'{"luz":0}'}));
  //res.send(JSON.stringify({user_id:id,token:"hola l",geo:geo,switchState:1})); // <- enviamos de regreso los datos recibidos
  res.json({user_id:id,token:"hola JSON",geo:geo,switchState:1}); // <- enviamos de regreso los datos recibidos

});



module.exports = router;
