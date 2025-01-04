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
    g_acelX = new Grafico("g_acelX", sock.id);
    g_acelY = new Grafico("g_acelY", sock.id);
    graficos.push(g_acelX)
    graficos.push(g_acelY)

});

sock.on("disconnect",()=>{
    console.log("Desconectado del servidor")
    elementoEstado.textContent = "Estado de la conexion: Desconectado"
});

// Recibir datos del servidor
sock.on("acelX", (dato) => {
    // console.log(dato)
    // Actualizar todos los gráficos con el dato recibido
    g_acelX.actualizarDatos(dato);    
});

sock.on("acelY", (dato) => {
    // console.log(dato)
    // Actualizar todos los gráficos con el dato recibido
    g_acelY.actualizarDatos(dato);    
});


function construyeVisualizadores(){
    console.log("construyeVisualizadores")
    let contenedor = document.createElement("div")
    contenedor.class = "contenedor"

}