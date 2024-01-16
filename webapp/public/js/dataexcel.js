// EXPORTACION DE EXCEL
document.getElementById('exportar-btn').addEventListener('click', function () {
    fetch('/exportarExcel', {
        method: 'GET',
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'graduados.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error al exportar a XLSX:', error));
});

// IMPORTACION DE EXCEL
$(document).ready(function () {
    // Handler para el botón "Importar Datos Excel"
    $('#importar-btn').click(function () {
        // Simular clic en el input de archivo
        $('#archivoExcel').click();
    });

    // Handler para el cambio en el input de archivo
    $('#archivoExcel').change(function () {
        var fileInput = $(this)[0];
        var file = fileInput.files[0];

        if (file) {
            // Crear objeto FormData y agregar el archivo
            var formData = new FormData();
            formData.append('archivoExcel', file);

            // Enviar la petición POST al servidor
            $.ajax({
                type: 'POST',
                url: '/importarExcel',
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
        }
    });
});
