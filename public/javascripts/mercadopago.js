/* ---------------------

    MANEJO DEL CARRITO

  --------------------- */

const tarjetaPagoSubmit = document.getElementById("form-checkout__submit");
const oxxoPagoSubmit = document.getElementById("form-oxxo__submit");
tarjetaPagoSubmit.style.display = "none";
oxxoPagoSubmit.style.display = "none";

let total = 0;

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
    product01.innerText = "Añadir";
    product01Añadido = false;
  } else {
    product01.innerText = "Quitar";
    total += product01Amount;
    product01Añadido = true;
  }

  actualizarPrecio();

  if (total > 0) {
    tarjetaPagoSubmit.style.display = "block";
    oxxoPagoSubmit.style.display = "block";
  }
});

let product02Añadido = false;
const product02Amount = 2999;
const product02 = document.getElementById("product02");
product02.addEventListener("click", () => {
  if (product02Añadido) {
    total -= product02Amount;
    product02.innerText = "Añadir";
    product02Añadido = false;
  } else {
    product02.innerText = "Quitar";
    total += product02Amount;
    product02Añadido = true;
  }

  actualizarPrecio();

  if (total > 0) {
    tarjetaPagoSubmit.style.display = "block";
    oxxoPagoSubmit.style.display = "block";
  }
});

let product03Añadido = false;
const product03Amount = 999;
const product03 = document.getElementById("product03");
product03.addEventListener("click", () => {
  if (product03Añadido) {
    total -= product03Amount;
    product03.innerText = "Añadir";
    product03Añadido = false;
  } else {
    product03.innerText = "Quitar";
    total += product03Amount;
    product03Añadido = true;
  }

  actualizarPrecio();

  if (total > 0) {
    tarjetaPagoSubmit.style.display = "block";
    oxxoPagoSubmit.style.display = "block";
  }
});

/* ---------------------

    MERCADOPAGO

  --------------------- */

const successContainer = document.getElementById("successContainer");
const errorContainer = document.getElementById("errorContainer");

const showSuccess = () => {
  successContainer.style.display = "block";
  errorContainer.style.display = "none";
};

const showError = () => {
  successContainer.style.display = "none";
  errorContainer.style.display = "block";
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
      if (error) return console.warn("Form Mounted handling error: ", error);
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
      if (data.error) {
        showError();
      } else {
        showSuccess();
      }
    })
    .catch(() => showError());
});
