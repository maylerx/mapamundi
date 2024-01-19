// Funcion para enviar la respuesta sweetAlert al cliente
function enviarRespuestaSweetAlert(res, alertTitle, alertMessage, alertIcon, showConfirmButton, timer, ruta) {
    res.json({
        alert: true,
        alertTitle: alertTitle,
        alertMessage: alertMessage,
        alertIcon: alertIcon,
        showConfirmButton: showConfirmButton,
        timer: timer,
        ruta: ruta
    });
}

// Funcion para renderizar la respuesta con sweetAlert al cliente
function renderizarRespuestaSweetAlert(res, rutaFuente, alertTitle, alertMessage, alertIcon, showConfirmButton, timer, ruta) {
    res.render(rutaFuente, {
        alert: true,
        alertTitle: alertTitle,
        alertMessage: alertMessage,
        alertIcon: alertIcon,
        showConfirmButton: showConfirmButton,
        timer: timer,
        ruta: ruta
    });
}

module.exports = { enviarRespuestaSweetAlert, renderizarRespuestaSweetAlert };