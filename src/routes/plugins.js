const express = require('express');
const router = express.Router();
const Dash = require('../models/DashBoard');
const { isAuthenticated }= require('../helpers/auth');
var mqtt=require('mqtt');


router.post('/pluginJSON', (req, res) => {//responde con valores aleatorios generados al recibir la peticion
  //console.log("El servidor Get respondió con un JSON");
  var geo = Math.round(Math.random()*10);
  var id = Math.round(Math.random()*10);
  //res.status(200).json({"user_id":id,"token":"hola l","geo":geo,"switchState":'{"luz":1}'}); // <- enviamos de regreso los datos recibidos
	//res.send(JSON.stringify({"user_id":6,"token":"hola l","geo":2132,"switchState":'{"luz":0}'}));
  //res.send(JSON.stringify({user_id:id,token:"hola l",geo:geo,switchState:1})); // <- enviamos de regreso los datos recibidos
  res.json({user_id:id,token:"hola JSON",geo:geo,switchState:1}); // <- enviamos de regreso los datos recibidos

});

router.post('/plugin/mqttP', (req, res) => {//responde con las los datos del broker MQTT para suscribirse
  console.log("El servidor /plugin/mqttP Post respondió con un JSON");
  var geo = Math.round(Math.random()*10);
  var id = Math.round(Math.random()*10);
 
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let alphanum = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
  let clientId = "";

  for(let i = 0; i < 14; i++){
    clientId = clientId + alphanum[getRandomInt(0, 65)]; 
  }
  console.log(clientId); 

  var server = process.env.SERVER_MQTT;
  var port = Number(process.env.PORT_BROKMQTTS);
  var user = process.env.USER_MQTT;
  var password = process.env.PASSWORD_MQTT;
  //res.status(200).json({"user_id":id,"token":"hola l","geo":geo,"switchState":'{"luz":1}'}); // <- enviamos de regreso los datos recibidos
	//res.send(JSON.stringify({"user_id":6,"token":"hola l","geo":2132,"switchState":'{"luz":0}'}));
  //res.send(JSON.stringify({user_id:id,token:"hola l",geo:geo,switchState:1})); // <- enviamos de regreso los datos recibidos
  //res.json({user_id:id,token:"hola JSON",geo:geo,switchState:1}); // <- enviamos de regreso los datos recibidos
  res.json({server:server,port:port,user:user,password:password, clientid:clientId}); // <- enviamos de regreso los datos recibidos

});


module.exports = router;
