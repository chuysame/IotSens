
const fs = require('fs')

function read_env(path1,key){//Busca una variable de entorno recibe la ruta del .env y del nombre de la variable y retorna el valor
	  try {
	    const text = fs.readFileSync(path1, 'utf8')//lee de forma sincrona el archivo .env TODO: buscar un alternativa para eliminar la funcoin sincrona

	    //console.log(text)
	    var regex = new RegExp("^" + key + ".=.(.*)$", "m");//Crea la expresion regular para buscar el valor despues del simbolo igual en cada linea del .env
	    var match = regex.exec(text);//realiza la busqueda y genera un arreglo con la respuesta
	    if(match)
	        return match[1];
	    else
	        return null;

	  } catch (err) {
	    console.error(err)
	  }
	}

module.exports ={
	read_env
}
