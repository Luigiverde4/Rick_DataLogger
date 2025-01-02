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

// Iniiciar servidores y app
const PORT = 8080;
const app = express();
const httpServer = http.createServer(app); 
const io = new Server(httpServer); 


// Mandar archivos a los clientes
app.use(express.static(__dirname))

// Mandar el index en especifico cuando no se especifica ninguna ruta
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
  

clientes = new Map()

// Conexion de un cliente
io.on("connection", (socket) => { 
    clientes.set(socket.id, `cliente_${socket.id}`);
    console.log("---> Usuario conectado",socket.id);

    socket.on("disconnect", () => { 
        clientes.delete(socket.id);
        console.log("---> Cliente desconectado", socket.id);
    });
});

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}/public/client.html`);
});
