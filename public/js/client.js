/*
Ricardo Roman
Proyecto Final Intera

cliente
*/

const sock = io()
elementoEstado = document.getElementById("estadoServer")

sock.on("connect",(msj)=>{
    console.log("Conectado al servidor")
    elementoEstado.textContent = "Estado de la conexion: Conectado"
    console.log("Mensaje recibido\n",msj)
});

sock.on("disconnect",()=>{
    console.log("Desconectado del servidor")
    elementoEstado.textContent = "Estado de la conexion: Desconectado"
});


// Graficos - https://www.youtube.com/watch?v=_vRS87AT1Yk
let ctx = document.getElementById("myChart").getContext("2d");

mediciones = []

datos_graficos = {
    labels: [],
    datasets: [{
        label: "Valores",
        data: [],
        backgroundColor: [
            "rgb(202, 64, 29)",
        ]
    }]
}

opciones_graficos = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
}

let myChart = new Chart(ctx, {
    type: "line",
    data: datos_graficos,
    options: opciones_graficos
});



setInterval(() => {
    // Añadir nueva medicion a la lista
    let nuevaMedicion = parseInt(Math.random() * 100)
    mediciones.push(nuevaMedicion)


    // Actualizar eje X
    datos_graficos.labels.push(cogerHoraMinutoSegundos())

    // Actualizar eje Y
    datos_graficos.datasets[0].data.push(nuevaMedicion)

    // // // Limitar los puntos visibles en el gráfico
    // if (datos_graficos.labels.length > 3) { // max de 10 puntos
    //     datos_graficos.labels.shift();
    //     datos_graficos.datasets[0].data.shift();
    // }

    // Actualizar grafico
    myChart.update()
}, 1000);


function cogerHoraMinutoSegundos(){
    date = new Date()
    let hora = date.getHours(); 
    let minutos = date.getMinutes(); 
    let segundos = date.getSeconds(); 
    return `${hora}:${minutos}:${segundos}`;
}

function construyeVisualizadores(){
    console.log("construyeVisualizadores")
    let contenedor = document.createElement("div")
    contenedor.class = "contenedor"

}