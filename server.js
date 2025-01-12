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

const { inicializarArchivo, guardarDatosEnArchivo, obtenerDatosDeAPI, cargarDatosGrafica } = require("./modules/logger");

// Inicializar servidor y app
const PORT = 8080;
const app = express();
const httpServer = http.createServer(app); 
const io = new Server(httpServer); 

let datos = {}
let ultPck; 

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
app.post("/datos_IMU", async (req, res) => {
    try {
        datos = await obtenerDatosDeAPI(req); // Obtener los datos procesados
        mac = datos.mac;
        numPck = datos.numPck;

        // Si no hay MAC 
        if (!mac) {
            return res.status(400).send("MANDAR MAC DEL SENSOR"); // Validación de la MAC
        }

        // Guardar el sensor en el archivo JSON de sensores
        if (!sensores.sensores[mac]) {
            sensores.sensores[mac] = {
                id: mac,
                num: numPck
            };
            guardarsensores(); 

            // Avisar del sensor nuevo
            io.emit("cant_sensores", Object.keys(sensores.sensores).length);
        } else {
            // Si el sensor ya existe, actualizar el nº de paquete
            sensores.sensores[mac].num = numPck;
            guardarsensores(); // Guardar los sensores actualizados
        }

        // Guardar los datos en el CSV
        await guardarDatosEnArchivo(datos);

        // ACK al sensor
        res.status(200).send("Datos recibidos correctamente");

    } catch (error) {
        console.error("Error al procesar los datos IMU:", error);
        res.status(500).send("Error interno del servidor");
    }
});


// CLIENTES / ESPECTADORES
// Ruta del archivo JSON
const CLIENTS_FILE = path.join(__dirname, "public", "data", "clients.json");

// Iniciar y vaciar clientes al iniciar el server
let clientes = { clientes: {} };
try {
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clientes, null, 2), "utf8");
    console.log("Archivo de clientes vaciado correctamente.");
} catch (err) {
    console.error("Error al vaciar el archivo JSON de clientes:", err);
}

// SENSORES
const SENSOR_FILE = path.join(__dirname, "public", "data", "sensors.json");

// Iniciar y vaciar clientes al iniciar el server
let sensores = { sensores: {} };
try {
    fs.writeFileSync(SENSOR_FILE, JSON.stringify(sensores, null, 2), "utf8");
    console.log("Archivo de sensores vaciado correctamente.");
} catch (err) {
    console.error("Error al vaciar el archivo JSON de sensores:", err);
}

// Guardar clientes en el archivo JSON
function guardarClientes() {
    // TODO: Guardar hora de conexion 
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clientes, null, 2), "utf8");
}

// Guardar sensores en el archivo JSON
function guardarsensores() {
    fs.writeFileSync(SENSOR_FILE, JSON.stringify(sensores, null, 2), "utf8");
}

// Conexiones de clientes ( espectadores )
io.on("connection", (socket) => { 
    const clientId = `cliente_${socket.id}`;
    clientes.clientes[socket.id] = clientId;
    console.log("---> Usuario conectado", socket.id);

    // Guardar cambio de clientes
    guardarClientes();
    io.emit("cant_clientes", Object.keys(clientes.clientes).length); // Enviar a todos las conexiones
    
    let valores_x, valores_y;
    // Mandar ultimas 100 muestras a las graficas
    [valores_x, valores_y] = cargarDatosGrafica();
    socket.emit("valoresIniciales",{valores_x,valores_y})


    socket.on("disconnect", () => { 
        delete clientes.clientes[socket.id];
        io.emit("cant_clientes", Object.keys(clientes.clientes).length); // Enviar a todos las conexiones
        console.log("---> Cliente desconectado", socket.id);
        // Guardar cambio de clientes
        guardarClientes();
    });
});

// Enviar datos a los clientes

setInterval(() => {
    if (
        Object.keys(datos).length > 0 // Tenemos datos
        && Object.keys(clientes.clientes).length > 0  // Tenemos clientes 
        && numPck !== ultPck                           // El paquete es nuevo
    ) {
        io.emit("datosIMU", datos) // Enviar datos a los clientes
        ultPck = numPck
    }
}, 100);

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Iniciar logger 
inicializarArchivo()