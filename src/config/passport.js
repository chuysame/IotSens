const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');
//const Admin = require('../models/Admin');



      passport.use('local-signup',new LocalStrategy({
        usernameField: 'email'
      }, async (email, password, done) => {
        // Match Email's User
        const user = await User.findOne({email: email});//Busca el usuario en la base de datos
        if (!user) {
          return done(null, false, { message: 'Not User found.' });
        } else {
          // Match Password's User
          const match = await user.matchPassword(password);
          if(match) {
      			console.log('session started');
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect Password.' });
          }
        }
      }));


      //Pasport nesecita ser capaz de serializar y deserializar usuarios  para soportar inicios se de sesion persistentes
      // Configure Passport authenticated session persistence.

      passport.serializeUser((user, done)=>{
        console.log('passport.serializeUser... user.id:',user.id);
      	done(null, user.id);//almacena el id del susario logeado
      });

      passport.deserializeUser((id, done)=> {//toma el id retorna un usuario
      	User.findById(id,(err, user)=>{
      			done(err, user);
      	});
      });
