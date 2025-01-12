/*
Ricardo Roman
Proyecto Final Intera

cliente
*/

const sock = io();
elementoEstado = document.getElementById("estadoServer");
elementoCantEspect = document.getElementById("cantEspect");
elementoCantSensor = document.getElementById("cantSensores");
graficos = [];

// Referencias para la bola y el plano cartesiano
ball = document.getElementById('ball');
plane = document.getElementById('cartesian-plane');

// Calcular el centro del plano cartesiano (0, 0)
const planeRect = plane.getBoundingClientRect();
const centerX = planeRect.width / 2;
const centerY = planeRect.height / 2;

sock.on("connect", (msj) => {
    console.log("Conectado al servidor");
    elementoEstado.textContent = "Conectado";
    console.log("Mensaje recibido\n", msj);

    // Generar gráfico
    g_acelX = new Grafico("g_acelX", "Aceleración en eje X");
    g_acelY = new Grafico("g_acelY", "Aceleración en eje Y");
    graficos.push(g_acelX);
    graficos.push(g_acelY);


    sock.on("valoresIniciales", ({ valores_x, valores_y }) => {
        console.log("Valores iniciales recibidos:", valores_y);

        // Actualizar datos de los gráficos
        for (let valor of valores_x) {
            g_acelX.actualizarDatos(valor);
        }

        for (let valor of valores_y) {
            g_acelY.actualizarDatos(valor);
        }
    });

});

sock.on("disconnect", () => {
    console.log("Desconectado del servidor");
    elementoEstado.textContent = "Desconectado";
});

// Recibir datos del servidor
sock.on("datosIMU", (datos) => {
    // Actualizar los gráficos con los datos de aceleración
    g_acelX.actualizarDatos(datos.aceleracionX);
    g_acelY.actualizarDatos(datos.aceleracionY);

    // Obtener las coordenadas y límites de la bola
    const px = datos.posicionX;
    const py = datos.posicionY;
    const limiteX = datos.limiteX;
    const limiteY = datos.limiteY;

    // Actualizar la bola con los datos recibidos
    actualizarBola(px, py, limiteX, limiteY);
});

// Otros datos de conexión
sock.on("cant_clientes", (cant_clientes) => {
    console.log("Cant_clientes", cant_clientes);
    elementoCantEspect.textContent = cant_clientes;
});

sock.on("cant_sensores", (cant_sensores) => {
    console.log("Cant_sensores", cant_sensores);
    elementoCantSensor.textContent = cant_sensores;
});

// Actualizar la bola (pos y color)
function actualizarBola(x, y, limiteX, limiteY) {
    // Limitar los valores de X y Y dentro del plano
    x = Math.max(0, Math.min(320, x)); // Limitar X entre 0 y 320
    y = Math.max(0, Math.min(240, y)); // Limitar Y entre 0 y 240

    // Calcular la posición de la bola en el plano
    const ballX = centerX + (x - 160) - ball.offsetWidth / 2; // Ajustar al rango [0, 320]
    const ballY = centerY + (y - 120) - ball.offsetHeight / 2; // Ajustar al rango [0, 240]

    // Colocar la bola en su nueva posición
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Cambiar el color de la bola si se encuentra en los límites
    let color = limiteX || limiteY ? "blue" : "red";
    ball.style.backgroundColor = color;
}

