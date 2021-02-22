const express = require('express');
const router = express.Router();
const Dash = require('../models/DashBoard');
const { isAuthenticated }= require('../helpers/auth');
var mqtt=require('mqtt');


router.post('/dash/save', isAuthenticated,async (req,res)=>{ // async se usa para decir que habra funciones asincronas dentro
	const dash = await Dash.findOne({user: req.user.id});
	if (!dash) {//Si no hay un dashboard en mongoDb para ese usuario
    /*//return done(null, false, { message: 'No DashBoard saved yet!' });
		console.log('No DashBoard saved yet!');
		res.json(null);// Retorna vacio
		*/
		console.log('No DashBoard saved yet!');
		const {stringDash} = req.body;
		//console.log(stringDash);
		console.log('Saving your dash: dash recived from html POST...!' + stringDash);
		const errors = [];


		const newDash = new Dash({stringDash});
		newDash.user = req.user.id;
		await newDash.save();//guarda el dato en la Base de datos de forma asincrona
		res.send('ok');
		//req.flash('success_msg','Note Added Successfully');
		//res.redirect('/dashboard');
		console.log("Dashboard Succesfully Updated¡");

} else {
		const {stringDash} = req.body;
    //return done(null, false, { message: 'A Dashboard found' });
		console.log('Saving your dash: a Dashboard found');
	 /*const response = await Dash.updateOne({ user: req.user.id }, { stringDash: {stringDash}});
	    if (response.error) {
				console.log("An error has happened Updating your dash");
	      res.send(response.error);
	    } else {
				console.log("Dashboard Succesfully Updated");
	      res.json(result);
	    }
*/
		//await Dash.findByIdAndUpdate(dash.id,{stringDash: req.body},options, callback)
		await Dash.findByIdAndUpdate(dash.id,{ stringDash:req.body.stringDash},function (err, docs) {
    if (err){
        console.log('An error has ocurred Updating your dash: ',err)
    }
    else{
        console.log("Dashboard Succesfully Updated");
				res.json({ok:'all right'});
    }
		}).lean();

}


});


router.post('/dash/load', isAuthenticated,async (req,res)=>{ // Busa y devuelve el JSON del Dasboard guardado en MongoDB
	console.log('llegó POST  a /dash/load con el req.user.id: ' + req.user.id);
	const dash = await Dash.findOne({user: req.user.id});
	if (!dash) {
    //return done(null, false, { message: 'No DashBoard saved yet!' });
		console.log('No DashBoard saved yet!');
		res.json(null);// Retorna vacio
  } else {
      //return done(null, false, { message: 'A Dashboard found' });
			console.log('A Dashboard found on cloud');
			res.json(dash.stringDash);
  }
	/*const errors = [];

		//res.send('ok');
		const newDash = new Dash({stringDash});
		newDash.user = req.user.id;
		await newDash.save();//guarda el dato en la Base de datos de forma asincrona
		//req.flash('success_msg','Note Added Successfully');
		res.redirect('/dashboard');
	*/
});


router.post('/dash/actuatorMQTT', isAuthenticated, (req,res)=> {// Suscribe y publica MQTT
    var switchState = req.body.switchState;
    //var user_id = req.body.id_1;
    //var token = req.body.token;
    //var geo = req.body.geo;
		console.log('POST recibido en servidor /dash/actuatorMQTT req.body: ', req.body );

    //res.send(JSON.stringify({'user_id':user_id,'token':token,'geo':geo,'switchState':switchState}));


    var options = {
        port: process.env.PORT_BROKMQTT,//puerto obtenido de las variables de entorno
        //host: 'mqtts://tailor.cloudmqtt.com',
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        //clientId: 'mqttjs87585',
        username: 'ziiayavk',
        password: 'wkx_lXZC2ajl',
        keepalive: 60,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
				reconnectPeriod: 1000,
        encoding: 'utf8'
    };

  //  var client = mqtt.connect('mqtts://tailor.cloudmqtt.com',options)
	 var client = mqtt.connect('mqtts://tailor.cloudmqtt.com',options)
    client.on('connect', function() { // When connected
    console.log('connected');
    // subscribe to a topic
    client.subscribe('tEUtGgOQJIXue63y/output', function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
            console.log("Received '" + message + "' on '" + topic + "'");
        });
    });

    // publish a message to a topic
    client.publish('EUtGgOQJIXue63y/output', switchState, function(err) {
			if(!err){//si fue posible publicar...
        console.log("Message published switchState: " + switchState );
				res.send(JSON.stringify({'switchState':switchState}));
       	client.end(); // Close the connection when published
			}else{
					console.log('Mesage not published on MQTT Broker Error: ',err);
				res.json(null);
			}
    });
});

});//FIN de subcribe y publica MQTT

router.post('/freeboardJSON', (req, res) => {//responde con valores aleatorios generados al recibir la peticion
  //console.log("El servidor Get respondió con un JSON");
  var geo = Math.round(Math.random()*10);
  var id = Math.round(Math.random()*10);
  //res.status(200).json({"user_id":id,"token":"hola l","geo":geo,"switchState":'{"luz":1}'}); // <- enviamos de regreso los datos recibidos
	//res.send(JSON.stringify({"user_id":6,"token":"hola l","geo":2132,"switchState":'{"luz":0}'}));
  //res.send(JSON.stringify({user_id:id,token:"hola l",geo:geo,switchState:1})); // <- enviamos de regreso los datos recibidos
  res.json({user_id:id,token:"hola JSON",geo:geo,switchState:1}); // <- enviamos de regreso los datos recibidos

});


router.get('/esp32', (req, res) => {//responde con valores aleatorios generados al recibir la peticion
  //console.log("El servidor Get respondió con un JSON");
  var geo = Math.round(Math.random()*10);
  var id = Math.round(Math.random()*10);
  console.log("recibida la peticio");
  //res.status(200).json({"user_id":id,"token":"hola l","geo":geo,"switchState":'{"luz":1}'}); // <- enviamos de regreso los datos recibidos
	//res.send(JSON.stringify({"user_id":6,"token":"hola l","geo":2132,"switchState":'{"luz":0}'}));
  //res.send(JSON.stringify({user_id:id,token:"hola l",geo:geo,switchState:1})); // <- enviamos de regreso los datos recibidos
  res.json({user_id:id,token:"hola JSON",geo:geo,switchState:1}); // <- enviamos de regreso los datos recibidos

});


module.exports = router;
