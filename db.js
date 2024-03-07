//esta es la parte del backend que se conecta con la BBDD

const postgres = require("postgres");//se conecta al servidor de datos postgress

//retorna una conexión para no tener que estar conectandonos todo el rato
function conectar(){
    return postgres({ //objeto de configuración
        host : "localhost",
        port : 5432,
        database : "colores",
        user : "postgres",
        password : "root"
    });
};

//porque queremos que sea asíncrono
function getColores(){
    return new Promise(async (fulfill, reject) => {
        let conexion = conectar();

        try{
            let colores = await conexion`SELECT * FROM colores`;//esperar a que busque los colores en la BBDD
            conexion.end(); 
            //si sale bien, se cumple la promesa, pasando los colores
            
            fulfill(colores); //me dara un resultado que sera un array de objetos, si no hay objetos sera un array vacio
            
        //si no sale bien
        }catch(error){
            reject({error : "error en BBDD"});
        }

    });
};

function crearColor({r,g,b}){
    return new Promise(async (fulfill, reject) => {
        let conexion = conectar();

        try{
            let [{id}] = await conexion`INSERT INTO colores (r,g,b) VALUES (${r},${g},${b}) RETURNING id`;//inserta en la tabla colores los valores y después devuelve el id
            conexion.end(); 
            //si sale bien, se cumple la promesa, pasando los valores de r,g,b
            fulfill(id);
            
            //si no sale bien;
        }catch(error){
            reject({error : "error en BBDD"});
        }

    });
};

function borrarColor(id){
    return new Promise(async (fulfill, reject) => {
        let conexion = conectar();

        try{
            let {count} = await conexion`DELETE FROM colores WHERE id = ${id}`

            conexion.end();

            fulfill(count);
            //si no sale bien;
        }catch(error){
            reject({error : "error en BBDD"});
        }

    });
};//saldrá un número si ha borrado algo y 0 si no ha borrado nada

module.exports = {getColores,crearColor,borrarColor}; //exportamos la función getColores aquí para usarlo en index.js

