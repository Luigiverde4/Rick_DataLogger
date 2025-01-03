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


// Inicializar servidor y app
const PORT = 8080;
const app = express();
const httpServer = http.createServer(app); 
const io = new Server(httpServer); 

let datos = {}


// APLICACION

// Middleware para procesar solicitudes JSON
app.use(express.json());  // Asegúrate de tener esto para que req.body sea un objeto JSON

// Mandar archivos a los clientes
app.use(express.static(__dirname));

// Mandar el index en específico cuando no se especifica ninguna ruta
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para recibir los datos IMU
app.post("/datos_IMU", (req, res) => {
    datos = req.body;  // Los datos enviados por el cliente

    // Guardar datos

    // Confirmar datos recibidos
    res.status(200).send("Datos recibidos correctamente");
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

// Conexiones de clientes ( espectadores )
io.on("connection", (socket) => { 
    const clientId = `cliente_${socket.id}`;
    clientes.clientes[socket.id] = clientId;
    console.log("---> Usuario conectado", socket.id);

    // Guardar cambio de clientes
    guardarClientes();

    socket.on("disconnect", () => { 
        delete clientes.clientes[socket.id];
        console.log("---> Cliente desconectado", socket.id);

        // Guardar cambio de clientes
        guardarClientes();
    });
});

// Enviar datos a los clientes
setInterval(() => {
    if (Object.keys(datos || {}).length > 0) {
        acelX = datos.aceleracion.x
        io.emit("acelX", acelX); // Enviar los datos reales
        // console.log("Datos enviados:", datos);
    }
},0); // Ajusta el intervalo si es necesario



// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});