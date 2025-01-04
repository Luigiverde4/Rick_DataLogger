class Grafico {
    // Constructor de clase
    constructor(canvasId,titulo) {
        // Crear valores basicos del grafico
        this.ctx = document.getElementById(canvasId).getContext("2d");
        this.mediciones = []; // Mediciones que tendra 
        this.maxLength = 10; // cantidad maxima de puntos representados en el grafico


        this.cantMuestrasParaActualizar = 3;
        this.contadorAcumulacion = 0;

        // Datos y opciones del gráfico
        // Estetico
        this.label = titulo
        this.backgroundColor =  "rgb(202, 64, 29)"
        // Linea
        this.borderWidth = 3 // Grosor linea
        this.borderColor = "rgb(140, 148, 212)"

        // Bola
        this.pointRadius = 1.5 // Radio punto
        this.pointBorderWidth = 0 // Borde punto
        this.tension = 1

        this.datos_graficos = {
            labels: [],
            datasets: [{
                label: this.label,
                data: [],
                backgroundColor: [this.backgroundColor],
                borderWidth : this.borderWidth,
                borderColor : this.borderColor,
                pointRadius : this.pointRadius,
                pointBorderWidth : this.pointBorderWidth,
                tension : this.tension
            }]
        };

        this.opciones_graficos = {
            scales: {
                y: { 
                    beginAtZero: true,
                    min: -1,
                    max: 1
                },
                x: {ticks:{maxTicksLimit: 10}},
            }
        };


        // Creamos la instancia de Chart()
        this.myChart = new Chart(this.ctx, {
            type: "line",
            data: this.datos_graficos,
            options: this.opciones_graficos
        });
    }

    actualizarDatos(nuevaMedicion) {
        // console.log(this.mediciones);
        if (this.mediciones.length >= 600) { // Cada minuto approx
            this.mediciones = this.mediciones.slice(-100);
            this.datos_graficos.labels = this.datos_graficos.labels.slice(-100); //  100 etiquetas mas recientes
            this.datos_graficos.datasets[0].data = this.datos_graficos.datasets[0].data.slice(-100); // 100 datos mas recientes
    
        }

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
    



