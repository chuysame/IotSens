//require('dotenv').config();//dot env nos permite leer el archivo .env para asegurar variables que no se desean compartir
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then((db) => console.log("Mongodb is connected to", db.connection.host, 'Urra!!'))
  .catch((err) => console.error(err));
