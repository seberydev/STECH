/* ---------------------

    MANEJO DEL CARRITO

  --------------------- */

const tarjetaPagoSubmit = document.getElementById("form-checkout__submit");
const oxxoPagoSubmit = document.getElementById("form-oxxo__submit");

let total = 0;
let UC = []

const actualizarPrecio = () => {
  const precioTotal = document.getElementById("precioTotal");
  precioTotal.innerText = `Precio Total: $${total.toLocaleString()}`;
};

actualizarPrecio();

let product01Añadido = false;
const product01Amount = 1999;
const product01 = document.getElementById("product01");
product01.addEventListener("click", () => {
  if (product01Añadido) {
    total -= product01Amount;
    product01Añadido = false;
    let a = UC.findIndex(x => x == 'Soporte Profesional\n')
    UC.splice(a, 1)
  } else {
    total += product01Amount;
    product01Añadido = true;
    UC.push('Soporte Profesional\n')
  }

  actualizarPrecio();
});

let product02Añadido = false;
const product02Amount = 2999;
const product02 = document.getElementById("product02");
product02.addEventListener("click", () => {
  if (product02Añadido) {
    total -= product02Amount;
    product02Añadido = false;
    let a = UC.findIndex(x => x == 'Equipo para Trabajo\n')
    UC.splice(a, 1)
  } else {
    total += product02Amount;
    product02Añadido = true;
    UC.push('Equipo para Trabajo\n')
  }

  actualizarPrecio();
});

let product03Añadido = false;
const product03Amount = 999;
const product03 = document.getElementById("product03");
product03.addEventListener("click", () => {
  if (product03Añadido) {
    total -= product03Amount;
    product03Añadido = false;
    let a = UC.findIndex(x => x == 'Manejo de Infraestructura\n')
    UC.splice(a, 1)
  } else {
    total += product03Amount;
    product03Añadido = true;
    UC.push('Manejo de Infraestructura\n')
  }

  actualizarPrecio();
});

// APARECER FORMULARIOS O REAPARECER ELECCIÓN DE FORMA DE PAGO
let bMP = document.getElementById('bMP')
let bOXXO = document.getElementById('bOXXO')
let fMP = document.querySelector('.fMP')
let fOXXO = document.querySelector('.fOXXO')
let crt = document.querySelector('.crt')
let back = document.getElementById('back')
let tot1 = document.getElementById('tot1')
let tot2 = document.getElementById('tot2')
const UCar = document.getElementById('UCar')
const UCar2 = document.getElementById('UCar2')

// PARA LAS ALERTAS
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

bMP.addEventListener('click', () => {
  if (total <= 0) {
    Toast.fire({
      icon: 'error',
      title: 'ERROR: Compra con valor a $0'
    })
    return
  }

  fMP.classList.remove('hidden')
  crt.classList.add('hidden')
  UCar.innerText = `Servicios Contratados:\n${UC.sort().toLocaleString().replaceAll(',', '')}`
  UCar2.innerText = `Servicios Contratados:\n${UC.sort().toLocaleString().replaceAll(',', '')}`
  tot1.innerText = `Total a Pagar: $${total.toLocaleString()}`;
})

bOXXO.addEventListener('click', () => {
  if (total <= 0) {
    Toast.fire({
      icon: 'error',
      title: 'ERROR: Compra con valor a $0'
    })
    return
  }

  fOXXO.classList.remove('hidden')
  crt.classList.add('hidden')
  UCar.innerText = `Servicios Contratados:\n${UC.sort().toLocaleString().replaceAll(',', '')}`
  UCar2.innerText = `Servicios Contratados:\n${UC.sort().toLocaleString().replaceAll(',', '')}`
  tot2.innerText = `Total a Pagar: $${total.toLocaleString()}`;
})

back.addEventListener('click', () => {
  fMP.classList.add('hidden')
  fOXXO.classList.add('hidden')
  crt.classList.remove('hidden')
})

/* ---------------------

    MERCADOPAGO

  --------------------- */

const successContainer = document.getElementById("successContainer");
const successText = document.getElementById("successText");

const showSuccess = (text = "¡Gracias Por Tu Compra!") => {
  successText.textContent = text;
  successContainer.style.display = "block";
  document.getElementById("form-oxxo__submit").style.display = "none";
  document.getElementById("form-oxxo").style.display = "none";
  document.getElementById("form-checkout").style.display = "none";
  document.getElementById("car").style.display = "none";
};

const showError = () => {
  Toast.fire({
    icon: 'error',
    title: 'Error al realizar la compra'
  })
};

const MP_PUBLIC_KEY = document.getElementById("MP_PUBLIC_KEY").value;
const mp = new MercadoPago(MP_PUBLIC_KEY);

const cardForm = mp.cardForm({
  amount: "100.5",
  autoMount: true,
  form: {
    id: "form-checkout",
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Titular de la tarjeta",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "E-mail",
    },
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Número de la tarjeta",
    },
    cardExpirationDate: {
      id: "form-checkout__cardExpirationDate",
      placeholder: "Fecha de vencimiento (MM/YYYY)",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "Código de seguridad",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Cuotas",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número de documento",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Banco emisor",
    },
  },
  callbacks: {
    onFormMounted: (error) => {
      if (error) {
        Toast.fire({
          icon: 'error',
          title: 'Error al realizar la compra'
        })
        return console.warn("Form Mounted handling error: ", error)
      };
      console.log("Form mounted");
    },
    onSubmit: (event) => {
      event.preventDefault();

      const {
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token,
        installments,
        identificationNumber,
      } = cardForm.getCardFormData();

      fetch("/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          issuer_id,
          payment_method_id,
          transaction_amount: Number(amount),
          installments: Number(installments),
          description: "Servicios STECH",
          payer: {
            email,
            identification: {
              number: identificationNumber,
            },
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            showError();
          } else {
            showSuccess();
          }
        })
        .catch(() => showError());
    },
    onFetching: (resource) => {
      console.log("Fetching resource: ", resource);

      // Animate progress bar
      const progressBar = document.querySelector(".progress-bar");
      progressBar.removeAttribute("value");

      return () => {
        progressBar.setAttribute("value", "0");
      };
    },
  },
});

const oxxoSubmit = document.getElementById("form-oxxo__submit");
const oxxoEmail = document.getElementById("form-oxxo__cardholderEmail");

oxxoSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("/process_payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_amount: total,
      description: "Servicios STECH",
      payment_method_id: "oxxo",
      payer: {
        email: oxxoEmail.value,
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        showError();
      } else {
        showSuccess(`¡Gracias Por Tu Compra! Referencia: ${data.id}`);
      }
    })
    .catch(() => showError());
});
