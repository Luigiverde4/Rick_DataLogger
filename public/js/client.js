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
            beginAtZero: true,
        },
    }
}

let myChart = new Chart(ctx, {
    type: "line",
    data: datos_graficos,
    options: opciones_graficos
});




let cantMuestrasParaActualizar = 3; // Cantidad de muestras que se van a actualizar de golpe
let contadorAcumulacion = 0; // Contador de cuantas iteraciones llevamos antes de actualizar
const maxLength = 10; // cantidad maxima de puntos representados en el grafico

setInterval(() => {
    // Generar nueva medicion
    let nuevaMedicion = parseInt(Math.random() * 100);

    // Anadir la nueva medicion a la lista
    if (mediciones.length < maxLength) {
        mediciones.push(nuevaMedicion);
    } else {
        mediciones.shift(); // Sacar el mas viejo
        mediciones.push(nuevaMedicion); // Anadir el nuevo
    }

    // Actualizar eje X
    datos_graficos.labels.push(cogerHoraMinutoSegundos());

    // Actualizar eje Y
    datos_graficos.datasets[0].data.push(nuevaMedicion);

    // Limitar la longitud de los datos
    if (datos_graficos.labels.length > maxLength) {
        datos_graficos.labels.shift();
        datos_graficos.datasets[0].data.shift();
    }

    // Aumentar el contador de muestras
    contadorAcumulacion++;

    // Cuando tengamos 3 muestras acumuladas, actualizamos el grafico
    if (contadorAcumulacion >= cantMuestrasParaActualizar) {
        myChart.update(); // Actualizar el grafico
        contadorAcumulacion = 0; // Reiniciar el contador
    }
}, 500); // Intervalo de 500ms para obtener muestras rapidamente



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