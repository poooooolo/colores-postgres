//esta es la parte del backend que realiza las peticiones etc

const express = require("express"); //importamos express, previamente instalado
const  bodyParser = require("body-parser");
const cors = require("cors")
const {getColores,crearColor,borrarColor} = require("./db"); //importamos BBDD, los colores


const servidor = express(); //creamos una instancia

servidor.use(cors());

servidor.use(bodyParser.json()); //intercepta cualquier cosa que venga con content-type json y crea el objeto body en la petición

servidor.use(express.static("./dist")); //sirve los ficheros estáticos que coincidan en la carpeta donde esten los ficheros estaticos

servidor.get("/colores",async (peticion,respuesta) => {
    
    try{
        let colores = await getColores(); //espera a que esta función responda al cumplirse

        respuesta.json(colores); //lo que retorna el getColores de colores es un objeto, hace JSON.stringify

    }catch(error){
        respuesta.status(500); //error en el servidor
        respuesta.json(error); //hace JSON.stringify
    }
}); 

servidor.post("/crear-color", async (peticion,respuesta) => {
    
    try{
        let id = await crearColor(peticion.body)

        respuesta.json({id}); //hace parse

    }catch(error){
        respuesta.status(500);
        respuesta.json(error); //hace stringify
    }
});

servidor.delete("/borrar/:id", async (peticion,respuesta) =>{//las url que hacen saltar este callback son borrar/5 por ejemplo
    
    try{
        let cantidad = await borrarColor(peticion.params.id);
        respuesta.json({resultado : cantidad > 0 ? "ok" : "rip"})

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
    respuesta.send() //params es un objeto que guarda todo lo que se encuentre tras los :

})


servidor.listen(4000); //inicia el servidor y lo pone a escuchar en el puerto 4000