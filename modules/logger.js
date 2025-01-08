const fs = require("fs");
const path = require("path");

const LOGDIR = path.join("public", "logs");
const LOGFILE = path.join(LOGDIR, "logfile.csv");

// Función para inicializar el archivo de log
async function inicializarArchivo() {
    // Asegúrate de que el directorio existe
    if (!fs.existsSync(LOGDIR)) {
        fs.mkdirSync(LOGDIR, { recursive: true });
    }

    // Crear un nuevo archivo con el encabezado
    const encabezado = [
        "Fecha",
        "Hora",
        "MAC",
        "num_pck",
        "acc_x",
        "acc_y",
        "px",
        "py",
        "lim_x",
        "lim_y"
    ].join(";") + "\n";

    try {
        fs.writeFileSync(LOGFILE, encabezado);
        console.log("Archivo de log inicializado con encabezado.");
    } catch (err) {
        console.error("Error al crear el archivo de log:", err.message);
    }
}


// Coger los datos recibidos en el endpoint y convertirlos en un objeto
async function obtenerDatosDeAPI(req) {
    const data = req.body;  // Datos

    // Fecha
    const ahora = new Date();
    let dd = String(ahora.getDate()).padStart(2, '0');
    let mm = String(ahora.getMonth() + 1).padStart(2, '0');
    let aaaa = ahora.getFullYear();
    let ddmmaa = `${dd}/${mm}/${aaaa}`;

    // Hora
    let hh = String(ahora.getHours()).padStart(2, '0');
    let mm2 = String(ahora.getMinutes()).padStart(2, '0');
    let ss = String(ahora.getSeconds()).padStart(2, '0');
    let hhmmss = `${hh}:${mm2}:${ss}`;

    return {
        fecha: ddmmaa,
        hora: hhmmss,
        mac: data.mac ?? "N/A", // Si no hay MAC en los datos, ponemos "N/A"
        numPck: data.id ?? "N/A", // Lo mismo para el número de paquete
        aceleracionX: data.aceleracion?.x?.toFixed(3) ?? "N/A",
        aceleracionY: data.aceleracion?.y?.toFixed(3) ?? "N/A",
        posicionX: data.posicion?.px?.toFixed(3) ?? "N/A",
        posicionY: data.posicion?.py?.toFixed(3) ?? "N/A",
        limiteX: data.limites?.limiteX ?? "N/A",
        limiteY: data.limites?.limiteY ?? "N/A"
    };
}

// Pasar de objeto al .CSV
async function guardarDatosEnArchivo(datos,numPck) {
    const linea = [
        datos.fecha,
        datos.hora,
        datos.mac,
        datos.numPck,
        datos.aceleracionX,
        datos.aceleracionY,
        datos.posicionX,
        datos.posicionY,
        datos.limiteX,
        datos.limiteY
    ].join(";") + "\n";

    try {
        fs.writeFile(LOGFILE, linea, { flag: 'a' }, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de log:', err);
            } else {
                // console.log('Log escrito');
            }
        });
    } catch (err) {
        console.error("Error al escribir en el archivo de log:", err.message);
    }
}

module.exports = {
    inicializarArchivo,
    guardarDatosEnArchivo,
    obtenerDatosDeAPI
};