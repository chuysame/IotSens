// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ freeboard-actuator-plugin                                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ http://blog.onlinux.fr/actuator-plugin-for-freeboard-io/           │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Freeboard widget plugin.                                           │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*
Iniciar el servidor node en:
    /Documentos/Programacion/Javascript/Nodejs/mi-servidor-web$ sudo node index.js
Abrir freeboard en el navegador en la direccion:
    http://localhost:3000/freeboard-master/index.html

ACTUAL FASE DEL PROYECTO
 --Revisar la propiedad retained de MQTT para recordadr el estado del actuador(ultimo mensaje)Hecho

*/
(function () {
    //
    // DECLARATIONS
    //
    var LOADING_INDICATOR_DELAY = 1000;

    //

    freeboard.loadWidgetPlugin({
        type_name: "actuatorMQTT",
        display_name: "ActuatorMQTT",
        description: "Actuator which can send a value as well as receive one",
				external_scripts: ['https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js',
                          '/admin/plugins/thirdparty/js/actuatorMQTTFunctions.js'],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated"
            },
            {
                name: "urlOn",
                display_name: "url On ",
                type: "calculated"
            },
            {
                name: "urlOff",
                display_name: "url Off ",
                type: "calculated"
            },
            {
                name: "on_text",
                display_name: "On Text",
                type: "calculated"
            },
            {
                name: "off_text",
                display_name: "Off Text",
                type: "calculated"
            },
						{
				        name: "topic",
				        display_name: "Publish Topic",
				        type: "text",
				        description: "For MQTT servers, enter your own topic search string.",
				        required: true,
				        default_value: 'EUtGgOQJIXue63y/output'
				      },
				      {
				        name: "server",
				        display_name: "Server",
				        type: "text",
				        description: "Your MQTT server available e.g: tailor.cloudmqtt.com",
				        required: true,
				        default_value: "tailor.cloudmqtt.com"
				      },
				      {
				        name: "port",
				        display_name: "Port",
				        type: "number",
				        description: "Typically either 21973 or 31973 for secure, or 11973 for insecure communication on cloudmqtt",
				        required: true,
				        default_value: 31973
				      },
				      {
				        name: "use_encryption",
				        display_name: "Use Encryption",
				        type: "boolean",
				        description: "Use TLS encryption to connect to the MQTT Server securely (freeboard.io requires all brokers to use encryption)",
				        default_value: true
				      },
				      {
				        name: "client_id",
				        display_name: "Client Id",
				        type: "text",
				        default_value: "quickstart65322",
				        required: true,
				        description: "For IBM quickstart, use default 'quickstart'. For Watson IoT, enter your Organization ID. For all other MQTT servers, set a clientID which will be passed as 'a:clientID:ApiKey:Timestamp'"
				      },
				      {
				        name: "api_key",
				        display_name: "Username",
				        description: "Not required for IBM quickstart, required for Watson IoT Platform connections",
				        type: "text",
				        required: false,
				        default_value: "ziiayavk"
				      },
				      {
				        name: "api_auth_token",
				        display_name: "Password",
				        description: "Required for some Mqtt services",
				        type: "text",
				        required: false,
				        default_value: "wkx_lXZC2ajl"
				      },
				      {
				        name: "json_data",
				        display_name: "JSON messages?",
				        type: "boolean",
				        description: "If the messages on your topic are in JSON format they will be parsed so the individual fields can be used in freeboard widgets",
				        default_value: true
				      }

        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new actuator(settings));
        }
    });

    freeboard.addStyle('.indicator-light.interactive:hover', "box-shadow: 0px 0px 15px #FF9900; cursor: pointer;");
    var actuator = function (settings) {
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div class="indicator-text"></div>');
        var indicatorElement = $('<div class="indicator-light interactive"></div>');
        var currentSettings = settings;
        var isOn = false;
        var onText;
        var offText;
        var url;

				// Called after form input is processed
function startConnect() {
		// Generate a random client ID
		clientIDrand = "clientID" + parseInt(Math.random() * 400);

		// Fetch the hostname/IP address and port number from the form
		host = currentSettings.server;
		port = currentSettings.port;
		user = currentSettings.api_key;
		pasword = currentSettings.api_auth_token;
    clientID = currentSettings.client_id;
    clientID =clientID + clientIDrand;


    console.log('clientID para publicar: ', clientID);
		// Initialize new Paho client connection
		client = new Paho.MQTT.Client(host, Number(port), clientID);

		// Set callback handlers
		client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    //client.onMessageArrived = onMensageRecibed(message);


		// Connect the client, if successful, call onConnect function
		client.connect({
				onSuccess: onConnect,
				userName: user,
				password: pasword,
				useSSL: true,
				timeout: 10,
				cleanSession: true,
		});


}

startConnect();//inicializa la conexion

// Called when the client connects
function onConnect() {
		// Fetch the MQTT topic from the form
		topic = currentSettings.topic;

		// Subscribe to the requested topic
		client.subscribe(topic);
    console.log( 'onConnection... cliente conectado' )

}



// Called when the client loses its connection
function onConnectionLost(responseObject) {
	console.log('ERROR: Connection lost');
		if (responseObject.errorCode !== 0) {
				console.log('ERROR message2:'+ responseObject.errorMessage);
		}
}

function publicar(estado) {


		// Fetch the MQTT topic from the form
		topic = currentSettings.topic;
    if (estado) {
				mensaje = '{"luz":1}';
		}else {
        mensaje = '{"luz":0}';
    }
		//mensaje = "Hola desde MqttFreboard ON";

		// Subscribe to the requested topic


		// Once a connection has been made, make a subscription and send a message.
		message = new Paho.MQTT.Message(mensaje);
		message.destinationName = topic;
    message.retained = true;
    message.qos = 1;
		client.send(message);
}

function onMessageArrived(message){
  console.log("Mensaje Recibido:"+message.payloadString);

}





function updateState() {
    indicatorElement.toggleClass("on", isOn);
      console.log('desde updateState valor de isOn: ', isOn);
    if (isOn) {
        stateElement.text((_.isUndefined(onText) ? (_.isUndefined(currentSettings.on_text) ? "" : currentSettings.on_text) : onText));

		}
    else {
        stateElement.text((_.isUndefined(offText) ? (_.isUndefined(currentSettings.off_text) ? "" : currentSettings.off_text) : offText));


    }
}


this.onClick = function(e) {
    e.preventDefault()

    var new_val = !isOn

    this.onCalculatedValueChanged('value', new_val);
    //url = (new_val) ? currentSettings.urlOn : currentSettings.urlOff;//urloff proviene del campo off url
  //  if (_.isUndefined(url))
        //freeboard.showDialog($("<div align='center'>url undefined</div>"), "Error!", "OK", null, function () {
  //      }
  //    );
  //  else {
        //this.sendValue(url, new_val);
        this.sendValue(new_val);
        publicar(new_val);
  //  }
}


        this.render = function (element) {
            $(element).append(titleElement).append(indicatorElement).append(stateElement);
            $(indicatorElement).click(this.onClick.bind(this));
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "value") {
                isOn = Boolean(newValue);
            }
            if (settingName == "on_text") {
                onText = newValue;
            }
            if (settingName == "off_text") {
                offText = newValue;
            }
            updateState();
        }

        var request;

        this.sendValue = function (options) {
            //console.log(url, options);
            console.log(' entro a funcion sendValue...');
            console.log('Button state: ', options);
            //console.log('url: ', url);
            //request = new XMLHttpRequest();
            //if (!request) {
              //  console.log('Giving up :( Cannot create an XMLHTTP instance');
                //return false;
            //}
            //request.onreadystatechange = this.alertContents;
            //request.open('GET', url, true);
            //freeboard.showLoadingIndicator(true);
            //request.send();
        }

        this.alertContents = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    console.log(request.responseText);
                    setTimeout(function () {
                        freeboard.showLoadingIndicator(false);
                        //freeboard.showDialog($("<div align='center'>Request response 200</div>"),"Success!","OK",null,function(){});
                    }, LOADING_INDICATOR_DELAY);
                } else {
                    //console.log('There was a problem with the request.');
                    //console.log("Estatus" + request.status);
                    setTimeout(function () {
                        freeboard.showLoadingIndicator(false);
                    //    freeboard.showDialog($("<div align='center'>There was a problem with the request. Code " + request.status + request.responseText + " </div>"), "Error!", "OK", null, function () {   });
                    }, LOADING_INDICATOR_DELAY);
                }

            }

        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 1;
        }

        this.onSettingsChanged(settings);
    };

}());
