const params = new URLSearchParams(window.location.search)

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

// Error en Login
if(params.has('err')){
    Toast.fire({
        icon: 'info',
        title: 'ERROR: Información vacía/incorrecta'
    })
}

// Error en Registro de Usuario
if(params.has('errSU')){
    let p = params.get('errSU')

    switch (p) {
        case "1":
            Toast.fire({
                icon: 'error',
                title: 'ERROR: Formato de datos inválido'
            })
        break;

        case "2":
            Toast.fire({
                icon: 'error',
                title: 'ERROR: Las contraseñas no concuerdan'
            })
        break;

        case "3":
            Toast.fire({
                icon: 'info',
                title: 'ERROR: Usuario/correo ya existe'
            })
        break;
    }
}

// Inicio de Sesión Exitoso
if(params.has('good')){
    Toast.fire({
        icon: 'success',
        title: '¡Bienvenido, disfrute la experiencia!'
    })
}