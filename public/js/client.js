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

ball = document.getElementById('ball');
plane = document.getElementById('cartesian-plane');

// Calcular el centro del plano (0,0)
const planeRect = plane.getBoundingClientRect();
const centerX = planeRect.width / 2;
const centerY = planeRect.height / 2;

sock.on("connect",(msj)=>{
    console.log("Conectado al servidor")
    elementoEstado.textContent = "Conectado"
    console.log("Mensaje recibido\n",msj)

    // Generar grafico
    // Crear instancias de la clase Grafico para cada cliente
    g_acelX = new Grafico("g_acelX", "Aceleración en eje X");
    g_acelY = new Grafico("g_acelY", "Aceleración en eje Y");
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
    g_acelX.actualizarDatos(datos.aceleracionX);    
    g_acelY.actualizarDatos(datos.aceleracionY);    
    px = datos.posicionX
    py = datos.posicionY
    limiteX = datos.limiteX
    limiteY = datos.limiteY
    actualizarBola(px, py, limiteX, limiteY);
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

// Bola

// Mover la bola
function actualizarBola(x, y,limiteX,limiteY) {
    // Limitar ejes
    x = Math.max(0, Math.min(320, x)); // Limitar X entre 0 y 320
    y = Math.max(0, Math.min(240, y)); // Limitar Y entre 0 y 240
  
    // Calcular pos de la bola en el plano
    const ballX = centerX + (x - 160) - ball.offsetWidth; // Ajustar al rango [0, 320]
    const ballY = centerY + (y - 120) - ball.offsetHeight; // Ajustar al rango [0, 240]
  
    // Colocar la bola
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    let color = limiteX || limiteY ? "blue" : "red";
    ball.style.backgroundColor = color;
}
  

function construyeVisualizadores(){
    console.log("construyeVisualizadores")
    let contenedor = document.createElement("div")
    contenedor.class = "contenedor"

}