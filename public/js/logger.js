const senseHat = (process.env.USER == "pi") 
    ? require("node-sense-hat") 
    : require("./node-sense-hat-emu");

// Configuración
const LOGFILE = "logfile.csv";

const IMU = new senseHat.Imu.IMU();

// Función para crear el archivo CSV con encabezados si no existe
const fs = require('fs')

// Inicio del proyecto
inicializarArchivo()
// Ir guardando datos
setInterval(logearDatos, 2000)

async function inicializarArchivo() {
    // Comprobamos si el archivo existe
    if (!fs.existsSync(LOGFILE)) {
        // Si no existe, preparamos el encabezado
        const encabezado = [
            "Fecha",
            "Hora",
            "Temperatura (ºC)",
            "Presión (Pa)",
            "Humedad (%)",
            "Orientación YPR (º)",
            "Acelerómetro XYZ (g)",
            "Giroscopio XYZ (º/s)",
            "Magnetómetro XYZ (G)"
        ].join(";") + "\n";

        try {
            // Escribimos el encabezado
            fs.writeFileSync(LOGFILE, encabezado); // 'wx' para escribir solo si el archivo no existe
            console.log("Archivo de log creado con encabezado.");
        } catch (err) {
            // Error creando el archivo de log
            console.error("Error al crear el archivo de log:", err.message);
        }
    }
}

async function obtenerDatosSensores() {
    try {
        const data = IMU.getValueSync();
        // console.log("Datos IMU:", data); // inspeccion de datos

        const ahora = new Date();
        let dd = String(ahora.getDate()).padStart(2, '0');
        let mm = String(ahora.getMonth() + 1).padStart(2, '0'); 
        let aaaa = ahora.getFullYear()
        let ddmmaa = `${dd}/${mm}/${aaaa}`
    
        // HH/MM/SS (agregando el 0 si es 5 -> 05)
        let hh = String(ahora.getHours()).padStart(2, '0')
        let mm2 = String(ahora.getMinutes()).padStart(2, '0')
        let ss = String(ahora.getSeconds()).padStart(2, '0')
        let hhmmss = `${hh}:${mm2}:${ss}`
    

        resultado = {
            fecha: ddmmaa,
            hora: hhmmss,
        
            // Comprobamos si es null con ??
            // Lo dejamos en null con ?.
            temperatura: data.temperature?.toFixed(1) ?? "N/A",
            presion: data.pressure?.toFixed(1) ?? "N/A",
            humedad: data.humidity?.toFixed(1) ?? "N/A",
        
            orientacion: data.fusionPose
                ? 
                `${data.fusionPose.x?.toFixed(1) ?? "N/A"},${data.fusionPose.y?.toFixed(1) ?? "N/A"},${data.fusionPose.z?.toFixed(1) ?? "N/A"}`
                : "N/A,N/A,N/A",
            acelerometro: data.accel
                ? 
                `${data.accel.x?.toFixed(3) ?? "N/A"},${data.accel.y?.toFixed(3) ?? "N/A"},${data.accel.z?.toFixed(3) ?? "N/A"}`
                : "N/A,N/A,N/A",
            giroscopio: data.gyro
                ? 
                `${data.gyro.x?.toFixed(3) ?? "N/A"},${data.gyro.y?.toFixed(3) ?? "N/A"},${data.gyro.z?.toFixed(3) ?? "N/A"}`
                : "N/A,N/A,N/A",
            magnetometro: data.compass
                ? 
                `${data.compass.x?.toFixed(3) ?? "N/A"},${data.compass.y?.toFixed(3) ?? "N/A"},${data.compass.z?.toFixed(3) ?? "N/A"}`
                : "N/A,N/A,N/A"
        }        
        // Devolver los datos en formato CSV
        return resultado;
    } catch (error) {
        console.error("Error al obtener datos de sensores:", error);
        return null;
    }
}

// Escribir datos en el archivo CSV
async function guardarDatosEnArchivo(datos) {
    // Valores de la linea a escribir
    const linea = [
        datos.fecha,
        datos.hora,
        datos.temperatura,
        datos.presion,
        datos.humedad,
        datos.orientacion,
        datos.acelerometro,
        datos.giroscopio,
        datos.magnetometro
    ].join(";") + "\n";

    try {
        // Escribir en el archivo la linea con los datos
        fs.writeFile(LOGFILE, linea, {flag: 'a'}, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de log:', err);
            } else {
                console.log('Log escrito');
            }
        });    
    } catch (err) {
        // Error al escribir
        console.error("Error al escribir en el archivo de log:", err.message);
    }
}


async function logearDatos(){
    const datos = await obtenerDatosSensores()
    if (datos){
        guardarDatosEnArchivo(datos)
    }
}

module.exports = {
    inicializarArchivo,
    obtenerDatosSensores,
    logearDatos,
};
