from m5stack import lcd, btnA, btnC, rgb, speaker
import imu, utime
import urequests
import network


lcd.font(lcd.FONT_DejaVu18)
mpu = imu.IMU()

# CONEXION SERVIDOR
SERVER_URL = "http://127.0.0.1:8080/datos_IMU"  # Endpoint en el server

# Esfera
px = lcd.screensize()[0] // 2  # Que se ponga en el medio de la pantalla
py = lcd.screensize()[1] // 2
r = 5  # Radio   
lcd.circle(px, py, r, lcd.RED, fillcolor=lcd.RED)

# Limites pantalla
limiteX = False
limiteY = False
limiteX_anterior = False
limiteY_anterior = False
pitido = False
cambio = False

kx = 160 / 0.7
ky = 120 / 0.7

suavizados = [1, 0.9, 0.8, 0.7, 0.5, 0.3, 0.25, 0]
suaivzado_index = 0


idPck = 0 #id pck
def getMacAddr():
    wlan = network.WLAN(network.STA_IF)
    mac = wlan.config('mac')
    return ':'.join(['%02x' % b for b in mac])

def enviar_datos(datos):
    """
    Envía datos al servidor a través de una solicitud POST.
    
    datos: diccionario con los datos del IMU
    """
    try:
        global idPck
        mac = getMacAddr()
        datos["mac"] = mac
        datos["id"] = idPck
        idPck += 1
        # print(datos["id"])
        headers = {'Content-Type': 'application/json'}  # El tipo de contenido que estamos enviando
        response = urequests.post(SERVER_URL, json=datos, headers=headers)
        if response.status_code == 200:
            print("Datos enviados correctamente")
        else:
            print(f"Error al enviar los datos: {response.status_code}")
    except Exception as e:
        print(f"Error al realizar POST: {e}")

def borrarBola(x1, y1):
    """
    Borra la bola roja visible

    x1: coordenada x de la bola
    y1: coordenada y de la bola
    """
    lcd.circle(x1, y1, r + 5, lcd.BLACK, fillcolor=lcd.BLACK)

def promediarMedidas(muestras):
    """
    Saca el promedio de un array de medidas

    muestras: array muestras a promediar

    return: promedio de muestras
    """
    if len(muestras) == 0:
        return 0

    return sum(muestras) / len(muestras)

def suavizado(actual, pre, sm=0.2):
    """
    Filtrar coordenadas x, y, z del accel y giroscopio

    actual: valor actual de X[n]
    pre: Valor anterior suavizado Y[n-1]
    sm: Coef de suavizado (0-> mas suave y lento 1-> Más ruido y más rápido) (0.5 a 0.9)

    return: valor suavizado
    """
    return sm * actual + (1 - sm) * pre

# Poner Offset 
utime.sleep_ms(250)
acelX20, acelY20 = [], []

for i in range(20):  # 20 muestras
    # Giroscopio
    acel20 = mpu.gyro
    acelX20.append(acel20[0])
    acelY20.append(acel20[1])

# Sacar Offset
acelOffsetX = promediarMedidas(acelX20)
acelOffsetY = promediarMedidas(acelY20)
acelOffset = [acelOffsetX, acelOffsetY]

# Mostrar en pantalla 
lcd.clear()
utime.sleep_ms(50)
lcd.print("Offsets:", 0, 0, lcd.RED)
lcd.print("AcelX, AcelY", 10, 30, lcd.WHITE)
lcd.print(f"{acelOffsetX:.2f} {acelOffsetY:.2f}", 10, 60, lcd.WHITE)
utime.sleep(2)
lcd.clear()


while True:
    utime.sleep_ms(20)

    # Medir giroscopio
    acel = mpu.acceleration

    acelX = float(acel[0] - acelOffset[0])
    acelY = float(acel[1] - acelOffset[1])

    # Quitar circulo antiguo
    borrarBola(px, py)

    # Calcular posicion nueva
    px = int(suavizado(int(acelX * kx + 160), px, suavizados[suaivzado_index]))
    py = int(suavizado(int(acelY * ky + 120), py, suavizados[suaivzado_index]))

    # Limitar bordes eje X
    if px >= lcd.screensize()[0]:
        px = lcd.screensize()[0]
        limiteX = True
    elif px <= 0:
        px = 0
        limiteX = True
    else:
        limiteX = False

    # Limitar bordes eje Y
    if py >= lcd.screensize()[1]:
        py = lcd.screensize()[1]
        limiteY = True
    elif py <= 0:
        py = 0
        limiteY = True
    else:
        limiteY = False

    # Escoger suavizado
    if btnC.wasPressed():
        suaivzado_index = (suaivzado_index + 1) % 8
        print(f"SM: {suavizados[suaivzado_index]}")

    # Dibujar
    if limiteX or limiteY:
        lcd.circle(px, py, r, lcd.BLUE, fillcolor=lcd.BLUE)
    else:
        lcd.circle(px, py, r, lcd.RED, fillcolor=lcd.RED)

    # Detectar si esta tocando por primera vez o no
    cambio = (limiteX != limiteX_anterior) or (limiteY != limiteY_anterior)
    if cambio and (limiteX or limiteY):
        speaker.tone()  

    # Actualizar limites
    limiteX_anterior = limiteX
    limiteY_anterior = limiteY

    # Preprar datos IMU para enviar
    datos_imu = {
        "aceleracion": {
            "x": acelX,
            "y": acelY
        },
        "posicion": {
            "px": px,
            "py": py
        },
        "limites": {
            "limiteX": limiteX,
            "limiteY": limiteY
        }
    }
    enviar_datos(datos_imu)
