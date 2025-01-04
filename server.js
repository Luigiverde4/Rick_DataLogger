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
    mac = req.body.mac
    if (!mac){
        res.status(400).send("MANDAR MAC DEL SENSOR")
    }

    // Guardar el sensor en sensors.json
    if (!sensores.sensores[mac]) {
        // Si el sensor es nuevo, lo registramos
        sensores.sensores[mac] = {
            id: mac,
            num: Object.keys(sensores.sensores).length // TODO: Cant de pck?
        };
        guardarsensores()
        io.emit("cant_sensores", Object.keys(sensores.sensores).length); // Enviar a todos las conexiones
    }

    // Guardar datos
    // TODO MAS TARDE

    // Confirmar datos recibidos
    res.status(200).send("Datos recibidos correctamente");
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
    // TODO implementar id de paquete para no agregar siempre el mismo si se deja de conectar
    // Si tenemos datos y clientes
    if (Object.keys(datos || {}).length > 0 && clientes.length != 0) {
        
        acelX = datos.aceleracion.x
        acelY = datos.aceleracion.y
        px = datos.posicion.x
        py = datos.posicion.y
        limiteX = datos.limites.limiteX
        limiteY = datos.limites.limiteY

        io.emit("acelX", acelX); 
        io.emit("acelY", acelY); 
        
        
        // console.log("Datos enviados:", datos);
    }
},100); // Ajusta el intervalo si es necesario

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});