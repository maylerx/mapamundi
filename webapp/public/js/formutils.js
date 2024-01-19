$(document).ready(function () {

    // Objetivo: llenar los selectores de año de graduación
    var anioActual = new Date().getFullYear();
    for (var i = anioActual; i >= 1962; i--) {
        $('#year_graduacion, #year_graduacion_editar').append('<option value="' + i + '">' + i + '</option>');
    }

    // Objetivo: llenar los selectores de pais, departamento y ciudad

    // Función para llenar el selector de países
    function cargarPaises() {
        $.ajax({
            url: `http://api.geonames.org/countryInfoJSON?username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                console.log("Cargando paises: ", data);
                for (let i = 0; i < data.geonames.length; i++) {
                    $('#pais_residencia, #pais_residencia_editar').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].countryName}</option>`);
                }
                $('#pais_residencia').trigger('change');
            },
            error: function (error) {
                console.log("Error cargando paises: ", error);
            }
        });
    }

    // Función para cargar los departamentos según el país seleccionado
    function cargarDepartamentos(paisId, idSelector) {
        $(idSelector).empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${paisId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                console.log("Cargando departamentos: ", data);
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM1') {
                        $(idSelector).append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
                $('#departamento_residencia').trigger('change');
            }
        });
    }

    // Función para cargar las ciudades según el departamento seleccionado
    function cargarCiudades(deptoId, idSelector) {
        $(idSelector).empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${deptoId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                if (data.geonames && data.geonames.length > 0) {
                    console.log("Cargando ciudades: ", data);
                    for (let i = 0; i < data.geonames.length; i++) {
                        if (data.geonames[i].fcode === 'ADM2') {
                            $(idSelector).append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                        }
                    }
                } else {
                    console.error('La propiedad geonames es indefinida o vacía en la respuesta del servidor.');
                }
            }
        });
    }

    // Evento cuando se selecciona un país form Nuevo Egresado
    $('#pais_residencia').on('change', function () {
        const paisId = $(this).val();
        cargarDepartamentos(paisId, "#departamento_residencia");
    });

    // Evento cuando se selecciona un departamento form Nuevo Egresado
    $('#departamento_residencia').on('change', function () {
        const deptoId = $(this).val();
        cargarCiudades(deptoId, "#ciudad_residencia");
    });

    // Evento cuando se selecciona un país form Editar Egresado
    $('#pais_residencia_editar').on('change', function () {
        const paisId = $(this).val();
        cargarDepartamentos(paisId, "#departamento_residencia_editar");
    });

    // Evento cuando se selecciona un departamento form Editar Egresado
    $('#departamento_residencia_editar').on('change', function () {
        const deptoId = $(this).val();
        cargarCiudades(deptoId, "#ciudad_residencia_editar");
    });

    // Cargar lista de países al cargar la página
    cargarPaises();

    // Para obtener los datos de un egresado dado su email
    function obtenerEgresadoEmail(email) {
        obtenerDatosEgresados().then((egresados) => {
            egresados.forEach((egresado) => {
                if (egresado.email === email) {
                    document.getElementById('nombres_editar').value = egresado.nombres;
                    document.getElementById('apellidos_editar').value = egresado.apellidos;
                    document.getElementById('calle_carrera_editar').value = egresado.calle_carrera;
                    document.getElementById('numero_casa_editar').value = egresado.numero_casa;
                    document.getElementById('numero_torre_editar').value = egresado.numero_torre;
                    document.getElementById('barrio_vereda_editar').value = egresado.barrio_vereda;
                    document.getElementById('codigo_postal_editar').value = egresado.codigo_postal;
                    document.getElementById('detalles_direccion_editar').value = egresado.detalles_direccion;
                    seleccionarOpcionPorTexto('pais_residencia_editar', egresado.pais_residencia);
                    // Simular el evento change para desencadenar la lógica asociada
                    $('#pais_residencia_editar').trigger('change');
                    setTimeout(function () {
                        seleccionarOpcionPorTexto('departamento_residencia_editar', egresado.departamento_residencia);
                    }, 1500);
                    setTimeout(function () {
                        // Simular el evento change para desencadenar la lógica asociada
                        $('#departamento_residencia_editar').trigger('change');
                        seleccionarOpcionPorTexto('ciudad_residencia_editar', egresado.ciudad_residencia);
                    }, 2000);
                    document.getElementById('email_editar').value = egresado.email;
                    document.getElementById('numero_telefono_editar').value = egresado.numero_telefono;
                    document.getElementById('year_graduacion_editar').value = egresado.year_graduacion;
                    document.getElementById('coordenadas_editar').value = egresado.coord_x + ", " + egresado.coord_y;
                    document.getElementById('portafolio_url_editar').value = egresado.portafolio_url;
                    document.getElementById('cargo_actual_editar').value = egresado.cargo_actual;
                    document.getElementById('empresa_url_editar').value = egresado.empresa_url;
                    document.getElementById('datos_publicos_editar').checked = egresado.datos_publicos === 1;
                }
            });
        });
    }

    // Funcion auxiliar para seleccionar una opcion de un select dado su texto
    function seleccionarOpcionPorTexto(selectorId, texto) {
        var selector = document.getElementById(selectorId);

        for (var i = 0; i < selector.options.length; i++) {
            if (selector.options[i].text === texto) {
                selector.selectedIndex = i;
                break;
            }
        }
    }

    // Ejecutar la funcion de obtenerEgresadoEmail al cargar el modal de editar egresado
    $('#modalEditarEgresado').on('show.bs.modal', function () {
        const email = document.getElementById('email_popup').innerHTML;
        setTimeout(function () {
            obtenerEgresadoEmail(email);
        }, 200);
    });

});