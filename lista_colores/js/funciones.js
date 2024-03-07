//este es el java del front

const lista = document.querySelector("ul");
const formulario = document.querySelector("form");
const input = document.querySelector('input[type="text"]');


function itemColor({id,r,g,b}){ //función para crear los li por cada color que metamos
    let item = document.createElement("li");
    item.innerText = [r,g,b].join(",");
    item.style.backgroundColor = `rgb(${[r,g,b].join(",")})`;
    
    item.addEventListener("click", () => {
        fetch(`/borrar/${id}`,{
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())// porque lo que le llega es un mensaje que es un string `id recibido ${peticion.params.id}`
        .then(({error}) => {
            if(!error){
                return item.remove();
            }
            console.log("ha salido mal");
        })
    });

    return item;
}

fetch("/colores") //traemos los datos del back con fetch
.then(respuesta => respuesta.json())//recibimos la respuesta en bruto, json.parse en express es json.parse
.then(respuesta => {
    if(!respuesta.error){ //si no hay error entro aquí y hago:
        return respuesta.forEach(color => lista.appendChild(itemColor(color))); //color: cada uno de los colores del array respuesta
    }
    console.log(respuesta.error);
});



formulario.addEventListener("submit", evento => {
    evento.preventDefault(); //para que no lo envíe

    let [r,g,b] = input.value.split(","); //lo que se escriba en el formulario, no está validado
    // console.log(r,g,b) //para ver si funciona


    fetch("/crear-color",{
        method : "POST", //petición post porque sino de default es send
        body : JSON.stringify({r,g,b}), //esto es lo que desempaqueta body-parser
        headers : {
            "Content-type" : "application/json" // le decimos que lo que le hemos enviado es json
        }
    })
    .then(respuesta => respuesta.json())
    .then(({id,error}) => { //desestrucuturo las dos propiedades
        if(!error){
            return lista.appendChild(itemColor({id,r,g,b}));
        }
        console.log("mostrar error al usuario")
    });

})