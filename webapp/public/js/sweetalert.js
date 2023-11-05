document.addEventListener('DOMContentLoaded', function () {
    Swal.fire({
        title: '<%= alertTitle %>',
        text: '<%= alertMessage %>',
        icon: '<%= alertIcon %>',
        showConfirmButton: <%= showConfirmButton %>,
        timer: <%= timer %>
    }).then(() => {
        window.location = '/<%= ruta %>'
    });
});