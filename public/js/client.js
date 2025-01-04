/*
Ricardo Roman
Proyecto Final Intera

cliente
*/

const sock = io()
elementoEstado = document.getElementById("estadoServer")
elementoCantEspect = document.getElementById("cantEspect")
elementoCantSensor = document.getElementById("cantSensores")
graficos = []

sock.on("connect",(msj)=>{
    console.log("Conectado al servidor")
    elementoEstado.textContent = "Conectado"
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
    elementoEstado.textContent = "Desconectado"
});

// Recibir datos del servidor

let i = 0
// Sensores
sock.on("datosIMU",(datos)=>{    
    g_acelX.actualizarDatos(datos.aceleracion.x);    
    g_acelY.actualizarDatos(datos.aceleracion.y);    
    
})


// Otros datos
sock.on("cant_clientes",(cant_clientes)=>{
    console.log("Cant_clientes",cant_clientes)
    elementoCantEspect.textContent = cant_clientes
});

sock.on("cant_sensores",(cant_sensores)=>{
    console.log("Cant_sensores",cant_sensores)
    elementoCantSensor.textContent = cant_sensores
})

function construyeVisualizadores(){
    console.log("construyeVisualizadores")
    let contenedor = document.createElement("div")
    contenedor.class = "contenedor"

}