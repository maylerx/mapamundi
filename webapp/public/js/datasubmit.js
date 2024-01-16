// Objetivo: enviar datos al servidor mediante AJAX
$(document).ready(function () {
    $('#formNuevoEgresado').submit(function (event) {
        event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

        var formData = new FormData(this); // Obtiene los datos del formulario

        $.ajax({
            type: 'POST',
            url: '/agregarEgresado',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.alert) {
                    Swal.fire({
                        title: data.alertTitle,
                        text: data.alertMessage,
                        icon: data.alertIcon,
                        showConfirmButton: data.showConfirmButton,
                        timer: data.timer
                    }).then(() => {
                        if (data.ruta != '') {
                            location.reload();
                        } 
                    });
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error,
                });
                console.log(error);
            }
        });
    });
});

// Objetivo: llenar los selectores de año de graduación y de país
$(document).ready(function () {
    var anioActual = new Date().getFullYear();
    for (var i = anioActual; i >= 1962; i--) {
        $('#year_graduacion').append('<option value="' + i + '">' + i + '</option>');
    }
});

// Objetivo: llenar los selectores de pais, departamento y ciudad
$(document).ready(function () {
    // Función para llenar el selector de países
    function cargarPaises() {
        $.ajax({
            url: `http://api.geonames.org/countryInfoJSON?username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                console.log("Cargando paises: ", data);
                for (let i = 0; i < data.geonames.length; i++) {
                    $('#pais_residencia').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].countryName}</option>`);
                }
            },
            error: function (error) {
                console.log("Error cargando paises: ", error);
            }
        });
    }

    // Función para cargar los departamentos según el país seleccionado
    function cargarDepartamentos(paisId) {
        $('#departamento_residencia').empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${paisId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM1') {
                        $('#departamento_residencia').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
            }
        });
    }

    // Función para cargar las ciudades según el departamento seleccionado
    function cargarCiudades(deptoId) {
        $('#ciudad_residencia').empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${deptoId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM2') {
                        $('#ciudad_residencia').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
            }
        });
    }

    // Cargar lista de países al cargar la página
    cargarPaises();

    // Evento cuando se selecciona un país
    $('#pais_residencia').on('change', function () {
        const paisId = $(this).val();
        cargarDepartamentos(paisId);
    });

    // Evento cuando se selecciona un departamento
    $('#departamento_residencia').on('change', function () {
        const deptoId = $(this).val();
        cargarCiudades(deptoId);
    });
});