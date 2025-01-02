/*
Ricardo Roman
Proyecto Final Intera

cliente
*/

const sock = io()
elementoEstado = document.getElementById("estadoServer")

sock.on("connect",()=>{
    console.log("Conectado al servidor")
    elementoEstado.textContent = "Conectado"
});

sock.on("disconnect",()=>{
    console.log("Desconectado del servidor")
    elementoEstado.textContent = "Desconectado"
});