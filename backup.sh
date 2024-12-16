#!/bin/bash

# Ruta del proyecto
PROJECT_PATH="/home/usuario/mapamundi"

# Ruta donde se guardarán las copias de seguridad
BACKUP_PATH="/home/usuario/backups"

# Nombre del archivo de respaldo
BACKUP_NAME="mapamundi_backup_$(date +%Y%m%d_%H%M%S).tar.gz"

# Crear el directorio de respaldo si no existe
mkdir -p "$BACKUP_PATH"

# Crear la copia de seguridad
echo "Creando copia de seguridad de $PROJECT_PATH..."
tar -czf "$BACKUP_PATH/$BACKUP_NAME" -C "$PROJECT_PATH" .

# Verificar si el respaldo fue exitoso
if [ $? -eq 0 ]; then
    echo "Copia de seguridad creada exitosamente: $BACKUP_PATH/$BACKUP_NAME"
else
    echo "Error al crear la copia de seguridad."
    exit 1
fi

# Eliminar copias de seguridad más antiguas de X días
DAYS_TO_KEEP=30
find "$BACKUP_PATH" -type f -name "mapamundi_backup_*.tar.gz" -mtime +$DAYS_TO_KEEP -exec rm {} \;
echo "Copias de seguridad más antiguas de $DAYS_TO_KEEP días eliminadas."
