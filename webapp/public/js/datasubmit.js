$(document).ready(function () {
    // Objetivo: enviar datos de un nuevo graduado al servidor mediante AJAX

    $('#formNuevoEgresado').submit(function (event) {
        // Evita que se envíe el formulario de forma tradicional
        event.preventDefault();

        // Obtiene los datos del formulario
        var formData = new FormData(this);

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

    // Objetivo: enviar datos de edición de un graduado al servidor mediante AJAX

    $('#formEditarEgresado').submit(function (event) {
        event.preventDefault();
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Estás seguro de hacer el cambio?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Obtiene los datos del formulario
                var formData = new FormData(this);
                const email_original = document.getElementById('email_popup').innerHTML;
                const numero_telefono_original = document.getElementById('numero_telefono_popup').innerHTML;

                // Agrega el email original del graduado al formData
                formData.append('email_original', email_original);
                formData.append('numero_telefono_original', numero_telefono_original);

                $.ajax({
                    type: 'PUT',
                    url: '/editarEgresado',
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
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "No se han editado los datos del graduado",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });

    // Objetivo: enviar la petición DELETE al servidor mediante AJAX

    // Ejecutar la funcion de obtenerEgresadoEmail al cargar el modal de editar egresado

    $(document).on('click', '#botonEliminarEgresado', function () {
        //Impresión de mensaje de confirmación
        console.log("Botón de eliminar presionado");

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Estás seguro de eliminar los datos del egresado?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const email= document.getElementById('email_popup').innerHTML;

                // Enviar una petición DELETE al servidor para eliminar los datos del egresado
                $.ajax({
                    type: 'DELETE',
                    url: '/eliminarEgresado',
                    data: { email: email },
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
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "No se han eliminado los datos del graduado",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });

});