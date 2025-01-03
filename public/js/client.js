/*
Ricardo Roman
Proyecto Final Intera

cliente
*/

const sock = io()
elementoEstado = document.getElementById("estadoServer")
graficos = []

sock.on("connect",(msj)=>{
    console.log("Conectado al servidor")
    elementoEstado.textContent = "Estado de la conexion: Conectado"
    console.log("Mensaje recibido\n",msj)

    // Generar grafico
    // Crear instancias de la clase Grafico para cada cliente
    grafico1 = new Grafico("myChart", sock.id);
    graficos.push(grafico1)
    setInterval(() => {
        // Generar nueva medición
        let nuevaMedicion = parseInt(Math.random() * 100);
        // Actualizar los gráficos de los clientes
        grafico1.actualizarDatos(nuevaMedicion);
    }, 1000); // Intervalo de 500ms para obtener muestras rápidamente
    
});

sock.on("disconnect",()=>{
    console.log("Desconectado del servidor")
    elementoEstado.textContent = "Estado de la conexion: Desconectado"
});


function construyeVisualizadores(){
    console.log("construyeVisualizadores")
    let contenedor = document.createElement("div")
    contenedor.class = "contenedor"

}