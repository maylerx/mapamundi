const pinesEgresados = async () => {
    try {
        const response = await fetch('/datosEgresados')
        const data = await response.json()
        console.log("Datos de egresados: ", data)
        return data
    } catch (error) {
        console.log("Error en implementación de obtener datos en map.js" + error)
    }
}

var map = L.map('map').setView([4.547597653099881, -75.66383667974051], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marcadores = [];

// recorrer los pinesEgresados y agregarlos al mapa poniendo de descripción el nombre y apellidos	
pinesEgresados().then((egresados) => {
    try {
        egresados.forEach((egresado) => {
            var info = '<h4><strong>Nombre: </strong>' + egresado.nombres + ' ' + egresado.apellidos + '</h4>' +
            '<br><h6><strong>Direccion: </strong>'+ egresado.calle_carrera + ' ' + egresado.numero_casa + ' ' + egresado.barrio_vereda +
            '<br><strong>País de Residencia: </strong>'+ egresado.pais_residencia +
            '<br><strong>Departamento de Residencia: </strong>'+ egresado.departamento_residencia +
            '<br><strong>Ciudad de Residencia: </strong>'+ egresado.ciudad_residencia +
            '<br><strong>Email: </strong>'+ egresado.email +
            '<br><strong>Número de Teléfono: </strong>' + egresado.numero_telefono +
            '<br><strong>Año de Graduación: </strong>'+ egresado.year_graduacion +
            '<br><strong>Carrera Cursada: </strong> ingeniería de Sistemas y Computación' +
            '<br><strong>Portafolio: </strong><a href="'+egresado.portafolio_url+'">'+ egresado.portafolio_url +
            '</a><br><strong>Cargo Actual: </strong>' + egresado.cargo_actual +
            '<br><strong>URL de Empresa Actual: </strong><a href="' + egresado.empresa_url + '">' + egresado.empresa_url +               
            '</a><br><br><div style="text-align: center;"><img src="' 
            + egresado.imagen_url + 
            '" alt="La foto de usuario no está disponible" '+
            'style= "widht: 100px; height: 100px;"></div></h6>';

            var popup = L.popup()
            .setContent(info);

            const marker = L.marker([egresado.coord_x, egresado.coord_y]).addTo(map)
                .bindPopup(popup);
            
            marker.on('mouseover', function () {
                marker.openPopup();
            });

            marcadores.push(marker);
        });
    } catch (error) {
        console.log("Error en iteracion de datos en map.js" + error)
    }
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

                const coordenadasObjetivo = [egresado.coord_x, egresado.coord_y];

                // Encuentra el marcador en las coordenadas objetivo
                const marcadorObjetivo = marcadores.find((marcador) => {
                    const coordenadasMarcador = marcador.getLatLng();
                    return coordenadasMarcador.lat === coordenadasObjetivo[0] && coordenadasMarcador.lng === coordenadasObjetivo[1];
                });

                // Abre el popup del marcador objetivo
                if (marcadorObjetivo) {
                    marcadorObjetivo.openPopup();
                }

                encontrado = true;
            }
        });
        if (encontrado == false) {
            Swal.fire({
                title: "Oops!",
                text: "No se encontró el graduado buscado con el nombre ingresado",
                icon: "error"
            });
        }
    });
}
