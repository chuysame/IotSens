const jwt = require('jsonwebtoken')
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const User = require('../models/Users');
const helpers = {};
helpers.isAuthenticated = (req, res, next)=> {//se ultiliza para permitir o rechazar el acceso segun se haya autenticado
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error_msg', 'Not Authorized');
	res.redirect('/users/signin');
};

helpers.isAdm = async(req, res, next)=> {//se usara solo si se tienen roles por ejemplo si hay un administrador del hogar y permite el acceso y la generacion de usuarios hijos de momento el rool isAdmin e isUser no se estan utilizando
	const user = await User.findOne({email: req.body.email});//Busca el usuario en la base de datos
	if (user.isAdmin === true) {
		return next();
	}
	res.redirect('/vendorlogin');//si se rechaza la entrada se redirige
	};

helpers.limiter = rateLimit({//limita la tasa de peticiones por ususario
	windowMs: 1000*60*1,// 1 minuto
	max:2,//1 request per minute
	message:"You make a lot request, try later!",
	headers: true,
	handler: function (req, res, options) {
		//console.log('req: ', req);
  if (options.headers) {
		console.log('options.windowMs: ', options.windowMs);
    res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
  }
  res.format({
    html: function(){
      res.status(options.statusCode).end(options.message);
    },
    json: function(){
      res.status(options.statusCode).json({ message: options.message });
    }
  });
}
});


//app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

 helpers.speedLimiter = slowDown({
  //windowMs: 15 * 60 * 1000, // 15 minutes
	windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 4, // allow 4 requests per 15 minutes, then...(permite una tasa de 4/15 min, despues...)
  delayMs: 500, // begin adding 500ms of delay per request above 100:(agrega 500ms de retardo a cada request)
	/*onLimitReached:function(req, res, options){
		//console.log('req.slowDown.current',req.slowDown.current);
		//console.log('************************ options *******************',options);

	}
	*/
});


helpers.password_check = function(req, res, next){
        const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
	const errors = [];
        console.log("req.body: ", req.body)
	if(process.env.SISTEMWEBPASS === req.body.password){
		console.log('los password son iguales:');
                const token = jwt.sign({
		  id: process.env.PASS_ID,
		  username: process.env.USERNAME
		},
		JWT_SECRET
		)
                res.locals.authorization = token;
	        return next();
	}else {
//		errors.push({text:'Incorrect password'});
//		res.render('admin/in123',{layout: 'admin_main_signin',errors});
                res.json({status:null, data:"Incorrect password"});
                res.end();
	}

}

module.exports = helpers;


