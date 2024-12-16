#!/bin/bash

# Ruta del script de tu aplicación en Node.js
APP_PATH="/home/usuario/mapamundi/app.js"

# Archivo para registrar logs de `forever`
LOG_FILE="/home/usuario/mapamundi/forever.log"

# Tiempo de espera entre verificaciones (en segundos)
CHECK_INTERVAL=10

# Función para verificar si `forever` está ejecutando la aplicación
is_forever_running() {
    forever list | grep -q "$APP_PATH"
    return $?
}

# Bucle infinito para mantener `forever` ejecutándose
while true; do
    if ! is_forever_running; then
        echo "[$(date)] La aplicación no está corriendo. Reiniciando..." >> $LOG_FILE
        forever start -a -l $LOG_FILE $APP_PATH
    fi
    sleep $CHECK_INTERVAL
done
