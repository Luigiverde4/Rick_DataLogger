/*
Ricardo Roman
Proyecto Final Intera

Servidor
*/

// Requires
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io"); 
const fs = require("fs");


const { logearDatos, inicializarArchivo, obtenerDatosSensores } = require("./public/js/logger");

// Inicializar servidor y app
const PORT = 8080;
const app = express();
const httpServer = http.createServer(app); 
const io = new Server(httpServer); 

// APLICACION
// Mandar archivos a los clientes
app.use(express.static(__dirname));

// Mandar el index en específico cuando no se especifica ninguna ruta
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// CLIENTES
// Ruta del archivo JSON
const CLIENTS_FILE = path.join(__dirname, "public", "data", "clients.json");

// Cargar clientes desde el archivo JSON
let clientes = {};
if (fs.existsSync(CLIENTS_FILE)) {
    try {
        clientes = JSON.parse(fs.readFileSync(CLIENTS_FILE, "utf8"));
    } catch (err) {
        console.error("Error leyendo el archivo JSON de clientes:");
        clientes = { clientes: {} };
    }
} else {
    clientes = { clientes: {} };
}

// Guardar clientes en el archivo JSON
function guardarClientes() {
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clientes, null, 2), "utf8");
}

// Conexiones
io.on("connection", (socket) => { 
    const clientId = `cliente_${socket.id}`;
    clientes.clientes[socket.id] = clientId;
    console.log("---> Usuario conectado", socket.id);

    // Guardar cambio de clientes
    guardarClientes();

    // Configuración de los datos del cliente
    socket.on("startLogging", () => {
        console.log(`Iniciando registro de datos para cliente ${socket.id}`);
        // Iniciar el registro de datos para este cliente
        setInterval(async () => {
            const datos = await obtenerDatosSensores();
            if (datos) {
                // Guardar los datos en el archivo CSV
                logearDatos(datos);
            }
        }, 2000); // Intervalo de 2 segundos
    });

    socket.on("disconnect", () => { 
        delete clientes.clientes[socket.id];
        console.log("---> Cliente desconectado", socket.id);

        // Guardar cambio de clientes
        guardarClientes();
    });
});

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Iniciar el archivo de log
inicializarArchivo();