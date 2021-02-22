if(process.env.NODE_ENV === 'development'){
require('dotenv').config();//dot env nos permite leer el archivo .env para asegurar variables que no se desean compartir(dot env solo se debe usar en desarrollo no en produccion)
}
console.log(process.env.MONGODB_URI); //localhost/notes-db-app
console.log(process.env.NODE_ENV);

const fs = require('fs')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const  session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { isAuthenticated }= require('./helpers/auth');
const { read_env }= require('./helpers/env_var');
const https = require('https');

var options = {
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/certificate.pem'),
};
console.log("private key= ",options.key);
var port = 3003;

//initializations
const app = express();
require('./database');
require('./config/passport');



//settings
app.set('port', process.env.PORT_SERVERLOCAL || 3000); // si existe un puesto en el cpu que lo tome sino que use el 3003
app.set('views', path.join(__dirname, 'views'));//
app.engine('html', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.html',
  runtimeOptions: {
      allowProtoPropertiesByDefault: true, //arregalr fallo de handelbars fuente: http://www.prowebguru.com/2020/08/nodejs-express-handlebars-access-denied-resolve-property-solution/
      allowProtoMethodsByDefault: true, //arregalr fallo de handelbars "  "  "
    }

}));

app.set('view engine', 'html');

//middlewares
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));//permite cundo un formulario mande datos pueda interpretarlos
app.use(methodOverride('_method'));
app.use(session({
	secret: 'mysecretapp',
	resave: true,
	saveUnitialized: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());// agrega textos dinamicos al html





//Global variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
//Routes

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
app.use(require('./routes/users_validated'));
app.use(require('./routes/dashboards'));
app.use(require('./routes/admin_users'));


//TODO: GET '/dasboard'
app.get('/dashboard', isAuthenticated, async (req,res)=>{ //usa isAuthenticated para consultar si el usuario esta logueado
  await res.redirect('../admin/index.html#source=dashboardSaved.json');
});

app.post('/SetEnviroment', isAuthenticated, (req,res)=>{//recibe valores para asignar las variables de entorno desde una aplicacion web
/*  process.env.USERID = req.user.id;
  console.log('process.env.USERID:', process.env.USERID);
*/
console.log("MONGODB_URI: ",read_env(path.join(__dirname, '../.env'),"MONGODB_URI"));

  var logger = fs.createWriteStream(path.join(__dirname, '../.env'), {//abre un archivo manteniedolo a la espera de escritura
     flags: 'a' // 'a' means appending (old data will be preserved)
})

  logger.write('some data'+'\r\n') // agrega texto a tu archivo
  logger.write('more data'+'\r\n') // again
  logger.write('and more'+'\r\n') // again
  logger.end() // close string
  console.log('loger :',logger );

});

app.use('/admin', isAuthenticated, express.static(path.join(__dirname,'freeboard')))
app.use(express.static(path.join(__dirname, 'public')));
/*app.use('/admin', function(req,res,next){
  console.log('entro');
  //var name = req.user.name;
  //var email = req.user.email;
   //console.log(name);
   //console.log(email);
 if(req.user.email){
   res.write('<h1>Entro XD,XD.</h1>');
   return express.static(path.join(__dirname, 'public'));
 } else {
   res.render(403, '/users/signin');
 }
});
*/

/*
app.use(express.static(path.join(__dirname, 'public')));

app.all('/public/*', function(req, res, next) {
  if (req.session.loggedIn) {
    console.log(req.session.loggedIn);
    next(); // allow the next route to run
    //res.redirect('../static/freeboard/index.html');
  } else {
    // require the user to log in
    res.redirect("/users/signin");
  }
})
*/
//Static files
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/static' express.static(path.join(__dirname,'public')));
//Server is listenig
/*
app.listen(app.get('port'), () => {
	console.log('server on port', app.get('port'));
});
*/
var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
