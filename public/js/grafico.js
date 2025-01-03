class Grafico {
    // Constructor de clase
    constructor(canvasId,sock_id) {
        // Crear valores basicos del grafico
        this.ctx = document.getElementById(canvasId).getContext("2d");
        this.mediciones = []; // Mediciones que tendra 
        this.maxLength = 10; // cantidad maxima de puntos representados en el grafico


        this.cantMuestrasParaActualizar = 3;
        this.contadorAcumulacion = 0;

        this.id_cliente = sock_id
        // Datos y opciones del gráfico
        this.datos_graficos = {
            labels: [],
            datasets: [{
                label: "Valores",
                data: [],
                backgroundColor: ["rgb(202, 64, 29)"],
            }]
        };

        this.opciones_graficos = {
            scales: {
                y: { beginAtZero: true },
            }
        };

        // Creamos la instancia de Chart()
        this.myChart = new Chart(this.ctx, {
            type: "line",
            data: this.datos_graficos,
            options: this.opciones_graficos
        });
    }

    // actualizarDatos(nuevaMedicion){
    //     console.log(this.mediciones)
    //     // Anadir la nueva medicion a la lista
    //     if (this.mediciones.length < this.maxLength) {
    //         this.mediciones.push(nuevaMedicion);
    //     } else {
    //         this.mediciones.shift(); // Sacar el mas viejo
    //         this.mediciones.push(nuevaMedicion); // Anadir el nuevo
    //     }

    //     // Actualizar eje X
    //     this.datos_graficos.labels.push(this.cogerHoraMinutoSegundos());

    //     // Actualizar eje Y
    //     this.datos_graficos.datasets[0].data.push(nuevaMedicion);

    //     // Limitar la longitud de los datos
    //     if (this.datos_graficos.labels.length > this.maxLength) {
    //         this.datos_graficos.labels.shift();
    //         this.datos_graficos.datasets[0].data.shift();
    //     }

    //     // Aumentar el contador de muestras
    //     this.contadorAcumulacion++;

    //     // Cuando tengamos 3 muestras acumuladas, actualizamos el grafico
    //     if (this.contadorAcumulacion >= this.cantMuestrasParaActualizar) {
    //         this.myChart.update(); // Actualizar el grafico
    //         this.contadorAcumulacion = 0; // Reiniciar el contador
    //     }
    // }



    // Sacar hora minuto segundos para eje X

    actualizarDatos(nuevaMedicion) {
        // console.log(this.mediciones);
    
        // Añadir la nueva medición a la lista
        this.mediciones.push(nuevaMedicion);
    
        // Actualizar eje X
        this.datos_graficos.labels.push(this.cogerHoraMinutoSegundos());
    
        // Actualizar eje Y
        this.datos_graficos.datasets[0].data.push(nuevaMedicion);
    
        // Aumentar el contador de muestras
        this.contadorAcumulacion++;
    
        // Cuando tengamos 3 muestras acumuladas, actualizamos el gráfico
        if (this.contadorAcumulacion >= this.cantMuestrasParaActualizar) {
            this.myChart.update(); // Actualizar el gráfico
            this.contadorAcumulacion = 0; // Reiniciar el contador
        }
    }
    

    cogerHoraMinutoSegundos() {
        let date = new Date();
        let hora = date.getHours();
        let minutos = date.getMinutes();
        let segundos = date.getSeconds();
        return `${hora}:${minutos}:${segundos}`;
    }
}
    



