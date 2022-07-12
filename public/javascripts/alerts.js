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
        icon: 'error',
        title: 'Información vacía/incorrecta o inexistente'
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
                title: 'Usuario/correo ya existe'
            })
        break;

        case "4":
            Toast.fire({
                icon: 'info',
                title: 'No puedes remplazar con la misma contraseña'
            })
        break;

        case "5":
            Toast.fire({
                icon: 'info',
                title: 'Usuario/correo no existe'
            })
        break;
    }
}

// Inicio de Sesión Exitoso
if(params.has('good')){
    Swal.fire({
        icon: 'success',
        title: '¡Bienvenido, disfrute la experiencia!',
        text: 'Al continuar navegando en esta página acepta los términos, condiciones, y uso de cookies.',
        backdrop: false
    })
}

// Para que usuario vaya a checar su correo después de pedir una nueva contraseña
if(params.has('getNewP')){
    Swal.fire({
        icon: 'info',
        title: '¡Correo Enviado!',
        text: 'Revise su correo para poder cambiar su contraseña.',
        backdrop: false
    })
}

// Para cuando haya cambiado la contraseña
if(params.has('newP')){
    Swal.fire({
        icon: 'success',
        title: '¡Contraseña Actualizada!',
        text: 'Puede iniciar sesión de nuevo, pero con su nueva contraseña.',
        backdrop: false
    })
}

// Para que el usuario cheque su email para confirmar su cuenta
if(params.has('confirm')){
    Swal.fire({
        icon: 'info',
        title: '¡Nuevo Usuario Creado!',
        text: 'Revise su cuenta de correo electrónico para confirmar su cuenta.',
        backdrop: false
    })
}

// Para cuando el usuario haya confirmado su cuenta!
if(params.has('confirmed')){
    Swal.fire({
        icon: 'success',
        title: '¡Cuenta Verificada',
        text: 'Ya puede iniciar sesión con esta cuenta.',
        backdrop: false
    })
}