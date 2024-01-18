$(document).ready(function () {
    // Objetivo: enviar datos de un nuevo graduado al servidor mediante AJAX

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
