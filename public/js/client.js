/*
Ricardo Roman
Proyecto Final Intera

cliente
*/

const sock = io();

// DOM - info de conexiones
elementoEstado = document.getElementById("estadoServer");
elementoCantEspect = document.getElementById("cantEspect");
elementoCantSensor = document.getElementById("cantSensores");

// DOM - valores calculados
valorMedioX = document.getElementById("valor_medio_x");
valorMaximoX = document.getElementById("valor_maximo_x");
valorMinimoX = document.getElementById("valor_minimo_x");

valorMedioY = document.getElementById("valor_medio_y");
valorMaximoY = document.getElementById("valor_maximo_y");
valorMinimoY = document.getElementById("valor_minimo_y");

// Graficos y sus datos
graficos = [];
let valoresX = [];
let valoresY = [];
let maxX = -Infinity;
let minX = Infinity;
let maxY = -Infinity;
let minY = Infinity;

// DOM - representacion bola M5
bola = document.getElementById('bola');
plane = document.getElementById('plano-cartesiano');

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
        // Actualizar datos de los graficos
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
    // Cogemos los valores de aceleracion
    acelX = datos.aceleracionX
    acelY = datos.aceleracionY

    // Actualizar los graficos con los datos de aceleración
    g_acelX.actualizarDatos(acelX);
    g_acelY.actualizarDatos(acelY);

    // Obtener las coordenadas y límites de la bola
    px = datos.posicionX;
    py = datos.posicionY;
    limiteX = datos.limiteX;
    limiteY = datos.limiteY;

    // Actualizar la bola con los datos recibidos
    actualizarBola(px, py, limiteX, limiteY);

    // Actualizar mediidas de las graficas
    actualizarValoresCalculados(acelX,acelY)
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
    bolaX = centerX + (x - 160) - bola.offsetWidth / 2; // Ajustar al rango [0, 320]
    bolaY = centerY + (y - 120) - bola.offsetHeight / 2; // Ajustar al rango [0, 240]

    // Colocar la bola en su nueva posición
    bola.style.left = `${bolaX}px`;
    bola.style.top = `${bolaY}px`;

    // Cambiar el color de la bola si se encuentra en los límites
    let color = limiteX || limiteY ? "blue" : "red";
    bola.style.backgroundColor = color;
}

function actualizarValoresCalculados(acelX,acelY){
    // Convertir los valores a números
    acelX = parseFloat(acelX);
    acelY = parseFloat(acelY);

    // Actualizar max y mins de X
    maxX = acelX > maxX ? acelX : maxX;
    minX = acelX < minX ? acelX : minX;
    // Actualizar max y mins de Y
    maxY = acelY > maxY ? acelY : maxY;
    minY = acelY < minY ? acelY : minY;

    // Guardamos los valores
    valoresX.push(acelX);
    valoresY.push(acelY);

    // Promedios
    promedioX = valoresX.reduce((a, b) => a + b, 0) / valoresX.length // np.sum(x)/len(x)
    promedioY = valoresY.reduce((a, b) => a + b, 0) / valoresY.length
    

    // Actualizar el DOM
    valorMedioX.textContent = promedioX.toFixed(2);
    valorMaximoX.textContent = maxX.toFixed(2);
    valorMinimoX.textContent = minX.toFixed(2);

    valorMedioY.textContent = promedioY.toFixed(2);
    valorMaximoY.textContent = maxY.toFixed(2);
    valorMinimoY.textContent = minY.toFixed(2);
}