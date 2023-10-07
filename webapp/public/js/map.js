const pinesEgresados = async () => {
    try {
        const response = await fetch('/coordenadas')
        const data = await response.json()
        console.log("Datos de coordenadas: \n" + data)
        return data
    } catch (error) {
        console.log("Error en map.js" + error)
    }
}

var map = L.map('map').setView([4.547597653099881, -75.66383667974051], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// recorrer los pinesEgresados y agregarlos al mapa poniendo de descripción el nombre y apellidos	
pinesEgresados().then((egresados) => {
    egresados.forEach((egresado) => {
        L.marker([egresado.coord_x, egresado.coord_y]).addTo(map)
            .bindPopup('Egresado: ' + egresado.nombres + ' ' + egresado.apellidos +
                '<br><br><div style="text-align: center;"><img src="' 
                + egresado.imagen_url + 
                '" alt="La foto de usuario no está disponible y sólo la pueden observar los administradores" '+
                'style= "widht: 80px; height: 80px;"></div>');
    });
});

// Para la busqueda de egresados
document.getElementById('egresado_buscar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento por defecto del Enter en un formulario
        buscarEgresado(this.value);
    }
});

function buscarEgresado(nombreCompleto) {
    pinesEgresados().then((egresados) => {
        var encontrado = false;
        egresados.forEach((egresado) => {
            if ((egresado.nombres + ' ' + egresado.apellidos).toLowerCase().replace(/\s/g, '') === nombreCompleto.toLowerCase().replace(/\s/g, '')) {
                map.flyTo([egresado.coord_x, egresado.coord_y], 16);
                L.map.getElementById().bindPopup().openPopup();
                encontrado = true;
            }
        });
        if (encontrado == false) {
            alert("No se encontró el egresado")
        }
    });
}
